export function getAmountFromURL(): number {
  const params = new URLSearchParams(window.location.search);
  const raw = params.get('amount');
  if (raw) {
    const parsed = parseInt(raw, 10);
    if (parsed > 0 && parsed <= 99999999) return parsed;
  }
  return 1000;
}
