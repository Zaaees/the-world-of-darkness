#!/usr/bin/env node
/**
 * Exporte le catalogue des disciplines (web/src/data/disciplines.js) vers data/disciplines.json
 * pour que le bot et l'API Python connaissent les coûts en Vitae et les disciplines de clan.
 *
 * La source de vérité reste disciplines.js ; ce fichier est généré et vérifié par les tests.
 * Usage : node tools/export_disciplines.cjs [--check]
 */
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

const ROOT = path.resolve(__dirname, '..');
const SOURCE = path.join(ROOT, 'web', 'src', 'data', 'disciplines.js');
const TARGET = path.join(ROOT, 'data', 'disciplines.json');

async function build() {
  const { DISCIPLINES, CLAN_DISCIPLINES, CLAN_ALIASES, MAX_DISCIPLINE_LEVEL } = await import(pathToFileURL(SOURCE).href);
  const disciplines = {};
  for (const [key, discipline] of Object.entries(DISCIPLINES)) {
    disciplines[key] = {
      name: discipline.name,
      powers: discipline.powers.map(({ id, level, name, bloodCost, duration }) => ({ id, level, name, bloodCost, duration })),
    };
  }
  return { disciplines, clanDisciplines: CLAN_DISCIPLINES, clanAliases: CLAN_ALIASES, maxLevel: MAX_DISCIPLINE_LEVEL };
}

build().then(data => {
  const text = `${JSON.stringify(data, null, 2)}\n`;
  if (process.argv.includes('--check')) {
    const current = fs.existsSync(TARGET) ? fs.readFileSync(TARGET, 'utf8') : '';
    if (current !== text) { console.error('data/disciplines.json est obsolète : lancez node tools/export_disciplines.cjs'); process.exit(1); }
    console.log('data/disciplines.json est à jour.');
    return;
  }
  fs.writeFileSync(TARGET, text, 'utf8');
  console.log(`Exporté ${Object.keys(data.disciplines).length} disciplines vers data/disciplines.json`);
}).catch(error => { console.error(error); process.exit(1); });
