/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { searchByGoal, GoalSearchResponse, GENRES_MAP } from '../api';
import { BookCard } from '../components/BookCard';
import { BookCardSkeleton } from '../components/BookCardSkeleton';
import { ErrorAlert } from '../components/ErrorAlert';
import { Search, Compass, Target, ArrowLeft } from 'lucide-react';

export const GoalSearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const [inputVal, setInputVal] = useState(query);
  const [result, setResult] = useState<GoalSearchResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Đồng bộ input với query param
  useEffect(() => {
    setInputVal(query);
  }, [query]);

  const executeSearch = useCallback(async () => {
    if (!query.trim()) {
      setResult(null);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const res = await searchByGoal(query.trim(), 12);
      setResult(res);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi xử lý tìm kiếm theo mục tiêu';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    executeSearch();
  }, [executeSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    setSearchParams({ q: inputVal.trim() });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Nút quay lại */}
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-[#78716C] hover:text-[#0F766E] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E] rounded"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Về trang chủ</span>
        </Link>
      </div>

      {/* Khung tìm kiếm mục tiêu ở đầu trang kết quả */}
      <div className="bg-white border border-[#E7E2DA] rounded-xl p-6 sm:p-8 shadow-2xs mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#0F766E] mb-2">
          <Compass className="w-4 h-4" />
          <span>Gợi ý theo mục tiêu ngôn ngữ tự nhiên</span>
        </div>
        <h1 className="font-serif-display text-2xl sm:text-3xl font-bold text-[#1C1917] mb-4">
          Khuyến nghị theo mục tiêu
        </h1>

        <form onSubmit={handleSubmit} className="relative">
          <div className="relative flex items-center">
            <label htmlFor="goal-page-input" className="sr-only">
              Gõ mục tiêu cần tìm sách
            </label>
            <input
              id="goal-page-input"
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Nhập mục tiêu của bạn: tôi muốn kiếm tiền, muốn học code..."
              className="w-full pl-11 pr-28 sm:pr-32 py-3 bg-[#FAF8F5] border border-[#D6D0C7] rounded-lg text-sm sm:text-base text-[#1C1917] focus:outline-none focus:ring-2 focus:ring-[#0F766E] focus:bg-white transition-all"
            />
            <Search className="w-5 h-5 text-[#78716C] absolute left-3.5 pointer-events-none" />
            <button
              type="submit"
              className="absolute right-1.5 px-4 sm:px-5 py-2 bg-[#0F766E] hover:bg-[#0D655E] text-white text-xs sm:text-sm font-medium rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E]"
            >
              Tìm lại
            </button>
          </div>
        </form>
      </div>

      {error && (
        <div className="mb-6">
          <ErrorAlert message={error} onRetry={executeSearch} />
        </div>
      )}

      {/* THÔNG TIN KẾT QUẢ ĐÃ NHẬN DIỆN */}
      {query && !loading && result && (
        <div className="mb-8 p-4 bg-[#F5F2EB] border border-[#E7E2DA] rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs text-[#78716C]">
              Câu mục tiêu bạn đã nhập:
            </p>
            <p className="text-base font-semibold text-[#1C1917]">
              &ldquo;{result.query}&rdquo;
            </p>
          </div>

          {/* Các thể loại hệ thống nhận ra (dạng chip) */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-[#78716C] font-medium mr-1">
              Thể loại nhận diện:
            </span>
            {result.matched_genres.length === 0 ? (
              <span className="text-xs text-[#78716C] italic">
                (Tổng hợp toàn diện từ kho tri thức)
              </span>
            ) : (
              result.matched_genres.map((gId) => (
                <Link
                  key={gId}
                  to={`/thu-vien?genre=${gId}`}
                  className="px-2.5 py-1 text-xs font-semibold bg-[#0F766E] text-white rounded-md hover:bg-[#0D655E] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E]"
                  title={`Xem toàn bộ sách thể loại ${GENRES_MAP[gId] || gId}`}
                >
                  {GENRES_MAP[gId] || gId}
                </Link>
              ))
            )}
          </div>
        </div>
      )}

      {/* DANH SÁCH KẾT QUẢ */}
      <main>
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <BookCardSkeleton key={i} />
            ))}
          </div>
        ) : !query.trim() ? (
          <div className="text-center py-16 px-4 bg-white border border-[#E7E2DA] rounded-xl">
            <Target className="w-10 h-10 text-[#78716C] mx-auto mb-3" />
            <h2 className="text-lg font-bold text-[#1C1917] mb-2">
              Vui lòng nhập mục tiêu bạn hướng tới
            </h2>
            <p className="text-sm text-[#78716C]">
              Ví dụ: &ldquo;tôi muốn kiếm tiền&rdquo;, &ldquo;muốn học code&rdquo;, &ldquo;muốn phát triển bản thân&rdquo;
            </p>
          </div>
        ) : result && result.items.length === 0 ? (
          <div className="text-center py-16 px-4 bg-white border border-[#E7E2DA] rounded-xl">
            <h2 className="text-lg font-bold text-[#1C1917] mb-2">
              Chưa tìm thấy sách phù hợp với mục tiêu này
            </h2>
            <p className="text-sm text-[#78716C] mb-4">
              Hãy thử diễn đạt lại bằng từ khóa ngắn gọn hơn như: &ldquo;lập trình&rdquo;, &ldquo;đầu tư&rdquo;, &ldquo;giao tiếp&rdquo;.
            </p>
            <Link
              to="/thu-vien"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0F766E] text-white text-xs font-medium rounded-lg"
            >
              <span>Xem toàn bộ thư viện sách</span>
            </Link>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-[#78716C]">
                Tìm thấy <strong className="text-[#1C1917] tabular-nums">{result?.items.length || 0}</strong> cuốn sách phù hợp nhất
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
              {result?.items.map((item) => (
                <BookCard
                  key={item.book.id}
                  book={item.book}
                  reason={item.reason}
                  score={item.score}
                />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
