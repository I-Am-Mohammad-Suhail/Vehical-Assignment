export function parseDateOrDefault(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return isNaN(d) ? null : d;
}

export function defaultRange() {
  const to = new Date();
  const from = new Date();
  from.setDate(to.getDate() - 90);
  return { from, to };
}

export function monthRangeFor(date) {
  const d = date ? new Date(date) : new Date();
  const from = new Date(d.getFullYear(), d.getMonth(), 1);
  const to = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
  return { from, to };
}

export function sameRangeLastYear(from, to) {
  const a = new Date(from);
  const b = new Date(to);
  a.setFullYear(a.getFullYear() - 1);
  b.setFullYear(b.getFullYear() - 1);
  return { from: a, to: b };
}

export function quarterRangeFor(date) {
  const d = date ? new Date(date) : new Date();
  const q = Math.floor(d.getMonth()/3); // 0..3
  const from = new Date(d.getFullYear(), q*3, 1);
  const to = new Date(d.getFullYear(), q*3 + 3, 0, 23, 59, 59, 999);
  return { from, to, quarter: q+1, year: d.getFullYear() };
}

export function previousQuarterRange(date) {
  const d = date ? new Date(date) : new Date();
  let year = d.getFullYear();
  let q = Math.floor(d.getMonth()/3) - 1;
  if (q < 0) { q = 3; year -= 1; }
  const from = new Date(year, q*3, 1);
  const to = new Date(year, q*3 + 3, 0, 23, 59, 59, 999);
  return { from, to, quarter: q+1, year };
}
