/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  getBookById,
  getSimilarBooks,
  recordBookView,
  getAnonymousUserId,
  shouldRecordView,
  Book,
  GENRES_MAP,
  getDemoAllViewCounts,
} from '../api';
import { BookCover } from '../components/BookCover';
import { BookCard } from '../components/BookCard';
import { BookCardSkeleton } from '../components/BookCardSkeleton';
import { RecommendedSection } from '../components/RecommendedSection';
import { ErrorAlert } from '../components/ErrorAlert';
import {
  Star,
  Eye,
  Calendar,
  Building,
  FileText,
  Barcode,
  ArrowLeft,
  BookOpen,
} from 'lucide-react';

export const BookDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [book, setBook] = useState<Book | null>(null);
  const [similarBooks, setSimilarBooks] = useState<Book[]>([]);
  const [viewCount, setViewCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const loadBookData = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const userId = getAnonymousUserId();

      // 1. Tải thông tin cuốn sách và sách tương tự
      const [bookData, similarData] = await Promise.all([
        getBookById(id),
        getSimilarBooks(id, 6),
      ]);

      setBook(bookData);
      setSimilarBooks(similarData);

      // 2. Ghi nhận lượt xem (chống trùng: trong 5 giây chỉ ghi nhận 1 lần)
      if (shouldRecordView(id)) {
        const viewRes = await recordBookView(userId, id);
        setViewCount(viewRes.view_count);
        // Kích hoạt cập nhật lại khu vực "Có thể bạn quan tâm" nếu vừa đạt mốc >= 3 lượt xem
        setRefreshTrigger((prev) => prev + 1);
      } else {
        // Lấy số lượt xem hiện tại mà không tăng thêm
        const history = getDemoAllViewCounts(userId);
        setViewCount(history[id] || 1);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi tải thông tin chi tiết sách';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadBookData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [loadBookData]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="animate-pulse space-y-6">
          <div className="h-6 w-32 bg-[#EAE5DF] rounded" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="aspect-[2/3] bg-[#EAE5DF] rounded-lg" />
            <div className="col-span-2 space-y-4">
              <div className="h-8 w-3/4 bg-[#EAE5DF] rounded" />
              <div className="h-4 w-1/2 bg-[#EAE5DF] rounded" />
              <div className="h-24 w-full bg-[#EAE5DF] rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <ErrorAlert message={error || 'Không tìm thấy sách'} onRetry={loadBookData} />
        <div className="mt-6 text-center">
          <Link
            to="/thu-vien"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#0F766E] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại Thư viện sách</span>
          </Link>
        </div>
      </div>
    );
  }

  const primaryGenre = book.genres[0] || 'phat_trien_ban_than';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Nút quay lại */}
      <div className="mb-6">
        <Link
          to="/thu-vien"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-[#78716C] hover:text-[#0F766E] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E] rounded"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại Thư viện</span>
        </Link>
      </div>

      {/* CHI TIẾT SÁCH CHÍNH */}
      <article className="bg-white border border-[#E7E2DA] rounded-xl p-6 sm:p-8 md:p-10 shadow-2xs mb-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* CỘT TRÁI: Bìa sách CSS */}
          <div className="md:col-span-4 flex flex-col items-center">
            <div className="w-full max-w-[260px] transform hover:scale-[1.02] transition-transform duration-300">
              <BookCover
                title={book.title}
                author={book.authors[0] || ''}
                primaryGenre={primaryGenre}
                size="md"
              />
            </div>

            {/* Dòng theo dõi lượt xem của người dùng */}
            <div className="mt-4 px-3 py-1.5 bg-[#FAF8F5] border border-[#E7E2DA] rounded-full text-xs text-[#57534E] flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-[#0F766E]" />
              <span>
                Bạn đã xem cuốn này <strong className="text-[#0F766E] tabular-nums">{viewCount}</strong> lần
              </span>
            </div>
            {viewCount >= 3 && (
              <p className="text-[11px] text-[#0F766E] mt-1 text-center font-medium">
                Đã đạt mốc gợi ý tương quan cho bạn!
              </p>
            )}
          </div>

          {/* CỘT PHẢI: Thông tin chi tiết */}
          <div className="md:col-span-8 flex flex-col">
            {/* Danh sách thể loại (Bấm vào thì chuyển sang /thu-vien?genre=...) */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {book.genres.map((gId) => (
                <Link
                  key={gId}
                  to={`/thu-vien?genre=${gId}`}
                  className="px-2.5 py-1 text-xs font-medium bg-[#F0FDFA] hover:bg-[#CCFBF1] text-[#0F766E] border border-[#CCFBF1] rounded transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E]"
                >
                  {GENRES_MAP[gId] || gId}
                </Link>
              ))}
            </div>

            {/* Tiêu đề sách */}
            <h1 className="font-serif-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1C1917] tracking-tight leading-snug mb-3">
              {book.title}
            </h1>

            {/* Tác giả (Bấm vào thì chuyển sang /thu-vien?author=...) */}
            <div className="flex flex-wrap items-center gap-2 text-sm text-[#57534E] mb-4">
              <span className="text-[#78716C]">Tác giả:</span>
              {book.authors.map((authorName, index) => (
                <React.Fragment key={authorName}>
                  <Link
                    to={`/thu-vien?author=${encodeURIComponent(authorName)}`}
                    className="font-semibold text-[#1C1917] hover:text-[#0F766E] hover:underline transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E] rounded"
                  >
                    {authorName}
                  </Link>
                  {index < book.authors.length - 1 && <span>, </span>}
                </React.Fragment>
              ))}
            </div>

            {/* Đánh giá: Nếu null thì ẩn, tuyệt đối không hiện 0 sao */}
            {book.rating !== null && book.rating !== undefined && (
              <div className="flex items-center gap-2 mb-6">
                <div className="flex items-center gap-1 px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-900 rounded-md text-xs font-semibold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  <span className="tabular-nums">{book.rating.toFixed(1)} / 5.0</span>
                </div>
                <span className="text-xs text-[#78716C]">Đánh giá từ độc giả</span>
              </div>
            )}

            {/* Mô tả đầy đủ */}
            <div className="mb-6">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-[#1C1917] mb-2">
                Giới thiệu tác phẩm
              </h2>
              <p className="text-sm sm:text-base text-[#44403C] leading-relaxed whitespace-pre-line">
                {book.description}
              </p>
            </div>

            {/* Bảng thuộc tính xuất bản */}
            <div className="pt-6 border-t border-[#F0ECE6] grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              {book.year && (
                <div className="flex items-start gap-2">
                  <Calendar className="w-4 h-4 text-[#78716C] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[#78716C] block">Năm xuất bản</span>
                    <span className="font-semibold text-[#1C1917] tabular-nums">{book.year}</span>
                  </div>
                </div>
              )}

              {book.publisher && (
                <div className="flex items-start gap-2">
                  <Building className="w-4 h-4 text-[#78716C] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[#78716C] block">Nhà xuất bản</span>
                    <span className="font-semibold text-[#1C1917]">{book.publisher}</span>
                  </div>
                </div>
              )}

              {book.page_count && (
                <div className="flex items-start gap-2">
                  <FileText className="w-4 h-4 text-[#78716C] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[#78716C] block">Số trang</span>
                    <span className="font-semibold text-[#1C1917] tabular-nums">{book.page_count} trang</span>
                  </div>
                </div>
              )}

              {book.isbn && (
                <div className="flex items-start gap-2">
                  <Barcode className="w-4 h-4 text-[#78716C] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[#78716C] block">Mã ISBN</span>
                    <span className="font-mono text-[#1C1917] text-[11px]">{book.isbn}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </article>

      {/* MỤC: SÁCH TƯƠNG TỰ */}
      {similarBooks.length > 0 && (
        <section aria-labelledby="similar-books-heading" className="mb-14">
          <div className="mb-6">
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#0F766E] mb-1">
              <BookOpen className="w-4 h-4" />
              <span>Thuật toán tương đồng nội dung</span>
            </div>
            <h2 id="similar-books-heading" className="font-serif-display text-xl sm:text-2xl font-bold text-[#1C1917]">
              Sách tương tự
            </h2>
            <p className="text-xs sm:text-sm text-[#78716C] mt-0.5">
              Những đầu sách có cùng chủ đề hoặc cùng tác giả với tác phẩm này
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
            {similarBooks.map((simBook) => (
              <BookCard key={simBook.id} book={simBook} />
            ))}
          </div>
        </section>
      )}

      {/* CHỨC NĂNG 2: GỢI Ý THEO LỊCH SỬ XEM (dưới cùng trang chi tiết, nếu có) */}
      <RecommendedSection refreshTrigger={refreshTrigger} />
    </div>
  );
};
