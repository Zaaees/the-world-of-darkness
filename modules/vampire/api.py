"""Authenticated game data bridge; progression fields are never client writable."""
import json
import random
import re
from pathlib import Path

from aiohttp import web
from data.blood_actions import get_action_by_id, get_action_points, is_action_available, is_once, normalize_clan
from data.config import GHOUL_BLOOD_COST, ROLE_FONDATEUR, ROLE_MJ_VAMPIRE
from utils import blood_bonds
from utils.database import apply_vitae_upkeep, get_max_vitae, get_npc, get_npcs, get_vampire_data, modify_vitae, spend_vitae_for_power
from utils.sheets_client import sheets_request, SheetsUnavailable
from utils.site_content import action_display

GHOULS = json.loads((Path(__file__).parents[2] / 'data/ghoul_disciplines.json').read_text(encoding='utf-8'))
SCENE_LINK = r'https://(?:canary\.|ptb\.)?discord\.com/channels/{guild}/\d+(?:/\d+)?'


def new_blood_ghouls(proposed, character):
    """Blood ghouls that were not in the saved register: each one is paid in Vitae."""
    known = {g.get('id') for g in character.get('ghouls', [])}
    return [g for g in proposed if g['type'] == 'blood' and g['id'] not in known]


def validate_ghouls(proposed, character):
    if not isinstance(proposed, list) or len(proposed) > 100:
        raise ValueError("Registre de goules invalide (100 entrées maximum).")
    bp = int(character.get('bloodPotency', 1))
    disciplines = GHOULS['clans'].get(normalize_clan(character.get('clan')), [])
    old = {g['id']: g for g in character.get('ghouls', [])}
    if any(not isinstance(g, dict) for g in proposed):
        raise ValueError('Goule invalide.')
    if sum(g.get('type', 'blood') == 'blood' for g in proposed) > GHOULS['limits'][str(bp)]:
        raise ValueError("Limite de goules de sang atteinte.")
    if sum(g.get('type') == 'mind' for g in proposed) > GHOULS['mindLimits'].get(str(bp), 0):
        raise ValueError("Limite de goules de l'esprit atteinte.")
    ids, result = set(), []
    for item in proposed:
        if not isinstance(item, dict) or not isinstance(item.get('id'), str) or not 1 <= len(item['id']) <= 100 or item['id'] in ids:
            raise ValueError("Identifiant de goule invalide.")
        ids.add(item['id'])
        clean = {'id': item['id'][:100]}
        for field in ('name', 'description', 'role', 'notes'):
            value = item.get(field) or ''
            if not isinstance(value, str) or len(value) > (100 if field == 'name' else 4000):
                raise ValueError("Texte de goule invalide ou trop long.")
            clean[field] = value.strip()
        if not clean['name']:
            raise ValueError("Le nom de la goule est requis.")
        previous = old.get(item['id'])
        clean['type'] = previous.get('type', 'blood') if previous else item.get('type', 'blood')
        if clean['type'] not in ('blood', 'mind'):
            raise ValueError("Type de goule invalide.")
        if clean['type'] == 'mind' and not (bp >= 4 and 'Domination' in disciplines):
            raise ValueError("La domination requise n'est pas disponible.")
        clean['status'] = 'actif'
        if clean['type'] == 'blood':
            if not disciplines:
                raise ValueError("Disciplines de clan introuvables.")
            discipline = previous.get('discipline_name') if previous else None
            if discipline not in disciplines:
                discipline = random.choice(disciplines)
            clean.update(discipline_name=discipline, discipline_power=GHOULS['powers'][discipline])
        result.append(clean)
    return result


async def character_handler(request):
    user_id = str(request['verified_user_id'])
    try:
        data = await sheets_request('get', userId=user_id)
        if request.method == 'GET':
            return web.json_response(data)
        character = data.get('character')
        if not character:
            return web.json_response({'success': False, 'error': 'Personnage introuvable.'}, status=404)
        payload = await request.json()
        if not isinstance(payload, dict) or set(payload) - {'ghouls'}:
            raise ValueError('Seul le registre des goules peut être modifié ici.')
        ghouls = validate_ghouls(payload.get('ghouls'), character)
        charged = new_blood_ghouls(ghouls, character)
        vitae = None
        if charged:
            # Binding a ghoul is three nights of the vampire's own blood: paid before the register is saved.
            guild_id = int(request['verified_guild_id'])
            await get_vampire_data(int(user_id), guild_id)
            try:
                vitae = await modify_vitae(int(user_id), guild_id, -GHOUL_BLOOD_COST * len(charged))
            except ValueError:
                raise ValueError(f"Réserve de Vitae insuffisante : lier une goule de sang coûte {GHOUL_BLOOD_COST} Vitae.")
        await sheets_request('save', userId=user_id, data={'ghouls': ghouls})
        return web.json_response({'success': True, 'ghouls': ghouls, 'vitae': vitae})
    except ValueError as exc:
        return web.json_response({'success': False, 'error': str(exc) or 'Registre invalide.'}, status=400)
    except (TypeError, KeyError):
        return web.json_response({'success': False, 'error': 'Registre invalide. Vérifiez les noms, les limites et les disciplines.'}, status=400)
    except SheetsUnavailable as exc:
        return web.json_response({'success': False, 'error': str(exc)}, status=503)


