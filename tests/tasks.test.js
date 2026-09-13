import test from 'node:test';
import assert from 'node:assert/strict';
import { createTask, filterTasks, sortTasks, toggleTask, updateTask } from '../js/tasks.js';

const now = new Date('2026-09-12T10:00:00');
test('task creation normalizes fields', () => {
  const task = createTask({ title:'  Ship TaskOrbit  ', category:'Coding', priority:'high', tags:'ui, release' }, now);
  assert.equal(task.title,'Ship TaskOrbit'); assert.deepEqual(task.tags,['ui','release']); assert.equal(task.completed,false);
});
test('task editing preserves identity', () => { const task=createTask({title:'Old'},now),edited=updateTask(task,{title:'New'},now);assert.equal(edited.id,task.id);assert.equal(edited.title,'New') });
test('task completion is reversible and timestamped', () => { const task=createTask({title:'Done'},now),done=toggleTask(task,now),active=toggleTask(done,now);assert.equal(done.completed,true);assert.equal(done.completedAt,now.toISOString());assert.equal(active.completed,false);assert.equal(active.completedAt,null) });
test('task deletion by id removes only target', () => { const a=createTask({title:'A'},now),b=createTask({title:'B'},now),left=[a,b].filter(t=>t.id!==a.id);assert.deepEqual(left.map(t=>t.title),['B']) });
test('search matches description category and tags', () => { const tasks=[createTask({title:'Alpha',description:'Write docs',category:'Project',tags:'release'},now)];for(const q of ['docs','project','release'])assert.equal(filterTasks(tasks,{search:q},now).length,1) });
test('filters today, active and priority', () => { const t=createTask({title:'A',dueDate:'2026-09-12',priority:'critical'},now);assert.equal(filterTasks([t],{filter:'today'},now).length,1);assert.equal(filterTasks([t],{filter:'active'},now).length,1);assert.equal(filterTasks([t],{filter:'critical'},now).length,1) });
test('sorting supports priority and alphabetical', () => { const a=createTask({title:'Zulu',priority:'low'},now),b=createTask({title:'Alpha',priority:'critical'},now);assert.equal(sortTasks([a,b],'priority')[0].title,'Alpha');assert.equal(sortTasks([a,b],'alpha')[0].title,'Alpha') });
