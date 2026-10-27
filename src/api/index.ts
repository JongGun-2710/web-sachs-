/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Book,
  Genre,
  Author,
  BookListParams,
  BookListResponse,
  ViewResponse,
  ViewedRecommendationsResponse,
  GoalSearchResponse,
  MIN_VIEWS,
} from './types';
import {
  mockGetGenres,
  mockGetAuthors,
  mockGetBooks,
  mockGetBookById,
  mockGetSimilarBooks,
  mockRecordBookView,
  mockGetViewedRecommendations,
  mockSearchByGoal,
  getMockViewHistory,
  saveMockViewHistory,
  MOCK_BOOKS,
} from './mock';
import { createApiClient } from './client';

export * from './types';
export * from './user';

// Đọc biến môi trường VITE_API_BASE_URL.
// Nếu trống hoặc chưa khai báo -> chạy hoàn toàn bằng Mock data & thuật toán mô phỏng.
// Khi nối backend Python: chỉ cần đặt VITE_API_BASE_URL="http://localhost:8000" trong .env
const rawApiBaseUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim();

export const isMockMode = !rawApiBaseUrl;
export const currentApiBaseUrl = rawApiBaseUrl || null;

const realClient = rawApiBaseUrl ? createApiClient(rawApiBaseUrl) : null;

export async function getGenres(): Promise<Genre[]> {
  if (realClient) return realClient.getGenres();
  return mockGetGenres();
}

export async function getAuthors(q?: string): Promise<Author[]> {
  if (realClient) return realClient.getAuthors(q);
  return mockGetAuthors(q);
}

export async function getBooks(params?: BookListParams): Promise<BookListResponse> {
  if (realClient) return realClient.getBooks(params);
  return mockGetBooks(params);
}

export async function getBookById(id: string): Promise<Book> {
  if (realClient) return realClient.getBookById(id);
  return mockGetBookById(id);
}

export async function getSimilarBooks(id: string, limit = 6): Promise<Book[]> {
  if (realClient) return realClient.getSimilarBooks(id, limit);
  return mockGetSimilarBooks(id, limit);
}

export async function recordBookView(userId: string, bookId: string): Promise<ViewResponse> {
  if (realClient) return realClient.recordBookView(userId, bookId);
  return mockRecordBookView(userId, bookId);
}

export async function getViewedRecommendations(
  userId: string,
  minViews = MIN_VIEWS,
  limit = 8
): Promise<ViewedRecommendationsResponse> {
  if (realClient) return realClient.getViewedRecommendations(userId, minViews, limit);
  return mockGetViewedRecommendations(userId, minViews, limit);
}

export async function searchByGoal(query: string, limit = 12): Promise<GoalSearchResponse> {
  if (realClient) return realClient.searchByGoal(query, limit);
  return mockSearchByGoal(query, limit);
}

/**
 * Các hàm tiện ích dành riêng cho trang /demo (Bảng điều khiển bảo vệ đồ án)
 */
export function getDemoAllViewCounts(userId: string): Record<string, number> {
  return getMockViewHistory(userId);
}

export function demoSimulateIncrementView(userId: string, bookId: string): number {
  const history = getMockViewHistory(userId);
  const next = (history[bookId] || 0) + 1;
  history[bookId] = next;
  saveMockViewHistory(userId, history);
  return next;
}

export function demoClearViewHistory(userId: string): void {
  saveMockViewHistory(userId, {});
}

export function demoGetAllBooks(): Book[] {
  return MOCK_BOOKS;
}
