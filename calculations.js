// Pure functions only: no DOM, no database. Shared by every screen and by tests.
export function zoned(date, tz) {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-CA', { timeZone: tz, hourCycle: 'h23',
    year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', weekday: 'long' })
    .formatToParts(date).map(x => [x.type, x.value]));
  return { date: `${p.year}-${p.month}-${p.day}`, y: +p.year, m: +p.month, d: +p.day, h: +p.hour, min: +p.minute, s: +p.second, weekday: p.weekday };
}
export const greeting = h => (h < 5 ? 'Good night' : h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : h < 21 ? 'Good evening' : 'Good night');
const utcDay = s => { const [y, m, d] = s.split('-').map(Number); return Date.UTC(y, m - 1, d); };
export const isDateStr = s => /^\d{4}-\d{2}-\d{2}$/.test(s) && !isNaN(utcDay(s)) && new Date(utcDay(s)).toISOString().slice(0, 10) === s;
// Calendar-day countdown in the configured timezone. Never negative.
export function graduationCountdown(targetStr, now, tz) {
  if (!isDateStr(targetStr || '')) return { valid: false };
  const t = zoned(now, tz).date;
  const days = Math.round((utcDay(targetStr) - utcDay(t)) / 864e5);
  if (days < 0) return { valid: true, passed: true, days: 0, months: 0, remDays: 0 };
  const [ty, tm, td] = t.split('-').map(Number), [gy, gm, gd] = targetStr.split('-').map(Number);
  let months = (gy - ty) * 12 + (gm - tm); if (gd < td) months--;
  const anchor = Date.UTC(ty, tm - 1 + months, td);
  return { valid: true, passed: false, days, months, remDays: Math.round((utcDay(targetStr) - anchor) / 864e5) };
}
