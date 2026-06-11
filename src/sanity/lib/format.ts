// Sanity stores dates as ISO (YYYY-MM-DD). The site displays them as
// "M.D.YYYY" with no leading zeros (e.g. "6.4.2026"), so reproduce that.
export function formatDate(iso: string | undefined): string {
  if (!iso) return "";
  const [year, month, day] = iso.split("T")[0].split("-").map(Number);
  if (!year || !month || !day) return iso;
  return `${month}.${day}.${year}`;
}
