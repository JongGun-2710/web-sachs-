/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Book {
  id: string;
  title: string;
  authors: string[];
  genres: string[]; // chứa id thể loại
  description: string;
  year: number | null;
  publisher: string | null;
  page_count: number | null;
  isbn: string | null;
  rating: number | null;
}

export interface Genre {
  id: string;
  name: string;
  book_count: number;
}

export interface Author {
  name: string;
  book_count: number;
}

export type BookSortOption = 'title_asc' | 'year_desc' | 'year_asc';

export interface BookListParams {
  genre?: string;
  author?: string;
  q?: string;
  sort?: BookSortOption;
  page?: number;
  page_size?: number;
}

export interface BookListResponse {
  items: Book[];
  total: number;
  page: number;
  page_size: number;
}

export interface ViewResponse {
  ok: boolean;
  view_count: number;
}

export interface RecommendationSection {
  based_on: Book;
  view_count: number;
  items: Book[];
}

export interface ViewedRecommendationsResponse {
  sections: RecommendationSection[];
}

export interface GoalMatchItem {
  book: Book;
  score: number; // 0 đến 1
  reason: string;
}

export interface GoalSearchResponse {
  query: string;
  matched_genres: string[];
  items: GoalMatchItem[];
}

export const MIN_VIEWS = 3;

/**
 * 10 thể loại chuẩn hóa theo đề cương đồ án nghiên cứu khoa học
 */
export const GENRES_MAP: Record<string, string> = {
  kiem_tien_dau_tu: 'Kiếm tiền & đầu tư',
  khoi_nghiep_kinh_doanh: 'Khởi nghiệp & kinh doanh',
  hoc_lap_trinh_cong_nghe: 'Lập trình & công nghệ',
  phat_trien_ban_than: 'Phát triển bản thân',
  giao_tiep_lanh_dao: 'Giao tiếp & lãnh đạo',
  tam_ly_suc_khoe: 'Tâm lý & sức khỏe',
  hoc_ngoai_ngu: 'Học ngoại ngữ',
  van_hoc: 'Văn học',
  khoa_hoc_lich_su: 'Khoa học & lịch sử',
  thieu_nhi: 'Thiếu nhi',
};
