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
