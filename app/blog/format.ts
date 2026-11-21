// 2025-05-12 → May 12, 2025
export function formatEnglishDate(date: string) {
  return new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`));
}
