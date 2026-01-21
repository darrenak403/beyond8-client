export const TIMEZONES = [
  { value: "UTC", label: "UTC (Coordinated Universal Time)" },
  { value: "Asia/Ho_Chi_Minh", label: "Asia/Ho Chi Minh (GMT+7)" },
  { value: "Asia/Bangkok", label: "Asia/Bangkok (GMT+7)" },
  { value: "Asia/Singapore", label: "Asia/Singapore (GMT+8)" },
  { value: "Asia/Tokyo", label: "Asia/Tokyo (GMT+9)" },
  { value: "America/New_York", label: "America/New York (GMT-5)" },
  { value: "America/Los_Angeles", label: "America/Los Angeles (GMT-8)" },
  { value: "Europe/London", label: "Europe/London (GMT+0)" },
  { value: "Europe/Paris", label: "Europe/Paris (GMT+1)" },
  { value: "Australia/Sydney", label: "Australia/Sydney (GMT+10)" },
] as const;

export const LOCALES = [
  { value: "vi-VN", label: "Tiếng Việt" },
  { value: "en-US", label: "English (US)" },
  { value: "en-GB", label: "English (UK)" },
  { value: "ja-JP", label: "日本語 (Japanese)" },
  { value: "ko-KR", label: "한국어 (Korean)" },
  { value: "zh-CN", label: "简体中文 (Simplified Chinese)" },
  { value: "zh-TW", label: "繁體中文 (Traditional Chinese)" },
  { value: "th-TH", label: "ไทย (Thai)" },
  { value: "fr-FR", label: "Français (French)" },
  { value: "de-DE", label: "Deutsch (German)" },
] as const;

export type Timezone = typeof TIMEZONES[number]["value"];
export type Locale = typeof LOCALES[number]["value"];
