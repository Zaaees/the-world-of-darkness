#!/usr/bin/env node
/**
 * Synchronise les entrées du catalogue de l'éditeur (data/site_content.json)
 * avec les textes de web/src/data/disciplines.js et data/ghoul_disciplines.json.
 *
 * - garde les clés dont le texte existe toujours ;
 * - ajoute une clé pour chaque nouveau texte ;
 * - retire les clés de source "data/disciplines.js" qui ne servent plus.
 *
 * Rejouable sans risque : un second passage ne change rien.
 * Les surcharges déjà saisies dans l'éditeur sont rattachées à une clé :
 * retirer une clé fait disparaître sa surcharge de l'éditeur.
 *
 * Usage : node tools/sync_disciplines_catalog.cjs [--dry-run]
 */
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

const ROOT = path.resolve(__dirname, '..');
const CATALOG = path.join(ROOT, 'data', 'site_content.json');
const GHOULS = path.join(ROOT, 'data', 'ghoul_disciplines.json');
const DISCIPLINES = path.join(ROOT, 'web', 'src', 'data', 'disciplines.js');
const SOURCE = 'data/disciplines.js';
const SCOPE = 'vampire';

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const { DISCIPLINES: disciplines } = await import(pathToFileURL(DISCIPLINES).href);
  const ghouls = JSON.parse(fs.readFileSync(GHOULS, 'utf8'));
  const catalog = JSON.parse(fs.readFileSync(CATALOG, 'utf8'));

  // Textes affichés via <CatalogText scope="vampire"> à partir de ces deux fichiers.
  const wanted = [];
  for (const discipline of Object.values(disciplines)) {
    wanted.push(discipline.name, discipline.description);
    for (const power of discipline.powers) wanted.push(power.name, power.description);
  }
  const ghoulTexts = [
    ...Object.keys(ghouls.powers),
    ...Object.values(ghouls.powers),
    ...Object.values(ghouls.clans).flat(),
  ];
  const needed = new Set([...wanted, ...ghoulTexts]);

  const existing = new Set(
    Object.values(catalog).filter(entry => entry.scope === SCOPE && entry.catalog).map(entry => entry.default)
  );

  const removed = [];
  for (const [key, entry] of Object.entries(catalog)) {
    if (entry.source === SOURCE && !needed.has(entry.default)) {
      removed.push(key);
      delete catalog[key];
      existing.delete(entry.default);
    }
  }

  let next = Math.max(
    ...Object.keys(catalog)
      .filter(key => key.startsWith(`${SCOPE}.text.`))
      .map(key => Number(key.slice(`${SCOPE}.text.`.length)))
  ) + 1;
  const added = [];
  for (const text of new Set(wanted)) {
    if (existing.has(text)) continue;
    const key = `${SCOPE}.text.${String(next++).padStart(5, '0')}`;
    catalog[key] = {
      scope: SCOPE,
      source: SOURCE,
      default: text,
      maxLength: 12000,
      public: false,
      catalog: true,
      variables: [],
    };
    existing.add(text);
    added.push(key);
  }

  const missingGhoulTexts = [...new Set(ghoulTexts)].filter(text => !existing.has(text));

  console.log(`Clés retirées : ${removed.length}`);
  console.log(`Clés ajoutées : ${added.length}`);
  if (missingGhoulTexts.length) {
    console.log(`Textes de goules sans entrée (non éditables) : ${missingGhoulTexts.join(', ')}`);
  }
  if (dryRun) {
    console.log('Simulation : aucun fichier modifié.');
    if (removed.length) console.log(`À retirer : ${removed.join(', ')}`);
    return;
  }
  fs.writeFileSync(CATALOG, `${JSON.stringify(catalog, null, 2)}\n`, 'utf8');
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
