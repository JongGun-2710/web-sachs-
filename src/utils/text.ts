/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Loại bỏ dấu tiếng Việt và chuẩn hóa chuỗi về chữ thường không dấu
 * Hỗ trợ tìm kiếm không dấu chuẩn xác cho đồ án
 */
export function removeVietnameseAccents(str: string): string {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim();
}

/**
 * Tách từ khóa và kiểm tra độ tương đồng đơn giản
 */
export function tokenizeWords(text: string): string[] {
  const normalized = removeVietnameseAccents(text);
  return normalized
    .split(/[\s,.;:!?()_/\-]+/)
    .map(w => w.trim())
    .filter(w => w.length > 1);
}
