import test from 'node:test';
import assert from 'node:assert/strict';
import { validateImport } from '../js/storage.js';
const valid={tasks:[{title:'Task',priority:'medium'}],notes:[{title:'N',content:'C'}],goals:[{title:'G',status:'active'}],settings:{theme:'void'}};
test('valid import is migrated',()=>{const result=validateImport(valid);assert.equal(result.valid,true);assert.equal(result.state.version,2);assert.ok(Array.isArray(result.state.categories))});
test('import rejects missing collections',()=>assert.equal(validateImport({tasks:[]}).valid,false));
test('import rejects malformed tasks',()=>assert.equal(validateImport({...valid,tasks:[{title:'X',priority:'urgent'}]}).valid,false));
test('import rejects malformed notes and goals',()=>{assert.equal(validateImport({...valid,notes:[{title:'X'}]}).valid,false);assert.equal(validateImport({...valid,goals:[{title:'X',status:'unknown'}]}).valid,false)});
