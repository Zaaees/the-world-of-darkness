const {test} = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');

function fixture() {
  const characters = new Map();
  const context = vm.createContext({
    PropertiesService: {getScriptProperties: () => ({getProperty: () => 'private-secret'})},
    ContentService: {MimeType: {JSON:'json'}, createTextOutput: text => ({text, setMimeType(){return this;}})},
    LockService: {getScriptLock: () => ({tryLock: () => true, hasLock: () => true, releaseLock(){}})},
  });
  vm.runInContext(fs.readFileSync(path.join(__dirname, '../docs/google-apps-script.js'), 'utf8'), context);
  context.getCharacter = id => ({character: characters.get(id)});
  context.saveCharacter = (id, data) => {characters.set(id, {...characters.get(id), ...structuredClone(data)}); return {saved:true};};
  characters.set('1', {bloodPotency:1, clan:'Brujah', saturationPoints:29, pendingActions:['a'], completedActions:[],
    history:[{submissionId:'k1', reward:{points_added:3}, actionId:'vitae_brujah_1', bp:1}]});
  const post = payload => JSON.parse(context.doPost({postData:{contents:JSON.stringify(payload)}}).text);
  return {context, characters, post};
}

test('public GET and unsigned POST cannot read or mutate a character', () => {
  const {context, post, characters} = fixture();
  assert.equal(JSON.parse(context.doGet({parameter:{action:'save'}}).text).success, false);
  assert.equal(post({action:'save', userId:'1', data:{bloodPotency:5}}).success, false);
  assert.equal(post({action:'get', userId:'1', secret:'wrong'}).success, false);
  assert.equal(characters.get('1').bloodPotency, 1);
});

test('retry awards once, keeps overflow and prevents opposite decision', () => {
  const {post, characters} = fixture();
  const award = {action:'award_action', secret:'private-secret', userId:'1', submissionId:'s1', actionId:'a', actionName:'Scène', points:4, isUnique:true};
  assert.equal(post(award).new_bp, 2);
  assert.equal(post(award).new_saturation, 3);
  assert.equal(characters.get('1').history.length, 2);  // the seeded rank key + this award
  assert.equal(post({...award, submissionId:'s2'}).success, false);
  assert.equal(post({...award, action:'refuse_action'}).success, false);
});

test('progression constants mirror the shared catalog', () => {
  const {context} = fixture();
  const read = name => JSON.parse(JSON.stringify(vm.runInContext(name, context)));  // script-level consts
  const catalog = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/blood_actions.json'), 'utf8'));
  assert.deepEqual(read('THRESHOLDS'), Object.fromEntries(Object.entries(catalog.thresholds).map(([k, v]) => [Number(k), v])));
  assert.deepEqual(read('CLAN_ALIASES'), catalog.aliases);
  assert.deepEqual(read('REPEAT_FACTORS'), catalog.repeat.factors);
});

test('the same feat pays less at the same rank, unless the GM sets the amount', () => {
  const {post, characters} = fixture();
  characters.set('2', {bloodPotency:4, clan:'Banu Haqim', saturationPoints:0, pendingActions:[], completedActions:[], history:[]});
  const award = n => post({action:'award_action', secret:'private-secret', userId:'2', submissionId:`r${n}`, actionId:'vitae_banu_haqim_4', actionName:'Rang 4', points:12, basePoints:12});
  assert.deepEqual([award(1), award(2), award(3), award(4)].map(r => r.points_added), [12, 9, 6, 6]);
  assert.equal(post({action:'award_action', secret:'private-secret', userId:'2', submissionId:'adj', actionId:'vitae_banu_haqim_4', actionName:'Rang 4', points:10}).points_added, 10);
  assert.equal(characters.get('2').saturationPoints, 43);
});

test('a threshold opens only once the clan path of that rank is done; points wait meanwhile', () => {
  const {post, characters} = fixture();
  characters.set('3', {bloodPotency:2, clan:'gangrel', saturationPoints:58, pendingActions:[], completedActions:[], history:[]});
  const award = (id, n, pts) => post({action:'award_action', secret:'private-secret', userId:'3', submissionId:n, actionId:id, actionName:id, points:pts, basePoints:pts});
  const blocked = award('vitae_defense', 'b1', 8);
  assert.equal(blocked.new_bp, 2);
  assert.equal(blocked.blocked_by_key, 'vitae_gangrel_2');
  assert.equal(characters.get('3').saturationPoints, 66);
  const released = award('vitae_gangrel_2', 'b2', 5);
  assert.equal(released.new_bp, 3);
  assert.equal(released.new_saturation, 11);
  assert.equal(characters.get('3').history.at(-1).type, 'levelup');
});

test('refusal retry is idempotent and cannot later grant points', () => {
  const {post, characters} = fixture();
  const refusal = {action:'refuse_action', secret:'private-secret', userId:'1', submissionId:'s1', actionId:'a'};
  assert.equal(post(refusal).refused, true);
  assert.equal(post(refusal).refused, true);
  assert.equal(characters.get('1').history.length, 2);  // the seeded rank key + one refusal
  assert.equal(characters.get('1').pendingActions.length, 0);
  assert.equal(post({...refusal, action:'award_action', points:4}).success, false);
});
