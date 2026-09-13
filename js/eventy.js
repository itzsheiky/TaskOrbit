const MESSAGE_COOLDOWN_MS = 12000;
export const DIALOGUE_MIN_MS = 20000;
export const DIALOGUE_MAX_MS = 45000;

let lastMessageAt = 0;

export const EVENTY_DIALOGUES = Object.freeze([
  'Orbit stable. You, questionable.',
  'I was promised snacks.',
  'One task. Start there.',
  'Your productivity levels are under observation.',
  'I could consume the deadline, technically.',
  'Focus mode? I approve.',
  'Do the task before I eat it.',
  'Your orbit looks suspiciously empty.',
  'Welcome back, {username} ♡',
  "Don't make me activate gravity.",
  "You're staring again.",
  'Productivity first. Cosmic nonsense later.',
  'I believe in you. Unfortunately.',
  'One tiny task. Then another.',
  'Your deadlines smell afraid.',
  'Need motivation or gravitational intimidation?'
]);

export function personalizeDialogue(line, user = 'traveler') {
  return line.replaceAll('{username}', user);
}

export function randomDialogue(user = 'traveler', previous = '', random = Math.random) {
  const available = EVENTY_DIALOGUES.filter(line => personalizeDialogue(line, user) !== previous);
  const index = Math.min(available.length - 1, Math.floor(random() * available.length));
  return personalizeDialogue(available[index], user);
}

export function dialogueDelay(random = Math.random) {
  return Math.round(DIALOGUE_MIN_MS + random() * (DIALOGUE_MAX_MS - DIALOGUE_MIN_MS));
}

export function eventyMessage(event, user = 'traveler', force = false) {
  const now = Date.now();
  if (!force && now - lastMessageAt < MESSAGE_COOLDOWN_MS) return null;
  lastMessageAt = now;
  return ({
    welcome: `Welcome back, ${user} ♡`,
    taskAdded: 'Added to orbit. Try not to lose it.',
    taskDone: `Nice work, ${user}. One less task in orbit.`,
    empty: 'Your orbit is clear. Suspiciously clear.',
    overdue: `A few tasks are drifting, ${user}.`,
    focusStart: 'Focus orbit engaged. I am guarding the timeline.',
    focusDone: `Nice work, ${user}. Break time.`,
    goalDone: `Goal achieved, ${user}. Tiny supernova approved.`
  })[event] || `Welcome back, ${user}.`;
}

export function contextualEventy(user, date = new Date()) {
  if (date.getHours() >= 23 || date.getHours() < 5) return `It's getting late, ${user}. I am judging your sleep schedule.`;
  if (date.getHours() < 12) return `Fresh orbit, ${user}.`;
  return `Let's get things done, ${user} ♡`;
}
