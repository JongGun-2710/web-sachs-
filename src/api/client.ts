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

const TIMEOUT_MS = 15000;

export class ApiError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function fetchWithTimeout(url: string, options: RequestInit = {}): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(options.headers || {}),
      },
    });
    return response;
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'AbortError') {
      throw new ApiError('Yêu cầu tới máy chủ gợi ý quá thời gian chờ (15 giây). Vui lòng thử lại.', 408);
    }
    throw new ApiError('Không thể kết nối đến máy chủ backend Python. Vui lòng kiểm tra địa chỉ API.', 503);
  } finally {
    clearTimeout(id);
  }
}

export function createApiClient(baseUrl: string) {
  const cleanBase = baseUrl.replace(/\/+$/, '');

  return {
    async getGenres(): Promise<Genre[]> {
      const res = await fetchWithTimeout(`${cleanBase}/api/genres`);
      if (!res.ok) throw new ApiError(`Lỗi tải thể loại (${res.status})`, res.status);
      return res.json();
    },

    async getAuthors(q?: string): Promise<Author[]> {
      const params = new URLSearchParams();
      if (q) params.set('q', q);
      const url = `${cleanBase}/api/authors?${params.toString()}`;
      const res = await fetchWithTimeout(url);
      if (!res.ok) throw new ApiError(`Lỗi tải tác giả (${res.status})`, res.status);
      return res.json();
    },

    async getBooks(params: BookListParams = {}): Promise<BookListResponse> {
      const sp = new URLSearchParams();
      if (params.genre) sp.set('genre', params.genre);
      if (params.author) sp.set('author', params.author);
      if (params.q) sp.set('q', params.q);
      if (params.sort) sp.set('sort', params.sort);
      if (params.page) sp.set('page', String(params.page));
      if (params.page_size) sp.set('page_size', String(params.page_size));

      const res = await fetchWithTimeout(`${cleanBase}/api/books?${sp.toString()}`);
      if (!res.ok) throw new ApiError(`Lỗi tải danh sách sách (${res.status})`, res.status);
      return res.json();
    },

    async getBookById(id: string): Promise<Book> {
      const res = await fetchWithTimeout(`${cleanBase}/api/books/${encodeURIComponent(id)}`);
      if (!res.ok) {
        if (res.status === 404) throw new ApiError(`Không tìm thấy sách mã "${id}"`, 404);
        throw new ApiError(`Lỗi tải thông tin sách (${res.status})`, res.status);
      }
      return res.json();
    },

    async getSimilarBooks(id: string, limit = 6): Promise<Book[]> {
      const res = await fetchWithTimeout(`${cleanBase}/api/books/${encodeURIComponent(id)}/similar?limit=${limit}`);
      if (!res.ok) throw new ApiError(`Lỗi tải sách tương tự (${res.status})`, res.status);
      return res.json();
    },

    async recordBookView(userId: string, bookId: string): Promise<ViewResponse> {
      const res = await fetchWithTimeout(`${cleanBase}/api/views`, {
        method: 'POST',
        body: JSON.stringify({ user_id: userId, book_id: bookId }),
      });
      if (!res.ok) throw new ApiError(`Lỗi ghi nhận lượt xem (${res.status})`, res.status);
      return res.json();
    },

    async getViewedRecommendations(
      userId: string,
      minViews = MIN_VIEWS,
      limit = 8
    ): Promise<ViewedRecommendationsResponse> {
      const sp = new URLSearchParams({
        user_id: userId,
        min_views: String(minViews),
        limit: String(limit),
      });
      const res = await fetchWithTimeout(`${cleanBase}/api/recommend/viewed?${sp.toString()}`);
      if (!res.ok) throw new ApiError(`Lỗi tải gợi ý theo lịch sử xem (${res.status})`, res.status);
      return res.json();
    },

    async searchByGoal(query: string, limit = 12): Promise<GoalSearchResponse> {
      const sp = new URLSearchParams({
        q: query,
        limit: String(limit),
      });
      const res = await fetchWithTimeout(`${cleanBase}/api/search/goal?${sp.toString()}`);
      if (!res.ok) throw new ApiError(`Lỗi tìm kiếm theo mục tiêu (${res.status})`, res.status);
      return res.json();
    },
  };
}
