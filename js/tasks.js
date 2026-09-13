import { dateOffsetKey, isOverdue, localDateKey } from './time.js';
export const PRIORITY_WEIGHT = { critical: 4, high: 3, medium: 2, low: 1 };
export const uid = prefix => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
export function createTask(input, now = new Date()) {
  const title = String(input.title || '').trim();
  if (!title) throw new Error('Task title is required.');
  return { id: uid('task'), title, description: String(input.description || '').trim(), dueDate: input.dueDate || '', dueTime: input.dueTime || '', priority: input.priority || 'medium', category: input.category || 'General', tags: Array.isArray(input.tags) ? input.tags : String(input.tags || '').split(',').map(v => v.trim()).filter(Boolean), reminder: input.reminder || '', completed: false, createdAt: now.toISOString(), updatedAt: now.toISOString(), completedAt: null };
}
export function updateTask(task, input, now = new Date()) {
  const next = { ...task, ...input, updatedAt: now.toISOString() }; next.title = String(next.title || '').trim();
  if (!next.title) throw new Error('Task title is required.');
  if (typeof next.tags === 'string') next.tags = next.tags.split(',').map(v => v.trim()).filter(Boolean);
  return next;
}
export function toggleTask(task, now = new Date()) { const completed = !task.completed; return { ...task, completed, completedAt: completed ? now.toISOString() : null, updatedAt: now.toISOString() }; }
export function filterTasks(tasks, { filter = 'all', search = '', category = 'all' } = {}, now = new Date()) {
  const query = search.trim().toLowerCase(), today = localDateKey(now), tomorrow = dateOffsetKey(1, now);
  return tasks.filter(task => {
    const haystack = [task.title, task.description, task.category, ...(task.tags || [])].join(' ').toLowerCase();
    if (query && !haystack.includes(query)) return false;
    if (category !== 'all' && task.category !== category) return false;
    if (filter === 'active' && task.completed) return false;
    if (filter === 'completed' && !task.completed) return false;
    if (filter === 'today' && task.dueDate !== today) return false;
    if (filter === 'tomorrow' && task.dueDate !== tomorrow) return false;
    if (filter === 'overdue' && !isOverdue(task, now)) return false;
    if (filter === 'high' && task.priority !== 'high') return false;
    if (filter === 'critical' && task.priority !== 'critical') return false;
    if (filter === 'no-date' && task.dueDate) return false;
    return true;
  });
}
export function sortTasks(tasks, sort = 'newest', completedBottom = false) {
  const list = [...tasks], compare = ({ newest: (a,b) => new Date(b.createdAt)-new Date(a.createdAt), oldest: (a,b) => new Date(a.createdAt)-new Date(b.createdAt), due: (a,b) => (a.dueDate||'9999').localeCompare(b.dueDate||'9999')||(a.dueTime||'').localeCompare(b.dueTime||''), priority: (a,b) => PRIORITY_WEIGHT[b.priority]-PRIORITY_WEIGHT[a.priority], alpha: (a,b) => a.title.localeCompare(b.title), completed: (a,b) => new Date(b.completedAt||0)-new Date(a.completedAt||0) })[sort] || (()=>0);
  list.sort((a,b) => completedBottom && a.completed !== b.completed ? (a.completed ? 1 : -1) : compare(a,b)); return list;
}
