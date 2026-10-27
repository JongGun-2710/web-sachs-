/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  getBooks,
  getGenres,
  getAuthors,
  Book,
  Genre,
  Author,
  BookSortOption,
} from '../api';
import { BookCard } from '../components/BookCard';
import { BookCardSkeleton } from '../components/BookCardSkeleton';
import { RecommendedSection } from '../components/RecommendedSection';
import { ErrorAlert } from '../components/ErrorAlert';
import {
  Search,
  Filter,
  X,
  RotateCcw,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Check,
} from 'lucide-react';
import { removeVietnameseAccents } from '../utils/text';

const PAGE_SIZE = 12;

export const LibraryPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Đọc query parameters
  const currentGenre = searchParams.get('genre') || '';
  const currentAuthor = searchParams.get('author') || '';
  const currentQ = searchParams.get('q') || '';
  const currentSort = (searchParams.get('sort') as BookSortOption) || 'title_asc';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  // Trạng thái dữ liệu
  const [books, setBooks] = useState<Book[]>([]);
  const [total, setTotal] = useState(0);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Tìm kiếm tác giả trong dropdown
  const [authorSearchQuery, setAuthorSearchQuery] = useState('');
  const [authorDropdownOpen, setAuthorDropdownOpen] = useState(false);

  // Drawer bộ lọc trên điện thoại
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Tải danh sách thể loại và tác giả một lần
  useEffect(() => {
    let isMounted = true;
    Promise.all([getGenres(), getAuthors()])
      .then(([genresRes, authorsRes]) => {
        if (isMounted) {
          setGenres(genresRes);
          setAuthors(authorsRes);
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  // Tải sách khi bộ lọc hoặc trang thay đổi
  const fetchBooks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getBooks({
        genre: currentGenre || undefined,
        author: currentAuthor || undefined,
        q: currentQ || undefined,
        sort: currentSort,
        page: currentPage,
        page_size: PAGE_SIZE,
      });
      setBooks(res.items);
      setTotal(res.total);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi tải sách từ thư viện';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [currentGenre, currentAuthor, currentQ, currentSort, currentPage]);

  useEffect(() => {
    fetchBooks();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [fetchBooks]);

  // Cập nhật tham số URL
  const updateParams = (newParams: Record<string, string | null>) => {
    const next = new URLSearchParams(searchParams);
    for (const [key, val] of Object.entries(newParams)) {
      if (val === null || val === '') {
        next.delete(key);
      } else {
        next.set(key, val);
      }
    }
    setSearchParams(next);
  };

  const handleGenreChange = (genreId: string) => {
    updateParams({
      genre: currentGenre === genreId ? null : genreId,
      page: '1',
    });
  };

  const handleAuthorSelect = (authorName: string) => {
    updateParams({
      author: currentAuthor === authorName ? null : authorName,
      page: '1',
    });
    setAuthorDropdownOpen(false);
    setAuthorSearchQuery('');
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const qVal = (formData.get('search_q') as string)?.trim() || '';
    updateParams({ q: qVal || null, page: '1' });
  };

  const handleSortChange = (newSort: BookSortOption) => {
    updateParams({ sort: newSort, page: '1' });
  };

  const handlePageChange = (newPage: number) => {
    updateParams({ page: String(newPage) });
  };

  const handleClearFilters = () => {
    setSearchParams(new URLSearchParams());
    setAuthorSearchQuery('');
  };

  // Lọc tác giả theo từ khóa nhập vào ô tìm tác giả
  const filteredAuthors = useMemo(() => {
    if (!authorSearchQuery.trim()) return authors;
    const norm = removeVietnameseAccents(authorSearchQuery);
    return authors.filter((a) => removeVietnameseAccents(a.name).includes(norm));
  }, [authors, authorSearchQuery]);

  const hasActiveFilters = Boolean(currentGenre || currentAuthor || currentQ);
  const totalPages = Math.ceil(total / PAGE_SIZE) || 1;

  // Render nội dung bộ lọc (dùng chung cho sidebar desktop và drawer mobile)
  const renderFilterControls = () => (
    <div className="space-y-6">
      {/* Nút xóa bộ lọc nếu đang có lọc */}
      {hasActiveFilters && (
        <button
          type="button"
          onClick={handleClearFilters}
          className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Xóa tất cả bộ lọc</span>
        </button>
      )}

      {/* Lọc theo Thể loại */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[#1C1917] mb-3">
          Thể loại
        </h3>
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => handleGenreChange('')}
            className={`w-full text-left px-2.5 py-1.5 text-xs rounded-md transition-colors flex items-center justify-between focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E] ${
              !currentGenre
                ? 'bg-[#0F766E] text-white font-medium'
                : 'text-[#44403C] hover:bg-[#F2ECE1]'
            }`}
          >
            <span>Tất cả thể loại</span>
          </button>
          {genres.map((g) => {
            const isSelected = currentGenre === g.id;
            return (
              <button
                key={g.id}
                type="button"
                onClick={() => handleGenreChange(g.id)}
                className={`w-full text-left px-2.5 py-1.5 text-xs rounded-md transition-colors flex items-center justify-between focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E] ${
                  isSelected
                    ? 'bg-[#0F766E] text-white font-medium'
                    : 'text-[#44403C] hover:bg-[#F2ECE1]'
                }`}
              >
                <span className="truncate">{g.name}</span>
                <span
                  className={`text-[10px] tabular-nums font-mono ml-1 ${
                    isSelected ? 'text-white/80' : 'text-[#78716C]'
                  }`}
                >
                  {g.book_count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Lọc theo Tác giả (ô chọn có gõ để tìm) */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
            Tác giả
          </h3>
          {currentAuthor && (
            <button
              type="button"
              onClick={() => handleAuthorSelect('')}
              className="text-[11px] text-rose-600 hover:underline"
            >
              Bỏ chọn
            </button>
          )}
        </div>

        {/* Thẻ hiển thị tác giả đang chọn nếu có */}
        {currentAuthor && (
          <div className="mb-2 p-2 bg-[#F0FDFA] border border-[#99F6E4] rounded text-xs text-[#0F766E] flex items-center justify-between">
            <span className="truncate font-medium">{currentAuthor}</span>
            <button
              type="button"
              onClick={() => handleAuthorSelect('')}
              className="p-0.5 hover:bg-[#CCFBF1] rounded text-[#0F766E]"
              aria-label="Bỏ chọn tác giả"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Ô gõ để tìm tác giả */}
        <div className="relative">
          <input
            type="text"
            value={authorSearchQuery}
            onChange={(e) => {
              setAuthorSearchQuery(e.target.value);
              setAuthorDropdownOpen(true);
            }}
            onFocus={() => setAuthorDropdownOpen(true)}
            placeholder="Gõ để tìm tác giả..."
            className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#D6D0C7] rounded-md text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:ring-1 focus:ring-[#0F766E]"
          />
          {authorSearchQuery && (
            <button
              type="button"
              onClick={() => setAuthorSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[#A8A29E] hover:text-[#57534E]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Danh sách tác giả cuộn được */}
          {authorDropdownOpen && (
            <div className="mt-1 max-h-48 overflow-y-auto bg-white border border-[#D6D0C7] rounded-md shadow-lg p-1 space-y-0.5 z-20">
              {filteredAuthors.length === 0 ? (
                <p className="p-2 text-xs text-[#78716C] text-center">
                  Không tìm thấy tác giả nào
                </p>
              ) : (
                filteredAuthors.map((a) => {
                  const isSelected = currentAuthor === a.name;
                  return (
                    <button
                      key={a.name}
                      type="button"
                      onClick={() => handleAuthorSelect(a.name)}
                      className={`w-full text-left px-2 py-1 text-xs rounded transition-colors flex items-center justify-between ${
                        isSelected
                          ? 'bg-[#0F766E] text-white font-medium'
                          : 'text-[#44403C] hover:bg-[#F2ECE1]'
                      }`}
                    >
                      <span className="truncate">{a.name}</span>
                      <div className="flex items-center gap-1">
                        <span
                          className={`text-[10px] tabular-nums font-mono ${
                            isSelected ? 'text-white/80' : 'text-[#78716C]'
                          }`}
                        >
                          {a.book_count}
                        </span>
                        {isSelected && <Check className="w-3 h-3 text-white" />}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Tiêu đề trang & Thanh công cụ tìm kiếm */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#E7E2DA]">
          <div>
            <h1 className="font-serif-display text-2xl sm:text-3xl font-bold text-[#1C1917]">
              Thư viện sách
            </h1>
            <p className="text-xs sm:text-sm text-[#78716C] mt-1">
              Khám phá và tra cứu toàn bộ kho sách theo thể loại, tác giả hoặc từ khóa
            </p>
          </div>

          {/* Ô gõ từ khóa tên sách */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center gap-2 w-full md:w-auto"
          >
            <div className="relative flex-grow md:w-72">
              <input
                type="text"
                name="search_q"
                defaultValue={currentQ}
                placeholder="Tìm theo tên sách hoặc từ khóa..."
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border border-[#D6D0C7] rounded-lg text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:ring-2 focus:ring-[#0F766E] focus:border-transparent"
              />
              <Search className="w-4 h-4 text-[#78716C] absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
            <button
              type="submit"
              className="px-3.5 py-2 text-xs sm:text-sm bg-[#0F766E] hover:bg-[#0D655E] text-white font-medium rounded-lg transition-colors shrink-0 shadow-2xs focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E]"
            >
              Tìm kiếm
            </button>

            {/* Nút bật Drawer trên Mobile */}
            <button
              type="button"
              onClick={() => setMobileDrawerOpen(true)}
              className="md:hidden flex items-center gap-1.5 px-3 py-2 text-xs bg-white border border-[#D6D0C7] text-[#1C1917] rounded-lg"
              aria-label="Mở bộ lọc sách"
            >
              <Filter className="w-4 h-4 text-[#0F766E]" />
              <span>Bộ lọc</span>
            </button>
          </form>
        </div>

        {/* Thanh trạng thái: Tổng số kết quả + Sắp xếp */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4">
          <div className="text-xs sm:text-sm text-[#57534E]">
            Hiện có <span className="font-semibold text-[#1C1917] tabular-nums">{total}</span> cuốn sách
            {currentGenre && (
              <span>
                {' '}trong thể loại &ldquo;{genres.find((g) => g.id === currentGenre)?.name || currentGenre}&rdquo;
              </span>
            )}
            {currentAuthor && (
              <span> của tác giả &ldquo;{currentAuthor}&rdquo;</span>
            )}
            {currentQ && (
              <span> khớp với từ khóa &ldquo;{currentQ}&rdquo;</span>
            )}
          </div>

          {/* Lựa chọn sắp xếp */}
          <div className="flex items-center gap-2">
            <label htmlFor="sort-select" className="text-xs text-[#78716C] shrink-0">
              Sắp xếp theo:
            </label>
            <select
              id="sort-select"
              value={currentSort}
              onChange={(e) => handleSortChange(e.target.value as BookSortOption)}
              className="px-2.5 py-1 text-xs bg-white border border-[#D6D0C7] rounded text-[#1C1917] focus:outline-none focus:ring-1 focus:ring-[#0F766E]"
            >
              <option value="title_asc">Tên sách (A-Z)</option>
              <option value="year_desc">Năm mới nhất</option>
              <option value="year_asc">Năm cũ nhất</option>
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6">
          <ErrorAlert message={error} onRetry={fetchBooks} />
        </div>
      )}

      {/* BỐ CỤC CHÍNH: CỘT TRÁI (BỘ LỌC) + CỘT PHẢI (LƯỚI SÁCH) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* CỘT TRÁI: BỘ LỌC TRÊN DESKTOP */}
        <aside className="hidden md:block col-span-1 bg-[#FAF8F5]">
          <div className="sticky top-24 p-4 bg-white border border-[#E7E2DA] rounded-lg shadow-2xs">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#F0ECE6]">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#0F766E]" />
                <h2 className="text-sm font-bold text-[#1C1917]">Bộ lọc sách</h2>
              </div>
            </div>
            {renderFilterControls()}
          </div>
        </aside>

        {/* CỘT PHẢI: LƯỚI SÁCH & PHÂN TRANG */}
        <main className="col-span-1 md:col-span-3">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <BookCardSkeleton key={i} />
              ))}
            </div>
          ) : books.length === 0 ? (
            /* TRẠNG THÁI RỖNG (EMPTY STATE) */
            <div className="text-center py-16 px-4 bg-white border border-[#E7E2DA] rounded-xl">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[#F5F2EB] flex items-center justify-center text-[#78716C]">
                <BookOpen className="w-7 h-7 text-[#78716C]" />
              </div>
              <h3 className="font-serif-display text-lg font-bold text-[#1C1917] mb-2">
                Không tìm thấy cuốn sách nào phù hợp
              </h3>
              <p className="text-xs sm:text-sm text-[#78716C] max-w-md mx-auto mb-6">
                Không có cuốn sách nào khớp với các bộ lọc bạn đã chọn. Hãy thử xóa bớt tiêu chí lọc hoặc tìm kiếm bằng từ khóa ngắn hơn.
              </p>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-medium text-white bg-[#0F766E] hover:bg-[#0D655E] rounded-lg shadow-2xs transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E]"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Xóa tất cả bộ lọc</span>
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Lưới sách */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6">
                {books.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>

              {/* PHÂN TRANG */}
              {totalPages > 1 && (
                <nav
                  aria-label="Phân trang sách"
                  className="mt-10 pt-6 border-t border-[#E7E2DA] flex items-center justify-between"
                >
                  <button
                    type="button"
                    disabled={currentPage <= 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md border border-[#D6D0C7] bg-white text-[#44403C] hover:bg-[#F2ECE1] disabled:opacity-40 disabled:pointer-events-none transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Trang trước</span>
                  </button>

                  <div className="flex items-center gap-1 text-xs sm:text-sm text-[#57534E]">
                    <span>Trang</span>
                    <span className="font-semibold text-[#1C1917] tabular-nums">
                      {currentPage}
                    </span>
                    <span>/</span>
                    <span className="tabular-nums">{totalPages}</span>
                  </div>

                  <button
                    type="button"
                    disabled={currentPage >= totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md border border-[#D6D0C7] bg-white text-[#44403C] hover:bg-[#F2ECE1] disabled:opacity-40 disabled:pointer-events-none transition-colors"
                  >
                    <span>Trang sau</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </nav>
              )}
            </>
          )}
        </main>
      </div>

      {/* DRAWER BỘ LỌC TRÊN ĐIỆN THOẠI (NGĂN KÉO) */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Lớp nền mờ */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setMobileDrawerOpen(false)}
          />

          {/* Ngăn kéo trượt từ phải hoặc trái */}
          <div className="relative ml-auto w-4/5 max-w-xs h-full bg-[#FAF8F5] p-5 shadow-xl overflow-y-auto flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#E7E2DA] mb-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-[#0F766E]" />
                  <span className="font-bold text-sm text-[#1C1917]">Bộ lọc tìm kiếm</span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-1 rounded text-[#78716C] hover:text-[#1C1917]"
                  aria-label="Đóng bộ lọc"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {renderFilterControls()}
            </div>

            <div className="pt-4 border-t border-[#E7E2DA] mt-6">
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                className="w-full py-2 bg-[#0F766E] text-white text-xs font-semibold rounded-md shadow-sm"
              >
                Áp dụng bộ lọc
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CHỨC NĂNG 2: GỢI Ý THEO LỊCH SỬ XEM (ở cuối trang thư viện, nếu có) */}
      <RecommendedSection />
    </div>
  );
};
