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
  characters.set('1', {bloodPotency:1, saturationPoints:29, pendingActions:['a'], completedActions:[], history:[]});
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
  assert.equal(characters.get('1').history.length, 1);
  assert.equal(post({...award, submissionId:'s2'}).success, false);
  assert.equal(post({...award, action:'refuse_action'}).success, false);
});

test('refusal retry is idempotent and cannot later grant points', () => {
  const {post, characters} = fixture();
  const refusal = {action:'refuse_action', secret:'private-secret', userId:'1', submissionId:'s1', actionId:'a'};
  assert.equal(post(refusal).refused, true);
  assert.equal(post(refusal).refused, true);
  assert.equal(characters.get('1').history.length, 1);
  assert.equal(characters.get('1').pendingActions.length, 0);
  assert.equal(post({...refusal, action:'award_action', points:4}).success, false);
});
