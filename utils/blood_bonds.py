"""Lien de sang entre vampires : table SQLite et règles (offrir son sang, défi, opérations MJ)."""
import logging

import aiosqlite

from data.blood_bonds import DRAUGHT_COST, MAX_STAGE, TREMERE_FIRST_STAGE
from data.clans import canonical_clan_key
from utils import database

logger = logging.getLogger(__name__)

_COLUMNS = ("id", "guild_id", "thrall_id", "thrall_name", "regnant_kind", "regnant_ref",
            "regnant_name", "regnant_potency", "stage")

# Le rang d'un régnant joueur se lit à chaque appel : jamais d'instantané.
_SELECT = f"""
    SELECT {', '.join('b.' + c for c in _COLUMNS)},
           CASE WHEN b.regnant_kind = 'player' THEN COALESCE(v.blood_potency, 1)
                ELSE b.regnant_potency END AS defy_cost
    FROM vampire_blood_bonds b
    LEFT JOIN vampire_soif v
      ON b.regnant_kind = 'player' AND v.user_id = CAST(b.regnant_ref AS INTEGER) AND v.guild_id = b.guild_id
"""


def _bond(row) -> dict:
    return dict(zip(_COLUMNS + ("defy_cost",), row))


async def init_blood_bonds_table(db: aiosqlite.Connection) -> None:
    """Crée la table des liens de sang (appelée par init_database)."""
    await db.execute("""
        CREATE TABLE IF NOT EXISTS vampire_blood_bonds (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            guild_id INTEGER NOT NULL,
            thrall_id INTEGER NOT NULL,
            thrall_name TEXT NOT NULL,
            regnant_kind TEXT NOT NULL,
            regnant_ref TEXT NOT NULL,
            regnant_name TEXT NOT NULL,
            regnant_potency INTEGER,
            stage INTEGER NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(guild_id, thrall_id, regnant_kind, regnant_ref)
        )
    """)


async def _full_bond_elsewhere(db, guild_id: int, thrall_id: int, kind: str, ref: str) -> bool:
    """Le lié a-t-il un lien au stade 3 envers un autre régnant que (kind, ref) ?"""
    cursor = await db.execute(
        """SELECT 1 FROM vampire_blood_bonds WHERE guild_id=? AND thrall_id=? AND stage=?
           AND NOT (regnant_kind=? AND regnant_ref=?) LIMIT 1""",
        (guild_id, thrall_id, MAX_STAGE, kind, ref))
    return await cursor.fetchone() is not None


