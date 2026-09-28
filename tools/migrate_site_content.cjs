/* One-time, source-preserving migration. Existing registry keys are never renumbered.
 * Run from repository root with: node tools/migrate_site_content.cjs
 * Review the generated source diff before accepting newly discovered display fields.
 */
const fs = require('node:fs');
const path = require('node:path');
const { createRequire } = require('node:module');
const requireWeb = createRequire(path.resolve('web/package.json'));
const parser = requireWeb('@babel/parser');
const traverse = requireWeb('@babel/traverse').default;
const root = path.resolve('web/src');
const registryPath = path.resolve('data/site_content.json');
const registry = fs.existsSync(registryPath) ? JSON.parse(fs.readFileSync(registryPath, 'utf8')) : {};
let sequence = Math.max(0, ...Object.keys(registry).map(key => Number(key.split('.').at(-1)) || 0));
const bySource = new Map(Object.entries(registry).map(([key, entry]) => [`${entry.scope}\0${entry.source}\0${entry.default}`, key]));
const byCatalog = new Map(Object.entries(registry).filter(([, entry]) => entry.catalog).map(([key, entry]) => [`${entry.scope}\0${entry.default}`, key]));
const scopeFor = file => /werewolf|starter_pack/.test(file) ? 'werewolf' : /vampire|\/data\/|\/utils\/translations|GmDashboard/.test(file) ? 'vampire' : 'common';
const human = text => typeof text === 'string' && /[A-Za-zÀ-ÿ]/.test(text) && !/^https?:|^\/|^[a-z_]+$|^[A-Z]+_[A-Z_]+$/.test(text);
function register(scope, source, text, catalog = false, variables = []) {
  const lookup = `${scope}\0${source}\0${text}`;
  const existing = catalog ? byCatalog.get(`${scope}\0${text}`) : bySource.get(lookup);
  if (existing) return existing;
  const key = `${scope}.text.${String(++sequence).padStart(5, '0')}`;
  registry[key] = { scope, source, default: text, maxLength: 12000, public: scope === 'common', catalog, variables };
  bySource.set(lookup, key);
  if (catalog) byCatalog.set(`${scope}\0${text}`, key);
  return key;
}
const fields = new Set(['name', 'name_fr', 'title', 'label', 'description', 'description_md', 'long_description', 'quote', 'roleplay', 'specificities', 'bane', 'baneDescription', 'transformationDescription', 'ingredients', 'duration', 'rank', 'subtitle', 'hint', 'message', 'reason', 'text', 'effect', 'summary', 'consequence', 'directive']);
const arrays = new Set(['steps', 'hints', 'questions', 'advantages', 'disadvantages', 'effects', 'benefits']);
function files(directory) { return fs.readdirSync(directory, { withFileTypes: true }).flatMap(item => item.isDirectory() ? files(path.join(directory, item.name)) : [path.join(directory, item.name)]); }
const sourceFiles = files(root).filter(file => /\.(js|jsx)$/.test(file) && !/\.test\.|setupTests|[\\/]test[\\/]|[\\/]content[\\/]/.test(file));
let migrated = 0;
for (const file of sourceFiles) {
  const source = path.relative(root, file).replaceAll('\\', '/');
  if (/authUtils|core\/api|config\.js/.test(source)) continue;
  const code = fs.readFileSync(file, 'utf8');
  const scope = scopeFor('/' + source);
  const ast = parser.parse(code, { sourceType: 'module', plugins: ['jsx'] });
  // Catalog registration never modifies source game objects or stored player fields.
  traverse(ast, {
    StringLiteral(p) {
      if (!human(p.node.value)) return;
      if (p.findParent(x => x.isCallExpression() && x.node.callee.name === 'siteText')) return;
      const parent = p.parentPath;
      const name = parent.isObjectProperty() ? (parent.node.key.name || parent.node.key.value) : null;
      const arrayParent = parent.isArrayExpression() ? parent.parentPath : null;
      const arrayName = arrayParent?.isObjectProperty() ? (arrayParent.node.key.name || arrayParent.node.key.value) : null;
      const displayMap = /translations|originQuestions/.test(source) && !p.findParent(x => x.isImportDeclaration());
      const constantMap = p.findParent(x => x.isVariableDeclarator() && /LABELS|NAMES|TITLES/.test(x.node.id.name || ''));
      const errorCall = parent.isCallExpression() && /setError|Error|alert/.test(code.slice(parent.node.callee.start, parent.node.callee.end));
      if ((parent.isObjectProperty() && parent.node.value === p.node && fields.has(name)) || arrays.has(arrayName) || displayMap || constantMap || errorCall) register(scope, source, p.node.value, true);
    },
  });
  if (!file.endsWith('.jsx') || code.includes('// site-content: migrated')) continue;
  const edits = [];
  const hooks = new Set();
  let usesText = false, usesSite = false, usesDisplay = false;
  function subscribe(p) {
    for (let cursor = p; cursor; cursor = cursor.parentPath) {
      if (!cursor.isFunction()) continue;
      const name = cursor.node.id?.name || (cursor.parentPath.isVariableDeclarator() ? cursor.parentPath.node.id.name : '');
      if (/^[A-Z]/.test(name) || (cursor.parentPath.isExportDefaultDeclaration() && !name)) { hooks.add(cursor.node); return; }
    }
  }
  function edit(start, end, text) { edits.push({ start, end, text }); }
  function attribute(p) { return p.findParent(x => x.isJSXAttribute()); }
  const attrs = new Set(['title', 'placeholder', 'aria-label', 'alt', 'label', 'description', 'subtitle', 'heading', 'message']);
  function displayContext(p) {
    const attr = attribute(p);
    if (attr) return attrs.has(attr.node.name.name);
    return Boolean(p.findParent(x => x.isJSXExpressionContainer()));
  }
  traverse(ast, {
    JSXText(p) {
      // Match React's JSX whitespace folding.
      const lines = p.node.value.replace(/\t/g, ' ').split(/\r\n|\n|\r/);
      const nonempty = lines.map((line, i) => (i ? line.replace(/^ +/, '') : line).replace(i === lines.length - 1 ? /$^/ : / +$/, '')).filter(Boolean);
      const text = nonempty.join(' ');
      if (!/[A-Za-zÀ-ÿ]/.test(text)) return;
      const key = register(scope, source, text);
      const parentTag = p.parent.openingElement?.name?.name;
      if (['option', 'title', 'textarea', 'code'].includes(parentTag)) {
        edit(p.node.start, p.node.end, `{siteText(${JSON.stringify(key)})}`); usesSite = true; subscribe(p);
      } else {
        edit(p.node.start, p.node.end, `<SiteText contentKey=${JSON.stringify(key)} />`); usesText = true;
      }
    },
    StringLiteral(p) {
      if (!displayContext(p) || !/[A-Za-zÀ-ÿ]/.test(p.node.value)) return;
      if (p.findParent(x => x.isBinaryExpression() || x.isMemberExpression() || x.isObjectProperty() || x.isCallExpression() || x.isFunction())) {
        // Restrict to literal/conditional/logical expressions directly rendered as text.
        let cursor = p.parentPath;
        while (cursor && !cursor.isJSXExpressionContainer() && !cursor.isJSXAttribute()) {
          if (!cursor.isConditionalExpression() && !cursor.isLogicalExpression()) return;
          cursor = cursor.parentPath;
        }
      }
      const attr = p.parentPath.isJSXAttribute();
      const key = register(scope, source, p.node.value);
      edit(p.node.start, p.node.end, `${attr ? '{' : ''}siteText(${JSON.stringify(key)})${attr ? '}' : ''}`);
      usesSite = true; subscribe(p);
    },
    TemplateLiteral(p) {
      if (p.findParent(x => x.isJSXElement() && ['style', 'script', 'code'].includes(x.node.openingElement.name.name))) return;
      if (!displayContext(p) || !p.node.quasis.some(q => /[A-Za-zÀ-ÿ]/.test(q.value.cooked))) return;
      if (!p.parentPath.isJSXExpressionContainer()) return;
      const variables = p.node.expressions.map((_, i) => `v${i}`);
      const text = p.node.quasis.map((q, i) => q.value.cooked + (i < variables.length ? `{${variables[i]}}` : '')).join('');
      const key = register(scope, source, text, false, variables);
      const args = p.node.expressions.map((expr, i) => `v${i}: (${code.slice(expr.start, expr.end)})`).join(', ');
      edit(p.node.start, p.node.end, `siteText(${JSON.stringify(key)}, { ${args} })`); usesSite = true; subscribe(p);
    },
    JSXExpressionContainer: {
      exit(p) {
        if (p.parentPath.isJSXAttribute() && !attrs.has(p.parentPath.node.name.name)) return;
        const expression = p.node.expression;
        if (!['Identifier', 'MemberExpression', 'OptionalMemberExpression', 'CallExpression', 'LogicalExpression'].includes(expression.type)) return;
        const raw = code.slice(expression.start, expression.end);
        if (edits.some(e => e.start >= expression.start && e.end <= expression.end)) return;
        // Never translate player-authored names, histories, stories or form values.
        if (/\b(sheetData|npc|ghoul|character|activeChar|discordUser|memberInfo|request|submission|answers|content)\b/i.test(raw)) return;
        if (!/\b(ritual|power|discipline|clan|gift|stage|question|hint|step|item|option|label|category|error|message|title|description|tribe|breed|auspice|rank|benefit|duration|translate|getDisciplineName)\b/i.test(raw)) return;
        if (raw.includes('=>') || raw.includes('<') || raw.includes('siteText(')) return;
        edit(expression.start, expression.end, `displayText(${JSON.stringify(scope)}, ${raw})`); usesDisplay = true; subscribe(p);
      },
    },
  });
  if (!edits.length) continue;
  for (const fn of hooks) {
    if (fn.body.type === 'BlockStatement') edit(fn.body.start + 1, fn.body.start + 1, '\n    useSiteContent();');
    else {
      edit(fn.body.start, fn.body.start, '{ useSiteContent(); return (');
      edit(fn.body.end, fn.body.end, '); }');
    }
  }
  let target = code;
  for (const change of edits.sort((a, b) => b.start - a.start || b.end - a.end)) target = target.slice(0, change.start) + change.text + target.slice(change.end);
  let relative = path.relative(path.dirname(file), path.join(root, 'core/content')).replaceAll('\\', '/');
  if (!relative.startsWith('.')) relative = './' + relative;
  const names = [usesSite && 'siteText', usesDisplay && 'displayText', hooks.size && 'useSiteContent'].filter(Boolean);
  target = '// site-content: migrated\n' + (names.length ? `import { ${names.join(', ')} } from '${relative}/store';\n` : '') + (usesText ? `import SiteText from '${relative}/SiteText';\n` : '') + target;
  // Fail before writing invalid syntax.
  parser.parse(target, { sourceType: 'module', plugins: ['jsx'] });
  fs.writeFileSync(file, target);
  migrated++;
}
// JSON catalogs: registration only, never rewrite shared game data.
for (const [file, scope] of [
  ['data/blood_actions.json', 'vampire'], ['data/ghoul_disciplines.json', 'vampire'],
  ['web/src/assets/starter_pack_data.json', 'werewolf'], ['web/src/modules/werewolf/assets/werewolf_data.json', 'werewolf'],
  ['modules/werewolf/assets/gifts_data.json', 'werewolf'],
]) {
  function walk(value, key = '', parent = '', activeScope = scope) {
    if (typeof value === 'string') {
      if ((fields.has(key) || arrays.has(key) || /questions|starter_pack/.test(parent + file)) && human(value)) register(activeScope, file, value, true);
    } else if (Array.isArray(value)) value.forEach(item => walk(item, key, parent, activeScope));
    else if (value && typeof value === 'object') Object.entries(value).forEach(([field, item]) => walk(item, field, key, field === 'vampire' ? 'vampire' : activeScope));
  }
  walk(JSON.parse(fs.readFileSync(file, 'utf8')));
}
// Complete known display-only references; never touch their form values or IDs.
for (const file of sourceFiles.filter(file => file.endsWith('.jsx'))) {
  const source = path.relative(root, file).replaceAll('\\', '/');
  const scope = scopeFor('/' + source);
  let code = fs.readFileSync(file, 'utf8');
  const ast = parser.parse(code, { sourceType: 'module', plugins: ['jsx'] });
  const edits = [];
  const hooks = new Set();
  const approved = /^(?:action\.(?:name|description)|selectedClan\.name|(?:breedData|auspiceData|tribeData)\??\.(?:name_fr|quote|roleplay|specificities|long_description|description)|selectedGift\.(?:name_fr|system)|ghoul\.discipline_(?:name|power)|getClanDescription\(activeChar.clan\)\.(?:bane|baneDescription)|translate\(|BLOOD_STAGES\[|clanInfo\s*\?|ritual.description_md|(?:q[123]|breedQ|auspiceQ|tribeQ|rankName|myAuspice|ritualName|reason|disc|notice|successMsg|formError|renownError|subtext|subtitle)$|(?:selectedQuestions|qs)\.tribu)/;
  traverse(ast, {
    StringLiteral(p) {
      const v = p.node.value;
      if (!human(v)) return;
      const parent = p.parentPath;
      const displayMap = p.findParent(x => x.isVariableDeclarator() && /rankNames|RANK_NAMES/.test(x.node.id.name || ''));
      const textFallback = parent.isLogicalExpression() && p.findParent(x => x.isVariableDeclarator() && /^(q[123]|breedQ|auspiceQ|tribeQ)$/.test(x.node.id.name || ''));
      const statusCall = parent.isCallExpression() && /^set(?:Notice|SuccessMsg|FormError)/.test(code.slice(parent.node.callee.start, parent.node.callee.end));
      if (displayMap || textFallback || statusCall) register(scope, source, v, true);
    },
    JSXExpressionContainer(p) {
      if (p.parentPath.isJSXAttribute() && !['placeholder', 'title', 'aria-label'].includes(p.parentPath.node.name.name)) return;
      const expr = p.node.expression;
      const raw = code.slice(expr.start, expr.end);
      if (!approved.test(raw) || raw.includes('=>') || raw.includes('<')) return;
      edits.push({ start: expr.start, end: expr.end, text: `displayText(${JSON.stringify(scope)}, ${raw})` });
      for (let cursor = p; cursor; cursor = cursor.parentPath) {
        if (!cursor.isFunction()) continue;
        const name = cursor.node.id?.name || (cursor.parentPath.isVariableDeclarator() ? cursor.parentPath.node.id.name : '');
        if (/^[A-Z]/.test(name)) { hooks.add(cursor.node); break; }
      }
    },
  });
  if (!edits.length) continue;
  for (const fn of hooks) {
    if (code.slice(fn.body.start, fn.body.start + 60).includes('useSiteContent();')) continue;
    if (fn.body.type === 'BlockStatement') edits.push({ start: fn.body.start + 1, end: fn.body.start + 1, text: '\n    useSiteContent();' });
  }
  for (const change of edits.sort((a, b) => b.start - a.start)) code = code.slice(0, change.start) + change.text + code.slice(change.end);
  let relative = path.relative(path.dirname(file), path.join(root, 'core/content/store')).replaceAll('\\', '/');
  if (!relative.startsWith('.')) relative = './' + relative;
  const imported = code.match(/import \{ ([^}]+) \} from '[^']*content\/store';/);
  if (imported) {
    const names = new Set(imported[1].split(', ')); names.add('displayText'); names.add('useSiteContent');
    code = code.replace(imported[0], `import { ${[...names].join(', ')} } from '${relative}';`);
  } else code = `import { displayText, useSiteContent } from '${relative}';\n` + code;
  parser.parse(code, { sourceType: 'module', plugins: ['jsx'] });
  fs.writeFileSync(file, code);
}
// User-facing notifications and confirmations, including interpolated messages.
for (const file of sourceFiles) {
  if (/authUtils|core[\\/]api|config\.js/.test(file)) continue;
  const source = path.relative(root, file).replaceAll('\\', '/');
  const scope = scopeFor('/' + source);
  let code = fs.readFileSync(file, 'utf8');
  const ast = parser.parse(code, { sourceType: 'module', plugins: ['jsx'] });
  const edits = [];
  const eligible = p => {
    if (p.findParent(x => x.isCallExpression() && x.node.callee.name === 'siteText')) return false;
    return Boolean(p.findParent(x => (x.isCallExpression() || x.isNewExpression()) &&
      /^(?:confirm|alert|window.confirm|window.alert|setError|setNotice|setSuccessMsg|setFormError|Error)$/.test(code.slice(x.node.callee.start, x.node.callee.end))));
  };
  traverse(ast, {
    StringLiteral(p) {
      if (!eligible(p) || !human(p.node.value) || /^[A-Z_]+$/.test(p.node.value)) return;
      if (p.parentPath.isMemberExpression() || p.parentPath.isBinaryExpression()) return;
      const key = register(scope, source, p.node.value);
      edits.push({ start: p.node.start, end: p.node.end, text: `siteText(${JSON.stringify(key)})` });
    },
    TemplateLiteral(p) {
      const isQuestion = source === 'data/originQuestions.js';
      const isNotification = p.parentPath.isObjectProperty() && ['subtext', 'message'].includes(p.parent.key.name);
      if ((!eligible(p) && !isQuestion && !isNotification) || !p.node.quasis.some(q => /[A-Za-zÀ-ÿ]/.test(q.value.cooked))) return;
      if (p.findParent(x => x.isCallExpression() && x.node.callee.name === 'siteText')) return;
      const variables = p.node.expressions.map((_, i) => `v${i}`);
      const text = p.node.quasis.map((q, i) => q.value.cooked + (i < variables.length ? `{${variables[i]}}` : '')).join('');
      const key = register(scope, source, text, false, variables);
      const args = p.node.expressions.map((expr, i) => `v${i}: (${code.slice(expr.start, expr.end)})`).join(', ');
      edits.push({ start: p.node.start, end: p.node.end, text: `siteText(${JSON.stringify(key)}, { ${args} })` });
      p.skip();
    },
  });
  if (!edits.length) continue;
  for (const change of edits.sort((a, b) => b.start - a.start)) code = code.slice(0, change.start) + change.text + code.slice(change.end);
  let relative = path.relative(path.dirname(file), path.join(root, 'core/content/store')).replaceAll('\\', '/');
  if (!relative.startsWith('.')) relative = './' + relative;
  const imported = code.match(/import \{ ([^}]+) \} from '[^']*content\/store';/);
  if (imported) {
    const names = new Set(imported[1].split(', ')); names.add('siteText');
    code = code.replace(imported[0], `import { ${[...names].join(', ')} } from '${relative}';`);
  } else code = `import { siteText } from '${relative}';\n` + code;
  parser.parse(code, { sourceType: 'module', plugins: ['jsx'] });
  fs.writeFileSync(file, code);
}
// Only the login/loading/access screens are readable without a Discord session.
for (const entry of Object.values(registry)) {
  if (entry.source === 'modules/vampire/pages/SheetPage.jsx' && /^(Vis Vitae|Connectez|Connexion|Se connecter|Retour|Chargement|Votre âme|Vous devez|Vous n|Accès|Le Monde|Erreur|Une erreur)/.test(entry.default)) entry.public = true;
}
for (const suffix of ['01567', '01568', '01569', '01570', '01571']) registry[`vampire.text.${suffix}`].public = true;
fs.writeFileSync(registryPath, JSON.stringify(registry, null, 2) + '\n');
console.log(`${Object.keys(registry).length} registered texts; ${migrated} migrated files.`);
