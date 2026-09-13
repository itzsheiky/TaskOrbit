export function remainingSeconds(timer, now = Date.now()) {
  if (!timer) return 0;
  if (timer.status !== 'running') return Math.max(0, timer.remainingSeconds || 0);
  return Math.max(0, Math.ceil((timer.endsAt - now) / 1000));
}
export function startTimer(config, now = Date.now()) {
  const seconds = Math.max(60, Number(config.remainingSeconds || config.focusMinutes * 60));
  return { ...config, mode: config.mode || 'focus', round: config.round || 1, status: 'running', remainingSeconds: seconds, endsAt: now + seconds * 1000, startedAt: config.startedAt || now };
}
export function pauseTimer(timer, now = Date.now()) { return { ...timer, remainingSeconds: remainingSeconds(timer, now), status: 'paused', endsAt: null }; }
export function resumeTimer(timer, now = Date.now()) { return startTimer(timer, now); }
export function resetTimer(timer) { const mins = timer.mode === 'focus' ? timer.focusMinutes : timer.mode === 'long-break' ? timer.longBreakMinutes : timer.breakMinutes; return { ...timer, status: 'idle', remainingSeconds: mins * 60, endsAt: null, startedAt: null }; }
export function nextTimer(timer) {
  if (timer.mode === 'focus') { const long = timer.round >= timer.rounds; return { ...timer, mode: long ? 'long-break' : 'break', status: 'idle', remainingSeconds: (long ? timer.longBreakMinutes : timer.breakMinutes) * 60, endsAt: null }; }
  const round = timer.mode === 'long-break' ? 1 : Math.min(timer.rounds, timer.round + 1);
  return { ...timer, mode: 'focus', round, status: 'idle', remainingSeconds: timer.focusMinutes * 60, endsAt: null };
}
export function formatDuration(seconds) { const safe = Math.max(0, seconds); return `${String(Math.floor(safe / 60)).padStart(2, '0')}:${String(safe % 60).padStart(2, '0')}`; }
