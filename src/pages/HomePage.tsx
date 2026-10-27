/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, Compass, BookMarked, ArrowRight } from 'lucide-react';
import { getBooks, getGenres, Book, Genre } from '../api';
import { BookCard } from '../components/BookCard';
import { BookCardSkeleton } from '../components/BookCardSkeleton';
import { RecommendedSection } from '../components/RecommendedSection';
import { ErrorAlert } from '../components/ErrorAlert';

// 7 nút mục tiêu nhanh theo yêu cầu
const QUICK_GOALS = [
  'kiếm tiền',
  'học lập trình',
  'phát triển bản thân',
  'khởi nghiệp',
  'giao tiếp',
  'quản lý thời gian',
  'học tiếng Anh',
];

export const HomePage: React.FC = () => {
  const [goalInput, setGoalInput] = useState('');
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const loadHomeData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [booksRes, genresRes] = await Promise.all([
        getBooks({ page_size: 8, sort: 'year_desc' }),
        getGenres(),
      ]);
      setFeaturedBooks(booksRes.items);
      setGenres(genresRes);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi tải dữ liệu trang chủ';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHomeData();
  }, []);

  const handleGoalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalInput.trim()) return;
    navigate(`/muc-tieu?q=${encodeURIComponent(goalInput.trim())}`);
  };

  const handleQuickGoalClick = (goal: string) => {
    navigate(`/muc-tieu?q=${encodeURIComponent(goal)}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* KHỐI NỔI BẬT: TÌM SÁCH THEO MỤC TIÊU TỰ NHIÊN (Chức năng 3) */}
      <section
        aria-labelledby="goal-search-hero"
        className="bg-gradient-to-b from-[#F2ECE1] to-[#FAF8F5] border border-[#E7E2DA] rounded-2xl p-6 sm:p-10 md:p-12 mb-14 shadow-sm"
      >
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#0F766E]/10 text-[#0F766E] text-xs font-semibold uppercase tracking-wider mb-3">
            <Compass className="w-4 h-4" />
            <span>Hệ thống khuyến nghị thông minh</span>
          </div>

          <h1
            id="goal-search-hero"
            className="font-serif-display text-2xl sm:text-4xl md:text-5xl font-bold text-[#1C1917] tracking-tight mb-4 text-balance"
          >
            Tìm sách theo mục tiêu của bạn
          </h1>

          <p className="text-sm sm:text-base text-[#57534E] mb-8 max-w-xl mx-auto text-balance">
            Mô tả mục tiêu bạn đang hướng tới bằng ngôn ngữ tự nhiên. Hệ thống sẽ phân tích ngữ nghĩa để gợi ý những cuốn sách phù hợp nhất.
          </p>

          {/* Ô nhập mục tiêu nổi bật */}
          <form onSubmit={handleGoalSubmit} className="relative mb-6">
            <div className="relative flex items-center">
              <label htmlFor="home-goal-input" className="sr-only">
                Nhập mục tiêu đọc sách của bạn
              </label>
              <input
                id="home-goal-input"
                type="text"
                value={goalInput}
                onChange={(e) => setGoalInput(e.target.value)}
                placeholder="Ví dụ: tôi muốn kiếm tiền, muốn học code, phát triển bản thân..."
                className="w-full pl-12 pr-28 sm:pr-36 py-3.5 sm:py-4 bg-white border-2 border-[#D6D0C7] rounded-xl text-sm sm:text-base text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:border-[#0F766E] shadow-sm transition-all"
              />
              <Search className="w-5 h-5 text-[#78716C] absolute left-4 pointer-events-none" />
              <button
                type="submit"
                className="absolute right-2 px-4 sm:px-6 py-2 sm:py-2.5 bg-[#0F766E] hover:bg-[#0D655E] text-white text-xs sm:text-sm font-medium rounded-lg transition-colors shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E]"
              >
                Gợi ý ngay
              </button>
            </div>
          </form>

          {/* Các nút mục tiêu nhanh */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            <span className="text-xs text-[#78716C] font-medium mr-1">
              Gợi ý nhanh:
            </span>
            {QUICK_GOALS.map((goal) => (
              <button
                key={goal}
                type="button"
                onClick={() => handleQuickGoalClick(goal)}
                className="px-3 py-1.5 text-xs bg-white hover:bg-[#F0FDFA] hover:text-[#0F766E] text-[#44403C] border border-[#E7E2DA] hover:border-[#0F766E]/40 rounded-md transition-colors font-medium shadow-2xs focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E]"
              >
                {goal}
              </button>
            ))}
          </div>
        </div>
      </section>

      {error && (
        <div className="mb-8">
          <ErrorAlert message={error} onRetry={loadHomeData} />
        </div>
      )}

      {/* LƯỚI THỂ LOẠI ĐỂ BẤM VÀO */}
      <section aria-labelledby="genres-grid-heading" className="mb-14">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 id="genres-grid-heading" className="font-serif-display text-xl sm:text-2xl font-bold text-[#1C1917]">
              Khám phá theo thể loại
            </h2>
            <p className="text-xs sm:text-sm text-[#78716C] mt-0.5">
              10 chủ đề tri thức được phân loại chuẩn hóa cho đồ án
            </p>
          </div>
          <Link
            to="/thu-vien"
            className="text-xs sm:text-sm font-medium text-[#0F766E] hover:underline flex items-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E] rounded"
          >
            <span>Xem tất cả sách</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {genres.map((g) => (
            <Link
              key={g.id}
              to={`/thu-vien?genre=${g.id}`}
              className="p-3.5 bg-white border border-[#E7E2DA] rounded-lg hover:border-[#0F766E]/50 hover:bg-[#FDFBF7] transition-all group flex flex-col justify-between min-h-[5.5rem] shadow-2xs focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E]"
            >
              <div className="flex items-center justify-between">
                <BookMarked className="w-4 h-4 text-[#78716C] group-hover:text-[#0F766E] transition-colors" />
                <span className="text-[11px] font-mono text-[#A8A29E] tabular-nums">
                  {g.book_count} cuốn
                </span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-[#1C1917] group-hover:text-[#0F766E] transition-colors line-clamp-2 mt-2">
                {g.name}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* HÀNG SÁCH NỔI BẬT */}
      <section aria-labelledby="featured-books-heading" className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 id="featured-books-heading" className="font-serif-display text-xl sm:text-2xl font-bold text-[#1C1917]">
              Sách nổi bật được quan tâm
            </h2>
            <p className="text-xs sm:text-sm text-[#78716C] mt-0.5">
              Những ấn phẩm có lượt độc giả tìm đọc và đánh giá cao nhất
            </p>
          </div>
          <Link
            to="/thu-vien"
            className="text-xs sm:text-sm font-medium text-[#0F766E] hover:underline flex items-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E] rounded"
          >
            <span>Vào thư viện</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <BookCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
            {featuredBooks.slice(0, 8).map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </section>

      {/* CHỨC NĂNG 2: GỢI Ý THEO LỊCH SỬ XEM (chỉ hiện khi có cuốn >= 3 lượt xem, nếu không ẩn hẳn) */}
      <RecommendedSection />
    </div>
  );
};
