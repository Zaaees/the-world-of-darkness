# Lien de sang — plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal :** créer le Lien de sang entre vampires (joueurs et PNJ), l'afficher au panneau, sur la fiche et dans CAIN, aligner les goules et l'écrire au Règlement.

**Architecture :** une table SQLite `vampire_blood_bonds` et ses règles dans `utils/blood_bonds.py` (textes dans `data/blood_bonds.py`). Le panneau Discord l'utilise via `modules/vampire/views/bonds.py`. L'API (`modules/vampire/api.py`) l'expose au site : section en lecture sur la fiche, onglet MJ dans CAIN.

**Tech Stack :** Python 3.11, discord.py 2, aiosqlite, aiohttp ; React 19, Vite, TailwindCSS, Vitest + Testing Library.

**Spec :** `docs/superpowers/specs/2026-11-07-lien-de-sang-design.md`

## Global Constraints

- Werewolf en pause : ne toucher à aucun fichier Werewolf.
- Pas d'import croisé `modules/vampire` ↔ `modules/werewolf`.
- I/O asynchrones uniquement ; `logging`, jamais `print()`.
- React : un composant par fichier, `.jsx`, hooks, TailwindCSS seulement (pas de style inline), affichage mobile vérifié.
- IDs Discord en chaînes côté JS et dans tout JSON renvoyé par l'API.
- Tout texte de nouvelle interface passe par `SiteText`/`siteText` avec une entrée dans `data/site_content.json`. Les clés existantes ne se renumérotent jamais ; nouvelles clés : `vampire.bonds.*` (interface) et `vampire.rules.bond.*` (Règlement). Les nouvelles entrées s'insèrent juste après l'entrée `vampire.text.01471`, pas en fin de fichier (fusion avec les sessions parallèles).
- Variables de texte au format `{v0}`, `{v1}`.
- Une gorgée coûte **1 Vitae** au régnant. La première gorgée d'un régnant **Tremere** lie au **stade 2**. Stade maximal 3.
- Défier le lien coûte le **rang du régnant** (joueur : rang actuel ; PNJ : `regnant_potency`).
- Messages de refus exacts : `"Son cœur appartient déjà à un autre."`, `"Le lien est déjà complet."`, `"Réserve de Vitae insuffisante. Aucune dépense effectuée."` (message existant de `modify_vitae`), `"Efface d'abord l'autre lien au stade 3."`.
- Le Règlement reprend mot pour mot l'encadré de la spec (section « Règlement »).
- Ne pas pousser, ne pas ouvrir de PR sans l'accord de l'utilisateur.

## Review Focus

1. Le régnant choisit au sélecteur un bot, lui-même ou un membre sans personnage vampire → refus clair, aucune Vitae prélevée.
2. Le panneau éphémère a expiré (300 s) pendant le choix de la cible → la validation passe quand même et revient sur un panneau neuf (`panel.clone`).
3. Plus de 25 options dans « Utiliser un pouvoir… » → l'entrée « Défier le lien » reste présente, placée en tête.
4. Noms longs ou nombreux liens → aucun champ d'embed au-delà de 1024 caractères ; au plus 5 noms listés côté régnant.
5. Le MJ saisit un PNJ libre déjà lié au même joueur, avec une autre casse ou des espaces → même `regnant_ref`, refus `"Ce lien existe déjà : change son stade."`.

---

### Task 1 : table et règles du lien

**Files :**
- Create : `data/blood_bonds.py`, `utils/blood_bonds.py`, `tests/test_blood_bonds.py`
- Modify : `utils/database.py` (dans `init_database`, avant le `commit` final : `await init_blood_bonds_table(db)`)

