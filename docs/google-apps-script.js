/**
 * Google Apps Script pour le système de Puissance du Sang
 * World of Darkness - Vampire Character Sheet
 *
 * INSTRUCTIONS:
 * 1. Ouvre ton Google Sheet
 * 2. Extensions → Apps Script
 * 3. Supprime le code existant et colle ce script
 * 4. Déployer → Nouveau déploiement → Application Web
 * 5. Exécuter en tant que: Moi
 * 6. Accès: Tout le monde
 * 7. Copie l'URL de déploiement
 *
 * FEUILLES NÉCESSAIRES:
 * - "Personnages" avec les colonnes: userId | name | clan | bloodPotency | saturationPoints | completedActions | pendingActions | cooldowns | history
 * - "ActionsEnAttente" avec les colonnes: rowId | userId | actionId | actionName | points | status | createdAt
 */

const SHEET_PERSONNAGES = 'Personnages';
const SHEET_ACTIONS = 'ActionsEnAttente';

function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  const action = e.parameter.action;
  let result = { success: false };

  try {
    switch(action) {
      case 'get':
        result = getCharacter(e.parameter.userId);
        break;
      case 'save':
        const data = JSON.parse(e.parameter.data);
        result = saveCharacter(e.parameter.userId, data);
        break;
      case 'submit_action':
        result = submitAction(
          e.parameter.userId,
          e.parameter.actionId,
          e.parameter.actionName,
          parseInt(e.parameter.points) || 0
        );
        break;
      case 'get_pending_actions':
        result = getPendingActions();
        break;
      case 'mark_action_processed':
        result = markActionProcessed(parseInt(e.parameter.rowId));
        break;
      default:
        result.error = 'Action non reconnue';
    }
    result.success = true;
  } catch (error) {
    result.error = error.toString();
    result.success = false;
  }

  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Récupère les données d'un personnage
 */
function getCharacter(userId) {
  const sheet = getOrCreateSheet(SHEET_PERSONNAGES, [
    'userId', 'name', 'clan', 'bloodPotency', 'saturationPoints',
    'completedActions', 'pendingActions', 'cooldowns', 'history'
  ]);

  const data = sheet.getDataRange().getValues();
  const headers = data[0];

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === userId) {
      const character = {};
      headers.forEach((header, idx) => {
        const value = data[i][idx];
        // Parser les champs JSON
        if (['completedActions', 'pendingActions', 'history'].includes(header)) {
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
 */
function saveCharacter(userId, charData) {
  const sheet = getOrCreateSheet(SHEET_PERSONNAGES, [
    'userId', 'name', 'clan', 'bloodPotency', 'saturationPoints',
    'completedActions', 'pendingActions', 'cooldowns', 'history'
  ]);

  const data = sheet.getDataRange().getValues();
  const headers = data[0];

  // Chercher si le personnage existe
  let rowIndex = -1;
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === userId) {
      rowIndex = i + 1;
      break;
    }
  }

  // Préparer la ligne de données
  const row = headers.map(header => {
    if (header === 'userId') return userId;
    const value = charData[header];
    // Stringify les objets/arrays
    if (['completedActions', 'pendingActions', 'history', 'cooldowns'].includes(header)) {
      return JSON.stringify(value || (header === 'cooldowns' ? {} : []));
    }
    return value !== undefined ? value : '';
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
function submitAction(userId, actionId, actionName, points) {
  const sheet = getOrCreateSheet(SHEET_ACTIONS, [
    'rowId', 'userId', 'actionId', 'actionName', 'points', 'status', 'createdAt'
  ]);

  // Générer un ID unique pour cette ligne
  const rowId = Date.now();

  // Ajouter l'action en attente
  sheet.appendRow([
    rowId,
    userId,
    actionId,
    actionName,
    points,
    'pending',
    new Date().toISOString()
  ]);

  // Mettre à jour les pendingActions du personnage
  const charResult = getCharacter(userId);
  if (charResult.character) {
    const pendingActions = charResult.character.pendingActions || [];
    if (!pendingActions.includes(actionId)) {
      pendingActions.push(actionId);
      charResult.character.pendingActions = pendingActions;
      saveCharacter(userId, charResult.character);
    }
  }

  return { submitted: true, rowId: rowId };
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

  // Ajouter le cooldown si nécessaire
  if (hasCooldown) {
    char.cooldowns = char.cooldowns || {};
    const cooldownDate = new Date();
    cooldownDate.setDate(cooldownDate.getDate() + 30);
    char.cooldowns[actionId] = cooldownDate.toISOString();
  }

  // Ajouter les points de saturation
  char.saturationPoints = (parseInt(char.saturationPoints) || 0) + points;

  // Vérifier si mutation
  const thresholds = { 1: 30, 2: 60, 3: 120, 4: 250 };
  const currentBP = parseInt(char.bloodPotency) || 1;
  const threshold = thresholds[currentBP];

  let mutated = false;
  if (threshold && char.saturationPoints >= threshold) {
    char.bloodPotency = Math.min(currentBP + 1, 5);
    char.saturationPoints = 0;
    mutated = true;
  }

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
function refuseAction(userId, actionId) {
  const charResult = getCharacter(userId);
  if (!charResult.character) {
    return { error: 'Personnage non trouvé' };
  }

  const char = charResult.character;

  // Retirer de pendingActions
  char.pendingActions = (char.pendingActions || []).filter(a => a !== actionId);

  saveCharacter(userId, char);

  return { refused: true };
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
