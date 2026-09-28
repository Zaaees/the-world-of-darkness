/**
 * Google Apps Script pour le système de Puissance du Sang
 * World of Darkness - Vampire Character Sheet
 *
 * INSTRUCTIONS:
 * 1. Ouvre ton Google Sheet
 * 2. Extensions → Apps Script
 * 3. Supprime le code existant et colle ce script
 * 4. Définir SHEETS_API_SECRET dans les propriétés du script et dans le secret serveur du bot.
 *    Ne jamais placer ce secret dans Vite ou dans le navigateur.
 * 5. Déployer → Nouveau déploiement → Application Web
 * 6. Exécuter en tant que: Moi
 * 7. Accès: Tout le monde
 * 8. Configurer GOOGLE_SHEETS_API_URL côté bot ; désactiver les anciens déploiements non protégés.
 * 9. Déployer bot et site ensemble (voir docs/vampire-mise-en-service.md).
 *
 * FEUILLES NÉCESSAIRES:
 * - "Personnages" avec les colonnes: userId | name | clan | bloodPotency | saturationPoints | completedActions | pendingActions | cooldowns | history
 * - "ActionsEnAttente" avec les colonnes: rowId | userId | actionId | actionName | points | status | createdAt
 */

// Noms des feuilles (avec fallback pour rétrocompatibilité)
const SHEET_PERSONNAGES = 'Personnages';
const SHEET_PERSONNAGES_FALLBACK = 'Feuil1';  // Ancien nom
const SHEET_ACTIONS = 'ActionsEnAttente';

// Configure SHEETS_API_SECRET in Script Properties and on the bot. Never in Vite.
function responseJson(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
function doGet() { return responseJson({success: false, error: 'Authentication required'}); }
function doPost(e) {
  let lock;
  try {
    const p = JSON.parse(e.postData.contents);
    const secret = PropertiesService.getScriptProperties().getProperty('SHEETS_API_SECRET');
    if (!secret || p.secret !== secret) return responseJson({success: false, error: 'Unauthorized'});
    lock = LockService.getScriptLock();
    if (!lock.tryLock(10000)) throw new Error('Busy; retry');
    let result;
    switch (p.action) {
      case 'get': result = getCharacter(String(p.userId)); break;
      case 'save': result = saveCharacter(String(p.userId), p.data); break;
      case 'submit_action': result = submitAction(String(p.userId), p.actionId, p.actionName, p.points, p); break;
      case 'get_pending_actions': result = getPendingActions(); break;
      case 'mark_action_processed': result = markActionProcessed(p.rowId); break;
      case 'delete': result = deleteCharacter(String(p.userId)); break;
      case 'award_action': result = awardAction(p); break;
      case 'refuse_action': result = refuseAction(String(p.userId), p.actionId, p.submissionId); break;
      default: throw new Error('Unknown action');
    }
    return responseJson({...result, success: !result.error});
  } catch (_) {
    return responseJson({success: false, error: 'Request failed; retry or contact the administrator'});
  } finally {
    if (lock && lock.hasLock()) lock.releaseLock();
  }
}

/**
 * Récupère la feuille personnages (avec fallback)
 */
function getPersonnagesSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // Essayer d'abord la feuille "Personnages"
  let sheet = ss.getSheetByName(SHEET_PERSONNAGES);
  if (sheet) return sheet;

  // Fallback vers "Feuil1" (ancien nom)
  sheet = ss.getSheetByName(SHEET_PERSONNAGES_FALLBACK);
  if (sheet) return sheet;

  // Créer la feuille si elle n'existe pas
  return getOrCreateSheet(SHEET_PERSONNAGES, [
    'userId', 'name', 'clan', 'bloodPotency', 'saturationPoints',
    'completedActions', 'pendingActions', 'cooldowns', 'history'
  ]);
}

/**
 * Récupère les données d'un personnage
 */
function getCharacter(userId) {
  const sheet = getPersonnagesSheet();

  const data = sheet.getDataRange().getValues();
  const headers = data[0];

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === userId) {
      const character = {};
      headers.forEach((header, idx) => {
        const value = data[i][idx];
        // Parser les champs JSON
        if (['completedActions', 'pendingActions', 'history', 'ghouls'].includes(header)) {
          try {
            character[header] = value ? JSON.parse(value) : [];
          } catch {
            character[header] = [];
          }
        } else if (header === 'cooldowns') {
          try {
            character[header] = value ? JSON.parse(value) : {};
          } catch {
            character[header] = {};
          }
        } else if (['bloodPotency', 'saturationPoints'].includes(header)) {
          character[header] = parseInt(value) || (header === 'bloodPotency' ? 1 : 0);
        } else {
          character[header] = value;
        }
      });
      return { character };
    }
  }

  return { character: null };
}