**Interfaces :**
- Produces, `data/blood_bonds.py` :
  - `DRAUGHT_COST = 1`, `TREMERE_FIRST_STAGE = 2`, `MAX_STAGE = 3` ;
  - `STAGE_TEXT: dict[int, str]` avec `{name}` (textes stades 1-3 de la spec, au tutoiement) ;
  - `DIRECTIVE = "Tu ne peux pas agir contre {name}. Chaque action contre lui te coûte {cost} Vitae : déclare-la avec « Défier le lien »."` ;
  - `CARD_TEXT: dict[int, str]` avec `{thrall}`/`{regnant}` : 1 → `"🩸 {thrall} boit le sang de {regnant}. Le lien se noue."`, 2 → `"🩸 {thrall} boit le sang de {regnant}. Le lien se resserre."`, 3 → `"🩸 {thrall} est désormais lié à {regnant}."`.
- Produces, `utils/blood_bonds.py` (toutes les fonctions lisent `utils.database.DATABASE_PATH` à l'appel). Un *bond* est un `dict` : `id, guild_id, thrall_id, thrall_name, regnant_kind, regnant_ref, regnant_name, regnant_potency, stage, defy_cost`. Ici `defy_cost` = `regnant_potency` pour un PNJ, sinon `vampire_soif.blood_potency` du régnant (1 par défaut).
  - `async init_blood_bonds_table(db: aiosqlite.Connection) -> None` : schéma de la spec, plus `UNIQUE(guild_id, thrall_id, regnant_kind, regnant_ref)`.
  - `async offer_blood(guild_id: int, regnant_id: int, regnant_name: str, regnant_clan: str, thrall_id: int, thrall_name: str) -> dict` : renvoie `{'stage': int, 'vitae': int, 'first': bool}`, ou lève `ValueError` avec un message de refus. Ordre : soi-même (`"Tu ne peux pas te lier à toi-même."`), stade 3 envers un autre, stade 3 envers soi, puis prélèvement `modify_vitae(regnant_id, guild_id, -DRAUGHT_COST)` et upsert. Le stade et les deux noms se mettent à jour ; Tremere se détecte avec `canonical_clan_key(regnant_clan) == 'tremere'` sur une première ligne.
  - `async get_bonds(guild_id: int, user_id: int) -> dict` : `{'bound_to': [bond], 'drank_from_me': [bond]}`, triés par stade décroissant puis nom.
  - `async defy_bond(guild_id: int, thrall_id: int) -> dict` : `{'vitae': int, 'cost': int, 'regnant_name': str}`. Lève `ValueError("Aucun lien complet à défier.")` sans lien au stade 3, ou le message de `modify_vitae`.
  - `async list_guild_bonds(guild_id: int) -> list[dict]`.
  - `async list_guild_vampires(guild_id: int) -> list[dict]` : `[{'id': int, 'name': str}]` depuis `players` (`race='vampire'`, clan non nul). Le nom vient de `character_sheets.name`, sinon `"Vampire inconnu"`.
  - `async gm_create_npc_bond(guild_id: int, thrall_id: int, thrall_name: str, npc_id: str | None, npc_name: str, npc_potency: int, stage: int) -> dict` : `regnant_ref = npc_id` ou `"name:" + npc_name.strip().casefold()`. Lève `ValueError` pour un stade ou un rang hors 1-5/1-3, un doublon (`"Ce lien existe déjà : change son stade."`) ou l'exclusivité (`"Efface d'abord l'autre lien au stade 3."`).
  - `async gm_set_stage(guild_id: int, bond_id: int, stage: int) -> dict | None` : `None` si absent de ce serveur ; exclusivité comme ci-dessus.
  - `async gm_delete_bond(guild_id: int, bond_id: int) -> bool`.
  - `async clear_blood_bonds(guild_id: int, user_id: int) -> int` : lignes supprimées où l'utilisateur est lié ou régnant joueur.

- [ ] **Step 1 : écrire les tests qui échouent** (`tests/test_blood_bonds.py`). Fixture `db` copiée de `tests/test_frenzy.py` ; seed par `set_blood_potency` et `set_vampire_soif`. Tests :
  - `test_three_draughts_bind_and_each_costs_one_vitae` : régnant BP 3 à 12 Vitae ; trois `offer_blood` → stades 1, 2, 3, réserve 11 → 10 → 9.
  - `test_first_tremere_draught_binds_at_stage_two` : clan `"Tremere"` → stade 2, puis 3.
  - `test_refusals_spend_nothing` (paramétré) :
    - soi-même ;
    - réserve à 0 ;
    - cible au stade 3 envers un autre → `"Son cœur appartient déjà à un autre."` ;
    - stade 3 envers soi → `"Le lien est déjà complet."`.
    Dans chaque cas, la réserve est inchangée et le stade aussi.
  - `test_partial_bonds_to_others_survive_a_full_bond` : stade 1 envers A, puis 3 envers B → les deux lignes existent.
  - `test_defy_costs_the_regnant_rank` :
    - régnant joueur BP 4 → coût 4 ;
    - PNJ de rang 5 → coût 5 ;
    - réserve 3 face à un coût 4 → `ValueError`, réserve inchangée ;
    - aucun stade 3 → `"Aucun lien complet à défier."`.
  - `test_clan_change_clears_both_directions` : lié et régnant ; `clear_blood_bonds` renvoie 2 ; les liens d'un autre serveur restent.
  - `test_gm_npc_bonds_are_exclusive_and_normalised` : `"  Le Prince "` puis `"le prince"` → doublon refusé ; un stade 3 PNJ alors qu'un stade 3 joueur existe → refusé ; `gm_set_stage` et `gm_delete_bond` sur un autre `guild_id` → `None` / `False`.
  - `test_guild_vampires_list_names` : deux vampires dont un sans fiche → `"Vampire inconnu"` ; un loup-garou exclu.
- [ ] **Step 2 :** `pytest tests/test_blood_bonds.py -v` → FAIL (`ModuleNotFoundError: utils.blood_bonds`).
- [ ] **Step 3 :** implémenter `data/blood_bonds.py`, `utils/blood_bonds.py` et l'appel dans `init_database`. Vérifier l'exclusivité et prélever dans la même fonction, prélèvement en dernier.
- [ ] **Step 4 :** `pytest tests/test_blood_bonds.py tests/test_frenzy.py tests/test_vitae_economy.py -v` → PASS.
- [ ] **Step 5 :** commit `Créer le registre des Liens de sang`.

### Task 2 : panneau `/vampire`

**Files :**
- Create : `modules/vampire/views/bonds.py`
- Modify : `modules/vampire/views/panel.py`, `modules/vampire/cogs/commands.py`
- Test : `tests/test_blood_bonds.py` (section panneau)

**Interfaces :**
- Consumes : tout le Task 1 ; `post_card` de `modules/vampire/views/frenzy.py`.
- Produces, `modules/vampire/views/bonds.py` :
  - `async character_name(guild_id: int, member: discord.abc.User) -> str` : nom de la fiche, sinon `member.display_name`.
  - `bond_fields(bonds: dict) -> list[tuple[str, str]]` :
    - « ⛓️ Liens de sang » (`bound_to`, une ligne `**nom** — stade N : phrase`) ;
    - « Directive de Jeu » si un stade 3 existe ;
    - « 🩸 Ont bu ton sang » (5 noms au plus, puis `…et N autres`).
    Chaque valeur est tronquée à 1024 caractères ; liste vide sans aucun lien.
  - `DEFY_OPTION = "bond:defy"` ; `defy_option(bonds: dict) -> discord.SelectOption | None` : libellé `Défier le lien envers {nom} ({cost} Vitae)`.
  - `class OfferBloodView(ui.View)` : `ui.UserSelect` + `BackButton` (réutilisé de `frenzy.py`). Au choix : `get_player` de la cible (bot, sans race vampire ou sans clan → `"Ce membre n'a pas de personnage vampire."`), `offer_blood`, `post_card` d'un embed `CARD_TEXT[stage]`, avec `content=member.mention` pour prévenir le lié (`post_card` reçoit un paramètre optionnel `content: Optional[str] = None`, transmis à `channel.send`, sans changer ses appels existants). Retour sur `panel.clone(note)`, avec la note `🩸 Tu offres ton sang à {nom} : lien au stade {N}.`, ou la variante « annonce impossible » de la Frénésie.
- Modifications de `panel.py` :
  - `VampirePanel.__init__(…, bonds: Optional[dict] = None)` ; `self.bonds` conservé par `clone`.
  - `create_embed` ajoute `bond_fields(self.bonds)` après la compulsion.
  - Dans `PowerSelect`, `defy_option` en **première** position. Sa branche appelle `defy_bond`, met la note `⛓️ Tu défies ton lien envers {nom} : {cost} Vitae versés.` et garde la règle « à sec » existante.
  - Bouton `offer_button` « Offrir mon sang » 🩸, ligne 2, désactivé quand `soif_level == 0` ; il édite le message vers `OfferBloodView`.
  - Au rang 5, le texte « Alimentation » ajoute ` (cette chasse ne te lie pas)`.
  - `ClanSelectMenu.callback` appelle `clear_blood_bonds` à côté de `clear_frenzy_data`.
- `commands.py` : `bonds=await get_bonds(guild_id, user_id)` passé au panneau.

- [ ] **Step 1 : tests qui échouent :**
  - `test_bond_fields_show_stage_directive_and_regnant_list` : stade 3 → directive contenant le coût ; 7 liés → 5 noms et `…et 2 autres` ; nom de 2 000 caractères → valeurs ≤ 1024.
  - `test_defy_option_comes_first_even_with_many_powers` : `PowerSelect` d'un panneau Tremere BP 5 avec un stade 3 → `options[0].value == "bond:defy"` et `len(options) <= 25`.
  - `test_offer_refuses_a_member_without_vampire` : cible bot → message d'erreur éphémère, `modify_vitae` non appelé (mocks comme dans `test_frenzy.py`).
  - `test_zenith_feeding_text_says_it_does_not_bind`.
- [ ] **Step 2 :** `pytest tests/test_blood_bonds.py -v` → FAIL sur ces tests.
- [ ] **Step 3 :** implémenter `views/bonds.py` et les modifications ci-dessus.
- [ ] **Step 4 :** `pytest tests/test_blood_bonds.py tests/test_frenzy.py -v` → PASS ; `python -c "import main"` sans erreur d'import.
- [ ] **Step 5 :** commit `Offrir son sang et défier le lien depuis le panneau`.

### Task 3 : API joueur et MJ

**Files :**
- Modify : `modules/vampire/api.py`
- Test : `tests/test_blood_bonds.py` (section API)

**Interfaces :**
- Consumes : Task 1.
- Produces :
  - `serialize_bond(bond: dict) -> dict` : `thrall_id` et `regnant_ref` en `str` ; `id` reste un entier.
  - `is_vampire_gm(request) -> bool` : `{ROLE_MJ_VAMPIRE, ROLE_FONDATEUR}` parmi les rôles de `request['verified_member']`.
  - `GET /api/vampire/bonds` → `{'success': True, 'bound_to': [...], 'drank_from_me': [...]}`.
  - `GET /api/gm/bonds` → `{'success': True, 'bonds': [...], 'vampires': [{'id': str, 'name': str}], 'npcs': [{'id', 'name', 'blood_potency'}]}` (`get_npcs(guild_id)`).
  - `POST /api/gm/bonds` corps `{thrallId: str, npcId?: str, npcName?: str, potency?: int, stage: int}`. Avec `npcId`, nom et rang viennent du registre (`get_npc`, même serveur, sinon 404). Réponse `{'success': True, 'bond': …}`, statut 201.
  - `PUT /api/gm/bonds/{bond_id}` `{stage}`, `DELETE /api/gm/bonds/{bond_id}` : 404 hors serveur, 403 non-MJ, 400 sur `ValueError`.
  - Routes ajoutées dans `register_routes`.
- [ ] **Step 1 : tests qui échouent** (requêtes simulées comme dans `tests/test_vampire_readiness.py`, base temporaire) :
  - `test_player_route_returns_string_ids` : `thrall_id` de type `str` égal à `"123456789012345678"`.
  - `test_gm_routes_refuse_players` : les quatre routes MJ → 403 pour un membre `ROLE_VAMPIRE` seul.
  - `test_gm_creates_npc_bond_from_registry_with_its_rank` : PNJ BP 4 → `defy_cost == 4`, statut 201 ; PNJ d'un autre serveur → 404.
  - `test_gm_update_and_delete_are_guild_scoped` : lien du serveur 3 vu depuis le serveur 2 → 404.
- [ ] **Step 2 :** `pytest tests/test_blood_bonds.py -v` → FAIL.
- [ ] **Step 3 :** implémenter les handlers.
- [ ] **Step 4 :** `pytest tests/test_blood_bonds.py tests/test_vampire_readiness.py -v` → PASS.
- [ ] **Step 5 :** commit `Exposer les Liens de sang au site et à CAIN`.

### Task 4 : fiche du joueur et goules

**Files :**
- Create : `web/src/modules/vampire/components/BloodBondsSection.jsx`, `web/src/modules/vampire/components/BloodBondsSection.test.jsx`
- Modify : `web/src/modules/vampire/components/GhoulsTab.jsx`, `web/src/modules/vampire/pages/SheetPage.jsx`, `data/site_content.json`

**Interfaces :**
- Consumes : `GET /api/vampire/bonds` (Task 3), `apiFetch`, `API_URL`.
- Produces : `BloodBondsSection({ discordUserId: string, guildId: string })`. Il charge au montage avec les en-têtes `X-Discord-User-ID` et `X-Discord-Guild-ID`, puis affiche les deux listes, le rappel du coût au stade 3 et la phrase « aucun lien ». En cas d'erreur, il affiche le message renvoyé via `CatalogText`.
- `SheetPage` : rendu sous `GhoulsTab` dans l'onglet `ghouls`, seulement pour le personnage du joueur (pas en mode PNJ).
- Le libellé `vampire.text.01596` passe à « Goules & Liens » (valeur par défaut seulement, même clé).
- `GhoulsTab` : badge sur chaque fiche, goule de sang « Liée au stade 3 », goule de l'esprit « Sans lien de sang : tenue par la Domination ».
- Nouvelles entrées `vampire.bonds.*` (source = chemin du composant, `catalog: false`, `public: false`), insérées après `vampire.text.01471`.
- [ ] **Step 1 : tests qui échouent** (`apiFetch` mocké par `vi.mock('../../../core/api')`) :
  - `affiche les deux sens du lien et le prix du défi au stade 3` ;
  - `affiche une phrase sobre sans aucun lien` ;
  - `affiche l'erreur du serveur`.
  Ajouter à `Readiness.test.jsx` : `distingue goules de sang liées et goules de l'esprit`.
- [ ] **Step 2 :** `cd web && npx vitest run src/modules/vampire/components/BloodBondsSection.test.jsx src/modules/vampire/components/Readiness.test.jsx` → FAIL.
- [ ] **Step 3 :** implémenter le composant, les badges, le branchement et les entrées du registre.
- [ ] **Step 4 :** même commande → PASS ; `cd web && npm run lint` → 0 erreur.
- [ ] **Step 5 :** commit `Afficher les Liens de sang sur la fiche et lier les goules au stade 3`.

### Task 5 : onglet « Liens de sang » de CAIN

**Files :**
- Create : `web/src/core/components/BloodBondsAdmin.jsx`, `web/src/core/components/BloodBondsAdmin.test.jsx`
- Modify : `web/src/core/components/GmDashboard.jsx`, `data/site_content.json`

**Interfaces :**
- Consumes : routes MJ du Task 3.
- Produces : `BloodBondsAdmin({ discordUser, guildId })`. Il contient :
  - la liste (lié → régnant, badge Joueur/PNJ, stade, rang) ;
  - un `<select>` de stade qui envoie `PUT` ;
  - le bouton Effacer, avec `confirm(siteText('vampire.bonds.admin.confirmDelete'))` puis `DELETE` ;
  - le formulaire « Lier un joueur à un PNJ » : sélecteur des vampires, choix « PNJ du registre » ou « nom libre » + rang 1-5, stade 1-3, puis `POST` et rechargement de la liste ;
  - les erreurs du serveur dans le bandeau.
- `GmDashboard` : troisième bouton d'onglet `bonds` (icône `Link` de lucide-react), même style que les deux autres ; rendu `<BloodBondsAdmin …/>`.
- [ ] **Step 1 : tests qui échouent :**
  - `liste les liens du serveur` ;
  - `change un stade et efface après confirmation` (vérifie la méthode et l'URL de `apiFetch`) ;
  - `crée un lien envers un PNJ du registre avec son rang` ;
  - `affiche le refus d'exclusivité`.
- [ ] **Step 2 :** `cd web && npx vitest run src/core/components/BloodBondsAdmin.test.jsx` → FAIL.
- [ ] **Step 3 :** implémenter le composant, l'onglet et les entrées `vampire.bonds.admin.*`.
- [ ] **Step 4 :** même commande → PASS ; `npm run lint` → 0 erreur.
- [ ] **Step 5 :** commit `Gérer les Liens de sang depuis CAIN`.

### Task 6 : Règlement

**Files :**
- Modify : `web/src/modules/vampire/components/RulesTab.jsx` (section VI, après le bloc « Restrictions concernant les goules », avant « Alimentation selon votre niveau de Vitae »), `data/site_content.json`
- Test : `web/src/modules/vampire/components/RulesTab.test.jsx` (create)

**Interfaces :**
- Clés :
  - `vampire.rules.bond.title` : « Le Lien de sang » ;
  - `.intro` ;
  - `.01` à `.04` : les puces, avec segments `strong` séparés pour « troisième » (`.01b`) et « Lié, vous n'avez qu'un maître » (`.03a`) ;
  - `.noteLabel` (« Note : ») et `.note`.
- Mise en page de l'encadré « Les Scènes de Chasse » (`mt-8 bg-stone-900 p-6 rounded border border-stone-800`).
- [ ] **Step 1 : test qui échoue** : `RulesTab` rendu ; il contient « Le Lien de sang », « Offrir mon sang », « Défier le lien » et « Au Zénith, boire un autre vampire vous nourrit sans vous lier. »
- [ ] **Step 2 :** `npx vitest run src/modules/vampire/components/RulesTab.test.jsx` → FAIL.
- [ ] **Step 3 :** ajouter l'encadré et les entrées.
- [ ] **Step 4 :** PASS ; `pytest tests/test_site_content.py -v` → PASS (les nouvelles entrées passent `validate_value`).
- [ ] **Step 5 :** commit `Écrire le Lien de sang dans le Règlement`.

### Task 7 : vérification finale et note de fusion

- [ ] **Step 1 :** `cd web && npm run lint` → 0 erreur.
- [ ] **Step 2 :** `cd web && npx vitest run src/modules/vampire src/data src/core` → tous les tests réussissent, à part les échecs préexistants hors périmètre (à comparer avec `main` si besoin).
- [ ] **Step 3 :** `pytest tests --ignore=tests/modules/werewolf` → PASS.
- [ ] **Step 4 :** `npm run dev`, puis vérifier la fiche (onglet Goules & Liens) et CAIN en 390 × 844 et 1440 × 1000 : pas de débordement horizontal, pas d'erreur console.
- [ ] **Step 5 :** écrire dans le dossier partagé des sessions la note de fusion `lien-de-sang.md`. Elle donne les zones touchées dans `site_content.json` (bloc inséré après `vampire.text.01471`, valeur de `vampire.text.01596`), `RulesTab.jsx` (section VI) et `GmDashboard.jsx`, plus la nouvelle table SQLite.
