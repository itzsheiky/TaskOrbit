export function localDateKey(date = new Date()) {
  const y = date.getFullYear(), m = String(date.getMonth() + 1).padStart(2, '0'), d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
export function greetingFor(date = new Date()) {
  const hour = date.getHours();
  if (hour >= 5 && hour < 12) return 'Good morning';
  if (hour >= 12 && hour < 17) return 'Good afternoon';
  if (hour >= 17 && hour < 21) return 'Good evening';
  return 'Good night';
}
export function formatClock(date = new Date(), format = '12') { return new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit', hour12: format !== '24' }).format(date); }
export function formatLongDate(date = new Date()) { return new Intl.DateTimeFormat(undefined, { weekday: 'long', month: 'long', day: 'numeric' }).format(date); }
export function dateOffsetKey(days, from = new Date()) { return localDateKey(new Date(from.getFullYear(), from.getMonth(), from.getDate() + days)); }
export function isOverdue(task, now = new Date()) {
  if (!task.dueDate || task.completed) return false;
  const cutoff = task.dueTime ? new Date(`${task.dueDate}T${task.dueTime}:00`) : new Date(`${task.dueDate}T23:59:59`);
  return cutoff < now;
}
