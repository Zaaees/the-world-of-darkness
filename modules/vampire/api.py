"""Authenticated game data bridge; progression fields are never client writable."""
import json
import random
import re
from pathlib import Path

from aiohttp import web
from data.blood_actions import get_action_by_id, get_action_points, is_action_available, is_once, normalize_clan
from data.config import GHOUL_BLOOD_COST
from utils.database import apply_vitae_upkeep, get_max_vitae, get_vampire_data, modify_vitae, spend_vitae_for_power
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


def register_routes(app):
    app.router.add_get('/api/vampire/character', character_handler)
    app.router.add_post('/api/vampire/character', character_handler)
    app.router.add_post('/api/vampire/actions', submit_action_handler)
    app.router.add_get('/api/vampire/vitae', vitae_handler)
    app.router.add_post('/api/vampire/vitae', vitae_handler)