async def offer_blood(guild_id: int, regnant_id: int, regnant_name: str, regnant_clan: str,
                      thrall_id: int, thrall_name: str) -> dict:
    """Une gorgée du régnant au lié : refus sans rien prélever, sinon 1 Vitae et un stade de plus."""
    if regnant_id == thrall_id:
        raise ValueError("Tu ne peux pas te lier à toi-même.")
    ref = str(regnant_id)
    # Vérifications, prélèvement et écriture dans une seule transaction : deux gorgées simultanées
    # s'enchaînent, et une écriture qui échoue ne coûte aucune Vitae.
    async with aiosqlite.connect(database.DATABASE_PATH) as db:
        await db.execute("BEGIN IMMEDIATE")
        if await _full_bond_elsewhere(db, guild_id, thrall_id, "player", ref):
            raise ValueError("Son cœur appartient déjà à un autre.")
        cursor = await db.execute(
            "SELECT stage FROM vampire_blood_bonds WHERE guild_id=? AND thrall_id=? AND regnant_kind='player' AND regnant_ref=?",
            (guild_id, thrall_id, ref))
        row = await cursor.fetchone()
        if row and row[0] >= MAX_STAGE:
            raise ValueError("Le lien est déjà complet.")
        if row:
            stage = row[0] + 1
        else:
            stage = TREMERE_FIRST_STAGE if canonical_clan_key(regnant_clan) == "tremere" else 1
        # Le prélèvement vient en dernier : un refus ne coûte rien, une réserve vide lève ici.
        cursor = await db.execute(
            "SELECT soif_level, blood_potency FROM vampire_soif WHERE user_id=? AND guild_id=?", (regnant_id, guild_id))
        soif = await cursor.fetchone()
        current, bp = (soif[0], soif[1]) if soif else (0, 1)
        if current - DRAUGHT_COST < 0:
            raise ValueError("Réserve de Vitae insuffisante. Aucune dépense effectuée.")
        vitae = min(current - DRAUGHT_COST, database.get_max_vitae(bp))
        await db.execute(
            """INSERT INTO vampire_soif (user_id, guild_id, soif_level, blood_potency, saturation_points, last_updated)
               VALUES (?, ?, ?, ?, 0, CURRENT_TIMESTAMP)
               ON CONFLICT(user_id, guild_id) DO UPDATE SET soif_level=excluded.soif_level, last_updated=CURRENT_TIMESTAMP""",
            (regnant_id, guild_id, vitae, bp))
        await db.execute(
            """INSERT INTO vampire_blood_bonds
                   (guild_id, thrall_id, thrall_name, regnant_kind, regnant_ref, regnant_name, stage)
               VALUES (?, ?, ?, 'player', ?, ?, ?)
               ON CONFLICT(guild_id, thrall_id, regnant_kind, regnant_ref) DO UPDATE SET
                   stage=excluded.stage, thrall_name=excluded.thrall_name,
                   regnant_name=excluded.regnant_name, updated_at=CURRENT_TIMESTAMP""",
            (guild_id, thrall_id, thrall_name, ref, regnant_name, stage))
        await db.commit()
    logger.info("Lien de sang %s -> %s : stade %s (guilde %s)", thrall_id, regnant_id, stage, guild_id)
    return {"stage": stage, "vitae": vitae, "first": row is None}


async def _query(guild_id: int, where: str = "", params: tuple = ()) -> list[dict]:
    async with aiosqlite.connect(database.DATABASE_PATH) as db:
        cursor = await db.execute(f"{_SELECT} WHERE b.guild_id = ? {where}", (guild_id, *params))
        return [_bond(row) for row in await cursor.fetchall()]


def _order(bonds: list[dict], name_key: str) -> list[dict]:
    return sorted(bonds, key=lambda b: (-b["stage"], b[name_key].casefold()))


async def get_bonds(guild_id: int, user_id: int) -> dict:
    """Liens d'un joueur dans les deux sens, du plus fort au plus faible puis par nom."""
    bound = await _query(guild_id, "AND b.thrall_id = ?", (user_id,))
    drank = await _query(guild_id, "AND b.regnant_kind = 'player' AND b.regnant_ref = ?", (str(user_id),))
    return {"bound_to": _order(bound, "regnant_name"), "drank_from_me": _order(drank, "thrall_name")}


async def defy_bond(guild_id: int, thrall_id: int) -> dict:
    """Agir contre son régnant (stade 3) : prélève son rang, sans rien prélever si la réserve ne suffit pas."""
    full = await _query(guild_id, "AND b.thrall_id = ? AND b.stage = ?", (thrall_id, MAX_STAGE))
    if not full:
        raise ValueError("Aucun lien complet à défier.")
    bond = full[0]
    vitae = await database.modify_vitae(thrall_id, guild_id, -bond["defy_cost"])
    return {"vitae": vitae, "cost": bond["defy_cost"], "regnant_name": bond["regnant_name"]}


async def list_guild_bonds(guild_id: int) -> list[dict]:
    """Tous les liens du serveur, pour CAIN."""
    bonds = await _query(guild_id)
    return sorted(bonds, key=lambda b: (b["thrall_name"].casefold(), -b["stage"], b["regnant_name"].casefold()))


async def list_guild_vampires(guild_id: int) -> list[dict]:
    """Vampires du serveur (race vampire et clan) ; `name` vide si la fiche n'a pas de nom."""
    async with aiosqlite.connect(database.DATABASE_PATH) as db:
        cursor = await db.execute(
            """SELECT p.user_id, c.name FROM players p
               LEFT JOIN character_sheets c ON c.user_id = p.user_id AND c.guild_id = p.guild_id
               WHERE p.guild_id = ? AND p.race = 'vampire' AND p.clan IS NOT NULL AND p.clan != ''""",
            (guild_id,))
        rows = await cursor.fetchall()
    return [{"id": uid, "name": (name or "").strip()} for uid, name in rows]


