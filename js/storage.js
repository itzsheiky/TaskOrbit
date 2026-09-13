const KEY = 'taskorbit:v2';
const VERSION = 2;

export const DEFAULT_SETTINGS = Object.freeze({
  theme: 'void', animationIntensity: 'normal', reducedMotion: false,
  focusMinutes: 25, breakMinutes: 5, longBreakMinutes: 15, rounds: 4,
  sounds: true, notifications: false, autoStartBreak: false, autoStartFocus: false,
  timeFormat: '12', defaultCategory: 'General', completedBehavior: 'bottom'
});

const initialState = () => ({
  version: VERSION, user: null, settings: { ...DEFAULT_SETTINGS },
  categories: ['General', 'Study', 'Coding', 'Project', 'Health', 'Gaming', 'Personal'],
  tasks: [], notes: [], goals: [], focus: { sessions: [], activeTimer: null, tasksCompletedDuringFocus: 0 },
  ui: { onboardingComplete: false }
});

const clone = value => JSON.parse(JSON.stringify(value));
const isObject = value => value && typeof value === 'object' && !Array.isArray(value);

function migrate(raw) {
  const base = initialState();
  if (!isObject(raw)) return base;
  const state = { ...base, ...raw,
    settings: { ...base.settings, ...(isObject(raw.settings) ? raw.settings : {}) },
    focus: { ...base.focus, ...(isObject(raw.focus) ? raw.focus : {}) },
    ui: { ...base.ui, ...(isObject(raw.ui) ? raw.ui : {}) }
  };
  state.version = VERSION;
  ['tasks', 'notes', 'goals', 'categories'].forEach(k => { if (!Array.isArray(state[k])) state[k] = base[k]; });
  if (!Array.isArray(state.focus.sessions)) state.focus.sessions = [];
  return state;
}

export function loadState() { try { return migrate(JSON.parse(localStorage.getItem(KEY))); } catch { return initialState(); } }
export function saveState(state) { const clean = migrate(state); localStorage.setItem(KEY, JSON.stringify(clean)); return clean; }
export function clearState() { localStorage.removeItem(KEY); }
export function exportState(state) { return clone(migrate(state)); }

const priorities = new Set(['low', 'medium', 'high', 'critical']);
const statuses = new Set(['active', 'paused', 'completed']);
export function validateImport(value) {
  if (!isObject(value)) return { valid: false, error: 'Backup must be a JSON object.' };
  if (!Array.isArray(value.tasks) || !Array.isArray(value.notes) || !Array.isArray(value.goals)) return { valid: false, error: 'Backup is missing tasks, notes, or goals arrays.' };
  if (value.tasks.some(t => !isObject(t) || typeof t.title !== 'string' || !priorities.has(t.priority))) return { valid: false, error: 'One or more tasks are malformed.' };
  if (value.notes.some(n => !isObject(n) || typeof n.title !== 'string' || typeof n.content !== 'string')) return { valid: false, error: 'One or more notes are malformed.' };
  if (value.goals.some(g => !isObject(g) || typeof g.title !== 'string' || !statuses.has(g.status))) return { valid: false, error: 'One or more goals are malformed.' };
  return { valid: true, state: migrate(value) };
}

export const Storage = {
  getTasks: state => clone(state.tasks), saveTasks: (state, tasks) => saveState({ ...state, tasks }),
  getUser: state => clone(state.user), saveUser: (state, user) => saveState({ ...state, user }),
  getSettings: state => clone(state.settings), saveSettings: (state, settings) => saveState({ ...state, settings }),
  getNotes: state => clone(state.notes), saveNotes: (state, notes) => saveState({ ...state, notes }),
  getGoals: state => clone(state.goals), saveGoals: (state, goals) => saveState({ ...state, goals })
};