/**
 * Sauvegarde les données d'un personnage
 * Note: Les champs gérés par le bot (completedActions, cooldowns, pendingActions,
 * bloodPotency, saturationPoints) sont préservés si non fournis
 */
function saveCharacter(userId, charData) {
  const sheet = getPersonnagesSheet();
  ensureColumns(sheet, ['ghouls']);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];

  // Chercher si le personnage existe et récupérer ses données actuelles
  let rowIndex = -1;
  let existingData = {};
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === userId) {
      rowIndex = i + 1;
      // Récupérer les données existantes
      headers.forEach((header, idx) => {
        existingData[header] = data[i][idx];
      });
      break;
    }
  }

  // Champs gérés par le bot - ne pas écraser si non fournis
  const botManagedFields = ['completedActions', 'cooldowns', 'pendingActions', 'bloodPotency', 'saturationPoints'];

  // Préparer la ligne de données
  const row = headers.map(header => {
    if (header === 'userId') return userId;

    // Pour les champs gérés par le bot, garder l'ancienne valeur si pas de nouvelle
    if (botManagedFields.includes(header)) {
      if (charData[header] !== undefined) {
        // Nouvelle valeur fournie
        if (['completedActions', 'pendingActions', 'cooldowns'].includes(header)) {
          return JSON.stringify(charData[header] || (header === 'cooldowns' ? {} : []));
        }
        return charData[header];
      } else {
        // Pas de nouvelle valeur, garder l'ancienne
        return existingData[header] !== undefined ? existingData[header] : (
          ['completedActions', 'pendingActions'].includes(header) ? '[]' :
          header === 'cooldowns' ? '{}' :
          header === 'bloodPotency' ? 1 : 0
        );
      }
    }

    const value = charData[header];
    // Stringify les objets/arrays
    if (['history', 'ghouls'].includes(header)) {
      return value === undefined ? (existingData[header] || '[]') : JSON.stringify(value || []);
    }
    return value !== undefined ? value : (existingData[header] || '');
  });

  if (rowIndex > 0) {
    sheet.getRange(rowIndex, 1, 1, row.length).setValues([row]);
  } else {
    sheet.appendRow(row);
  }

  return { saved: true };
}

/**
 * Soumet une action pour validation
 */
function ensureColumns(sheet, columns) {
  const headers = sheet.getDataRange().getValues()[0];
  columns.forEach(name => { if (!headers.includes(name)) { headers.push(name); sheet.getRange(1, headers.length).setValue(name); } });
  return headers;
}
function submitAction(userId, actionId, actionName, points, context) {
  const columns = ['rowId', 'userId', 'actionId', 'actionName', 'points', 'status', 'createdAt', 'guildId', 'sceneLink', 'obstacle', 'outcome', 'participants'];
  const sheet = getOrCreateSheet(SHEET_ACTIONS, columns);
  const headers = ensureColumns(sheet, columns);
  const char = getCharacter(userId).character;
  if (!char) throw new Error('Character missing');
  const pending = char.pendingActions || [];
  if (pending.some(a => (typeof a === 'string' ? a : a.action_id) === actionId)) return {submitted: true, duplicate: true};
  const queued = getPendingActions().pendingActions.find(a => String(a.userId) === userId && a.actionId === actionId);
  if (queued) {
    saveCharacter(userId, {pendingActions: [...pending, actionId]});
    return {submitted: true, duplicate: true, rowId: queued.rowId};
  }
  const rowId = Utilities.getUuid();
  const row = {...context, rowId, userId, actionId, actionName, points, status: 'pending', createdAt: new Date().toISOString()};
  sheet.appendRow(headers.map(h => row[h] === undefined ? '' : row[h]));
  saveCharacter(userId, {pendingActions: [...pending, actionId]});
  return {submitted: true, rowId};
}

// The reward and its idempotency marker share one character row write.
function awardAction(p) {
  const char = getCharacter(String(p.userId)).character;
  if (!char) throw new Error('Character missing');
  const history = char.history || [];
  const previous = history.find(item => item.submissionId === p.submissionId);
  if (previous) { if (!previous.reward) throw new Error('Already refused'); return previous.reward; }
  if (p.isUnique && (char.completedActions || []).includes(p.actionId)) throw new Error('Already completed');
  if (!p.submissionId || !Number.isInteger(p.points) || p.points < 0) throw new Error('Invalid reward');
  const thresholds = {1:30, 2:60, 3:120, 4:250};
  const old_bp = Number(char.bloodPotency) || 1;
  let new_bp = old_bp, new_saturation = (Number(char.saturationPoints) || 0) + p.points;
  while (new_bp < 5 && new_saturation >= thresholds[new_bp]) { new_saturation -= thresholds[new_bp]; new_bp++; }
  if (new_bp >= 5) new_saturation = 0;
  const reward = {mutated: new_bp !== old_bp, old_bp, new_bp, new_saturation, points_added: p.points};
  saveCharacter(String(p.userId), {bloodPotency: new_bp, saturationPoints: new_saturation,
    pendingActions: (char.pendingActions || []).filter(a => (typeof a === 'string' ? a : a.action_id) !== p.actionId),
    completedActions: p.isUnique ? [...new Set([...(char.completedActions || []), p.actionId])] : (char.completedActions || []),
    history: [...history, {submissionId: p.submissionId, reward, text: p.actionName, date: new Date().toISOString()}]});
  return reward;
}

