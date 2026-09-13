import test from 'node:test';
import assert from 'node:assert/strict';
import { greetingFor, localDateKey } from '../js/time.js';
test('greeting boundaries use local hours',()=>{assert.equal(greetingFor(new Date(2026,8,12,5)),'Good morning');assert.equal(greetingFor(new Date(2026,8,12,12)),'Good afternoon');assert.equal(greetingFor(new Date(2026,8,12,17)),'Good evening');assert.equal(greetingFor(new Date(2026,8,12,21)),'Good night');assert.equal(greetingFor(new Date(2026,8,12,4)),'Good night')});
test('date key does not use UTC conversion',()=>assert.equal(localDateKey(new Date(2026,0,2,1)),'2026-01-02'));
