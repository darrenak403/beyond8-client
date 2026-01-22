/**
 * Convert ISO 8601 date to yyyy-MM-dd for input[type="date"]
 * @param dateStr - ISO 8601 date string from API (e.g., "2008-06-18T00:00:00Z")
 * @returns Formatted date string in yyyy-MM-dd format for HTML date input
 */
export function formatDateForInput(dateStr: string | null | undefined): string {
  if (!dateStr) return "";
  try {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  } catch {
    return "";
  }
}

/**
 * Convert dd/MM/yyyy (VN) or ISO date string to ISO 8601 string.
 * - Returns null if input is empty or cannot be parsed.
 * - For dd/MM/yyyy, output is midnight UTC.
 */
export function toISOFromDDMMYYYY(value: string | null | undefined): string | null {
  if (!value) return null;

  // pass-through ISO-like values
  if (value.includes("T")) {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d.toISOString();
  }

  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value.trim());
  if (!m) return null;

  const [, dd, mm, yyyy] = m;
  const d = new Date(`${yyyy}-${mm}-${dd}T00:00:00.000Z`);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}