/**
 * Récupère les actions en attente (pour le bot Discord)
 */
function getPendingActions() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_ACTIONS);
  if (!sheet) {
    return { pendingActions: [] };
  }

  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) {
    return { pendingActions: [] };
  }

  const headers = data[0];
  const pendingActions = [];

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const statusIdx = headers.indexOf('status');

    if (row[statusIdx] === 'pending') {
      const action = {};
      headers.forEach((header, idx) => {
        action[header] = row[idx];
      });
      pendingActions.push(action);
    }
  }

  return { pendingActions };
}

/**
 * Marque une action comme traitée
 */
function markActionProcessed(rowId) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_ACTIONS);
  if (!sheet) {
    return { error: 'Feuille non trouvée' };
  }

  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const rowIdIdx = headers.indexOf('rowId');
  const statusIdx = headers.indexOf('status');

  for (let i = 1; i < data.length; i++) {
    if (data[i][rowIdIdx] == rowId) {
      sheet.getRange(i + 1, statusIdx + 1).setValue('processed');
      return { marked: true };
    }
  }

  return { error: 'Action non trouvée' };
}

/**
 * Met à jour un personnage après validation d'une action
 * Appelé par le bot Discord après validation
 */
function validateAction(userId, actionId, points, isUnique, hasCooldown) {
  const charResult = getCharacter(userId);
  if (!charResult.character) {
    return { error: 'Personnage non trouvé' };
  }

  const char = charResult.character;

  // Retirer de pendingActions
  char.pendingActions = (char.pendingActions || []).filter(a => a !== actionId);

  // Ajouter aux completedActions si unique
  if (isUnique) {
    char.completedActions = char.completedActions || [];
    if (!char.completedActions.includes(actionId)) {
      char.completedActions.push(actionId);
    }
  }

  // Vitae v2 : aucun délai de récupération, même pour un ancien identifiant.

  // Ajouter les points de saturation
  char.saturationPoints = (parseInt(char.saturationPoints) || 0) + points;

  // Vérifier si mutation
  const thresholds = { 1: 30, 2: 60, 3: 120, 4: 250 };
  const currentBP = parseInt(char.bloodPotency) || 1;
  char.bloodPotency = currentBP;
  while (char.bloodPotency < 5 && char.saturationPoints >= thresholds[char.bloodPotency]) {
    char.saturationPoints -= thresholds[char.bloodPotency];
    char.bloodPotency += 1;
  }
  if (char.bloodPotency >= 5) char.saturationPoints = 0;
  const mutated = char.bloodPotency !== currentBP;

  // Ajouter à l'historique
  char.history = char.history || [];
  char.history.push({
    text: `Action validée: ${actionId} (+${points} pts)`,
    date: new Date().toISOString(),
    type: mutated ? 'levelup' : 'action'
  });

  saveCharacter(userId, char);

  return {
    validated: true,
    mutated: mutated,
    newBloodPotency: char.bloodPotency,
    newSaturationPoints: char.saturationPoints
  };
}

/**
 * Refuse une action
 */
function refuseAction(userId, actionId, submissionId) {
  const char = getCharacter(userId).character;
  if (!char || !submissionId) throw new Error('Invalid refusal');
  const history = char.history || [];
  const previous = history.find(item => item.submissionId === submissionId);
  if (previous) { if (previous.reward) throw new Error('Already awarded'); return {refused: true}; }
  saveCharacter(userId, {
    pendingActions: (char.pendingActions || []).filter(a => (typeof a === 'string' ? a : a.action_id) !== actionId),
    history: [...history, {submissionId, refused: true, text: 'Action refusée', date: new Date().toISOString()}]
  });
  return {refused: true};
}

/**
 * Supprime un personnage
 */
function deleteCharacter(userId) {
  const sheet = getPersonnagesSheet();
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === userId) {
      sheet.deleteRow(i + 1);
      return { deleted: true };
    }
  }
  
  return { deleted: false, error: 'Personnage non trouvé' };
}

/**
 * Crée une feuille si elle n'existe pas
 */
function getOrCreateSheet(sheetName, headers) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    sheet.appendRow(headers);
    // Formater les en-têtes
    sheet.getRange(1, 1, 1, headers.length)
      .setFontWeight('bold')
      .setBackground('#333333')
      .setFontColor('#ffffff');
  }

  return sheet;
}
