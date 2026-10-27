/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Dự phòng bộ nhớ trong trường hợp localStorage bị vô hiệu hóa hoặc chặn cookies
let inMemoryUserId: string | null = null;
const USER_ID_STORAGE_KEY = 'bookrec_user_id';

/**
 * Lấy hoặc khởi tạo mã người dùng ẩn danh
 */
export function getAnonymousUserId(): string {
  try {
    const existing = localStorage.getItem(USER_ID_STORAGE_KEY);
    if (existing && existing.trim()) {
      return existing;
    }
    const newId = typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `anon-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem(USER_ID_STORAGE_KEY, newId);
    return newId;
  } catch {
    if (!inMemoryUserId) {
      inMemoryUserId = typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `anon-mem-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    }
    return inMemoryUserId;
  }
}

/**
 * Chống đếm trùng: cùng một cuốn sách, gọi trong vòng 5 giây chỉ ghi nhận 1 lần
 */
const lastViewTimestamps: Record<string, number> = {};
const DUPLICATE_COOLDOWN_MS = 5000;

export function shouldRecordView(bookId: string): boolean {
  const now = Date.now();
  const lastTime = lastViewTimestamps[bookId] || 0;
  if (now - lastTime < DUPLICATE_COOLDOWN_MS) {
    return false;
  }
  lastViewTimestamps[bookId] = now;
  return true;
}