async def submit_action_handler(request):
    try:
        data = await request.json()
        user_id, guild_id = str(request['verified_user_id']), str(request['verified_guild_id'])
        action = get_action_by_id(data.get('actionId'))
        character = (await sheets_request('get', userId=user_id)).get('character') or {}
        bp = int(character.get('bloodPotency', 1))
        if not action or bp >= 5 or not is_action_available(action, bp) or (action.get('clan') and action['clan'] != normalize_clan(character.get('clan'))):
            raise ValueError('Action indisponible pour ce personnage.')
        if is_once(action) and any(x in character.get('completedActions', []) for x in [action['id'], *action.get('legacyCompletedIds', [])]):
            raise ValueError('Cette expérience a déjà été accomplie.')
        scene = data.get('sceneLink', '').strip()
        if not re.fullmatch(SCENE_LINK.format(guild=re.escape(guild_id)), scene):
            raise ValueError('Indiquez un lien de scène Discord de ce serveur.')
        action = await action_display(action, int(guild_id), request.app.get('content_db_path'))
        result = await sheets_request('submit_action', userId=user_id, guildId=guild_id,
            actionId=action['id'], actionName=action['name'], points=get_action_points(action, bp), sceneLink=scene)
        return web.json_response(result, status=202)
    except (ValueError, TypeError, AttributeError) as exc:
        return web.json_response({'success': False, 'error': str(exc)}, status=400)
    except SheetsUnavailable as exc:
        return web.json_response({'success': False, 'error': str(exc)}, status=503)


async def vitae_handler(request):
    """GET: current reserve (after upkeep). POST {powerId}: pay a power's blood cost."""
    user_id, guild_id = int(request['verified_user_id']), int(request['verified_guild_id'])
    try:
        vampire = await get_vampire_data(user_id, guild_id)
        if not vampire:
            return web.json_response({'success': False, 'error': 'Personnage introuvable.'}, status=404)
        bp = int(vampire.get('blood_potency', 1))
        if request.method == 'GET':
            upkeep = await apply_vitae_upkeep(user_id, guild_id)
            return web.json_response({'success': True, 'vitae': upkeep['vitae'], 'max_vitae': get_max_vitae(bp),
                                      'upkeep_lost': upkeep['lost'], 'blood_potency': bp})
        payload = await request.json()
        power_id = payload.get('powerId') if isinstance(payload, dict) else None
        if not isinstance(power_id, str):
            raise ValueError('Pouvoir inconnu.')
        result = await spend_vitae_for_power(user_id, guild_id, vampire.get('clan'), bp, power_id)
        return web.json_response({'success': True, 'vitae': result['vitae'], 'max_vitae': result['max_vitae'],
                                  'cost': result['cost'], 'power': {'id': result['power']['id'], 'name': result['power']['name']}})
    except (ValueError, TypeError, AttributeError) as exc:
        return web.json_response({'success': False, 'error': str(exc) or 'Requête invalide.'}, status=400)
    except SheetsUnavailable as exc:
        return web.json_response({'success': False, 'error': str(exc)}, status=503)


def serialize_bond(bond: dict) -> dict:
    """Les identifiants Discord restent des chaînes côté JS ; l'id du lien reste un entier."""
    return {**bond, 'thrall_id': str(bond['thrall_id']), 'regnant_ref': str(bond['regnant_ref'])}


def is_vampire_gm(request) -> bool:
    return any(role.id in (ROLE_MJ_VAMPIRE, ROLE_FONDATEUR) for role in request['verified_member'].roles)


def _error(message: str, status: int):
    return web.json_response({'success': False, 'error': message}, status=status)


def _bond_id(request):
    try:
        return int(request.match_info['bond_id'])
    except (KeyError, ValueError):
        return None


