import test from 'node:test';
import assert from 'node:assert/strict';
import { nextTimer, pauseTimer, remainingSeconds, resumeTimer, startTimer } from '../js/timer.js';
const config={focusMinutes:25,breakMinutes:5,longBreakMinutes:15,rounds:4,round:1,mode:'focus'};
test('timestamp countdown remains accurate after inactive time',()=>{const t=startTimer(config,1000);assert.equal(remainingSeconds(t,11000),1490)});
test('pause and resume preserve remaining duration',()=>{const t=startTimer(config,0),p=pauseTimer(t,60000),r=resumeTimer(p,100000);assert.equal(p.remainingSeconds,1440);assert.equal(r.endsAt,1540000)});
test('focus advances to break and increments round after break',()=>{const br=nextTimer({...config,status:'idle'}),focus=nextTimer(br);assert.equal(br.mode,'break');assert.equal(br.remainingSeconds,300);assert.equal(focus.mode,'focus');assert.equal(focus.round,2)});
test('last round advances to long break',()=>{const t=nextTimer({...config,round:4});assert.equal(t.mode,'long-break');assert.equal(t.remainingSeconds,900)});