def _check_stage(stage: int) -> None:
    if not 1 <= stage <= MAX_STAGE:
        raise ValueError("Stade invalide (1 à 3).")


async def gm_create_npc_bond(guild_id: int, thrall_id: int, thrall_name: str, npc_id: str | None,
                             npc_name: str, npc_potency: int, stage: int) -> dict:
    """Le MJ lie un joueur à un PNJ (registre ou nom libre)."""
    _check_stage(stage)
    if not 1 <= npc_potency <= 5:
        raise ValueError("Rang invalide (1 à 5).")
    ref = npc_id or "name:" + npc_name.strip().casefold()
    async with aiosqlite.connect(database.DATABASE_PATH) as db:
        await db.execute("BEGIN IMMEDIATE")
        cursor = await db.execute(
            "SELECT 1 FROM vampire_blood_bonds WHERE guild_id=? AND thrall_id=? AND regnant_kind='npc' AND regnant_ref=?",
            (guild_id, thrall_id, ref))
        if await cursor.fetchone():
            raise ValueError("Ce lien existe déjà : change son stade.")
        if stage == MAX_STAGE and await _full_bond_elsewhere(db, guild_id, thrall_id, "npc", ref):
            raise ValueError("Efface d'abord l'autre lien au stade 3.")
        cursor = await db.execute(
            """INSERT INTO vampire_blood_bonds
                   (guild_id, thrall_id, thrall_name, regnant_kind, regnant_ref, regnant_name, regnant_potency, stage)
               VALUES (?, ?, ?, 'npc', ?, ?, ?, ?)""",
            (guild_id, thrall_id, thrall_name, ref, npc_name.strip(), npc_potency, stage))
        bond_id = cursor.lastrowid
        await db.commit()
    return (await _query(guild_id, "AND b.id = ?", (bond_id,)))[0]


async def gm_set_stage(guild_id: int, bond_id: int, stage: int) -> dict | None:
    """Change le stade d'un lien ; None si le lien n'est pas de ce serveur."""
    _check_stage(stage)
    async with aiosqlite.connect(database.DATABASE_PATH) as db:
        await db.execute("BEGIN IMMEDIATE")
        cursor = await db.execute(
            "SELECT thrall_id, regnant_kind, regnant_ref FROM vampire_blood_bonds WHERE id=? AND guild_id=?",
            (bond_id, guild_id))
        row = await cursor.fetchone()
        if not row:
            return None
        if stage == MAX_STAGE and await _full_bond_elsewhere(db, guild_id, row[0], row[1], row[2]):
            raise ValueError("Efface d'abord l'autre lien au stade 3.")
        await db.execute(
            "UPDATE vampire_blood_bonds SET stage=?, updated_at=CURRENT_TIMESTAMP WHERE id=? AND guild_id=?",
            (stage, bond_id, guild_id))
        await db.commit()
    return (await _query(guild_id, "AND b.id = ?", (bond_id,)))[0]


async def gm_delete_bond(guild_id: int, bond_id: int) -> bool:
    """Efface un lien de ce serveur ; False s'il n'existe pas."""
    async with aiosqlite.connect(database.DATABASE_PATH) as db:
        cursor = await db.execute("DELETE FROM vampire_blood_bonds WHERE id=? AND guild_id=?", (bond_id, guild_id))
        await db.commit()
        return cursor.rowcount > 0


async def clear_blood_bonds(guild_id: int, user_id: int) -> int:
    """Changement de clan : efface les liens où le personnage est lié ou régnant joueur."""
    async with aiosqlite.connect(database.DATABASE_PATH) as db:
        cursor = await db.execute(
            """DELETE FROM vampire_blood_bonds WHERE guild_id=?
               AND (thrall_id=? OR (regnant_kind='player' AND regnant_ref=?))""",
            (guild_id, user_id, str(user_id)))
        await db.commit()
        return cursor.rowcount