async def player_bonds_handler(request):
    bonds = await blood_bonds.get_bonds(int(request['verified_guild_id']), int(request['verified_user_id']))
    return web.json_response({'success': True, **{key: [serialize_bond(b) for b in value] for key, value in bonds.items()}})


async def gm_bonds_list_handler(request):
    if not is_vampire_gm(request):
        return _error('Réservé aux MJ.', 403)
    guild_id = int(request['verified_guild_id'])
    return web.json_response({
        'success': True,
        'bonds': [serialize_bond(b) for b in await blood_bonds.list_guild_bonds(guild_id)],
        'vampires': [{'id': str(v['id']), 'name': v['name']} for v in await blood_bonds.list_guild_vampires(guild_id)],
        'npcs': [{'id': n['id'], 'name': n['name'], 'blood_potency': n['blood_potency']} for n in await get_npcs(guild_id)],
    })


async def gm_bonds_create_handler(request):
    if not is_vampire_gm(request):
        return _error('Réservé aux MJ.', 403)
    guild_id = int(request['verified_guild_id'])
    try:
        payload = await request.json()
        if not isinstance(payload, dict):
            raise ValueError('Requête invalide.')
        vampires = {str(v['id']): v['name'] for v in await blood_bonds.list_guild_vampires(guild_id)}
        thrall_key = str(payload.get('thrallId'))
        if thrall_key not in vampires:
            raise ValueError("Ce membre n'a pas de personnage vampire.")
        npc_id = payload.get('npcId')
        if npc_id:
            npc = await get_npc(str(npc_id))
            if not npc or npc['guild_id'] != guild_id:
                return _error('PNJ introuvable.', 404)
            npc_name, potency = npc['name'], npc['blood_potency']
        else:
            npc_id, npc_name, potency = None, payload.get('npcName'), payload.get('potency')
            if not isinstance(npc_name, str) or not npc_name.strip():
                raise ValueError('Le nom du PNJ est requis.')
        if not isinstance(potency, int) or isinstance(potency, bool):
            raise ValueError('Rang invalide (1 à 5).')
        stage = payload.get('stage')
        if not isinstance(stage, int) or isinstance(stage, bool):
            raise ValueError('Stade invalide (1 à 3).')
        bond = await blood_bonds.gm_create_npc_bond(
            guild_id, int(thrall_key), vampires[thrall_key], npc_id, npc_name, potency, stage)
    except (ValueError, TypeError) as exc:
        return _error(str(exc) or 'Requête invalide.', 400)
    return web.json_response({'success': True, 'bond': serialize_bond(bond)}, status=201)


async def gm_bond_update_handler(request):
    if not is_vampire_gm(request):
        return _error('Réservé aux MJ.', 403)
    bond_id = _bond_id(request)
    if bond_id is None:
        return _error('Lien introuvable.', 404)
    try:
        payload = await request.json()
        stage = payload.get('stage') if isinstance(payload, dict) else None
        if not isinstance(stage, int) or isinstance(stage, bool):
            raise ValueError('Stade invalide (1 à 3).')
        bond = await blood_bonds.gm_set_stage(int(request['verified_guild_id']), bond_id, stage)
    except (ValueError, TypeError) as exc:
        return _error(str(exc) or 'Requête invalide.', 400)
    if bond is None:
        return _error('Lien introuvable.', 404)
    return web.json_response({'success': True, 'bond': serialize_bond(bond)})


async def gm_bond_delete_handler(request):
    if not is_vampire_gm(request):
        return _error('Réservé aux MJ.', 403)
    bond_id = _bond_id(request)
    if bond_id is None or not await blood_bonds.gm_delete_bond(int(request['verified_guild_id']), bond_id):
        return _error('Lien introuvable.', 404)
    return web.json_response({'success': True})


def register_routes(app):
    app.router.add_get('/api/vampire/character', character_handler)
    app.router.add_post('/api/vampire/character', character_handler)
    app.router.add_post('/api/vampire/actions', submit_action_handler)
    app.router.add_get('/api/vampire/vitae', vitae_handler)
    app.router.add_post('/api/vampire/vitae', vitae_handler)
    app.router.add_get('/api/vampire/bonds', player_bonds_handler)
    app.router.add_get('/api/gm/bonds', gm_bonds_list_handler)
    app.router.add_post('/api/gm/bonds', gm_bonds_create_handler)
    app.router.add_put('/api/gm/bonds/{bond_id}', gm_bond_update_handler)
    app.router.add_delete('/api/gm/bonds/{bond_id}', gm_bond_delete_handler)
