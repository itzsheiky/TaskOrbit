import test from 'node:test';
import assert from 'node:assert/strict';
import { DIALOGUE_MAX_MS, DIALOGUE_MIN_MS, contextualEventy, dialogueDelay, eventyMessage, randomDialogue } from '../js/eventy.js';
test('Eventy personalizes welcome and task completion',()=>{assert.match(eventyMessage('welcome','Alex',true),/Alex/);assert.match(eventyMessage('taskDone','Alex',true),/Alex/)});
test('late-night message is time aware',()=>assert.match(contextualEventy('Alex',new Date(2026,1,1,23)),/sleep schedule/));
test('random dialogue personalizes names and avoids an immediate repeat',()=>{const first=randomDialogue('Alex','',()=>.5),second=randomDialogue('Alex',first,()=>.5);assert.notEqual(first,second);assert.equal(randomDialogue('Alex','',()=>.5).includes('{username}'),false)});
test('dialogue timing remains within the calm 20 to 45 second range',()=>{assert.equal(dialogueDelay(()=>0),DIALOGUE_MIN_MS);assert.equal(dialogueDelay(()=>1),DIALOGUE_MAX_MS)});
