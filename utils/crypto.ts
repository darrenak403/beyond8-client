import CryptoJS from "crypto-js";

const SECRET_KEY =
  process.env.NEXT_PUBLIC_CRYPTO_SECRET_KEY ||
  "PcjSF+/JVpnwFiSIg9E0W5mLZgr2T/TfzD9RHjvGuTY=";

// Derive deterministic key & IV from the secret (same input → same output)
const KEY_HASH = CryptoJS.SHA256(SECRET_KEY);
const IV_HASH = CryptoJS.MD5(SECRET_KEY);

/**
 * Mã hóa (Encode) chuỗi bằng AES - deterministic
 * @param plainText - Chuỗi cần mã hóa
 * @param secretKey - Khóa bí mật (tùy chọn, mặc định dùng env)
 * @returns Chuỗi đã được mã hóa (Base64)
 */
export function encode(plainText: string, secretKey?: string): string {
  if (secretKey) {
    const k = CryptoJS.SHA256(secretKey);
    const iv = CryptoJS.MD5(secretKey);
    return CryptoJS.AES.encrypt(plainText, k, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }).toString();
  }
  return CryptoJS.AES.encrypt(plainText, KEY_HASH, {
    iv: IV_HASH,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  }).toString();
}

/**
 * Giải mã (Decode) chuỗi đã được mã hóa AES
 * @param cipherText - Chuỗi đã mã hóa (Base64 chuẩn)
 * @param secretKey - Khóa bí mật (tùy chọn, mặc định dùng env)
 * @returns Chuỗi gốc sau khi giải mã
 */
export function decode(cipherText: string, secretKey?: string): string {
  if (secretKey) {
    const k = CryptoJS.SHA256(secretKey);
    const iv = CryptoJS.MD5(secretKey);
    return CryptoJS.AES.decrypt(cipherText, k, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }).toString(CryptoJS.enc.Utf8);
  }
  return CryptoJS.AES.decrypt(cipherText, KEY_HASH, {
    iv: IV_HASH,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  }).toString(CryptoJS.enc.Utf8);
}

/* ── URL-safe helpers ─────────────────────────────────────────── */

/** Base64 → URL-safe Base64 */
function toBase64Url(b64: string): string {
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** URL-safe Base64 → standard Base64 */
function fromBase64Url(b64url: string): string {
  let s = b64url.replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4 !== 0) s += "=";
  return s;
}

/**
 * Mã hóa ID để hiển thị trên URL (chỉ mã hóa nếu ID ≥ 5 ký tự).
 * Output là URL-safe Base64.
 */
export function encodeId(id: string): string {
  if (!id || id.length < 5) return id;
  return toBase64Url(encode(id));
}

/**
 * Giải mã ID từ URL.
 * Nếu giá trị không phải chuỗi mã hóa hợp lệ, trả về nguyên gốc.
 */
export function decodeId(encoded: string): string {
  if (!encoded) return encoded;
  try {
    const b64 = fromBase64Url(encoded);
    const decrypted = decode(b64);
    if (decrypted && decrypted.length > 0) return decrypted;
    return encoded;
  } catch {
    return encoded;
  }
}

/* ── Compound ID helpers (gộp nhiều UUID thành 1 chuỗi mã hóa nhị phân) ── */

export function encodeCompoundId(...ids: string[]): string {
  // Pack: [1 byte count][16 bytes uuid1][16 bytes uuid2]...
  let hex = ids.length.toString(16).padStart(2, "0");
  for (const id of ids) {
    hex += id.replace(/-/g, "");
  }
  const data = CryptoJS.enc.Hex.parse(hex);
  const encrypted = CryptoJS.AES.encrypt(data, KEY_HASH, {
    iv: IV_HASH,
    mode: CryptoJS.mode.CTR,
    padding: CryptoJS.pad.NoPadding,
  });
  return toBase64Url(encrypted.toString());
}

/**
 * Giải mã chuỗi compound ID → mảng các UUID gốc (có dấu `-`).
 * Trả về mảng rỗng nếu giải mã thất bại.
 */
export function decodeCompoundId(encoded: string): string[] {
  if (!encoded) return [];
  try {
    const b64 = fromBase64Url(encoded);
    const decrypted = CryptoJS.AES.decrypt(b64, KEY_HASH, {
      iv: IV_HASH,
      mode: CryptoJS.mode.CTR,
      padding: CryptoJS.pad.NoPadding,
    });
    const hex = decrypted.toString(CryptoJS.enc.Hex);
    // Minimum: 2 hex chars (count) + 32 hex chars (one UUID)
    if (!hex || hex.length < 34) return [];

    const count = parseInt(hex.slice(0, 2), 16);
    const uuids: string[] = [];
    let pos = 2;
    for (let i = 0; i < count; i++) {
      const raw = hex.slice(pos, pos + 32);
      if (raw.length !== 32) break;
      // Restore UUID format: 8-4-4-4-12
      uuids.push(
        `${raw.slice(0, 8)}-${raw.slice(8, 12)}-${raw.slice(12, 16)}-${raw.slice(16, 20)}-${raw.slice(20)}`
      );
      pos += 32;
    }
    return uuids;
  } catch {
    return [];
  }
}
