/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Book, GENRES_MAP } from '../api/types';
import { BookCover } from './BookCover';
import { Star } from 'lucide-react';

interface BookCardProps {
  book: Book;
  reason?: string;
  score?: number;
}

export const BookCard: React.FC<BookCardProps> = ({ book, reason, score }) => {
  const primaryGenre = book.genres[0] || 'phat_trien_ban_than';
  const genreName = GENRES_MAP[primaryGenre] || 'Khác';
  const authorName = book.authors.join(', ');

  return (
    <article className="group flex flex-col h-full bg-white rounded-lg border border-[#E7E2DA] hover:border-[#0F766E]/40 hover:shadow-md transition-all duration-200 overflow-hidden">
      <Link
        to={`/sach/${book.id}`}
        className="block p-3 pb-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E] rounded-t-lg"
        aria-label={`Xem chi tiết sách ${book.title} của ${authorName}`}
      >
        <div className="transform group-hover:-translate-y-1 transition-transform duration-200">
          <BookCover
            title={book.title}
            author={book.authors[0] || ''}
            primaryGenre={primaryGenre}
            size="md"
          />
        </div>
      </Link>

      <div className="p-3.5 flex flex-col flex-grow justify-between">
        <div>
          {/* Metadata unboxed: Thể loại chính · Năm xuất bản */}
          <div className="flex items-center gap-1.5 text-xs text-[#78716C] mb-1.5">
            <span className="font-medium text-[#0F766E] truncate">{genreName}</span>
            {book.year && (
              <>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">{book.year}</span>
              </>
            )}
          </div>

          {/* Tiêu đề sách: cắt đúng 2 dòng với line-clamp-2 và chiều cao cố định */}
          <Link
            to={`/sach/${book.id}`}
            className="block text-[#1C1917] font-semibold text-sm leading-snug line-clamp-2 hover:text-[#0F766E] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E] rounded min-h-[2.5rem]"
            title={book.title}
          >
            {book.title}
          </Link>

          {/* Tác giả */}
          <p className="text-xs text-[#57534E] truncate mt-1" title={authorName}>
            {authorName}
          </p>

          {/* Đánh giá: CHỈ hiện khi có rating > 0, nếu null thì ẩn hẳn, KHÔNG BAO GIỜ hiện 0 sao */}
          {book.rating !== null && book.rating !== undefined && (
            <div className="flex items-center gap-1 mt-2 text-xs text-amber-700 font-medium">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              <span className="tabular-nums">{book.rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        {/* Nếu có lý do gợi ý từ mục tiêu */}
        {reason && (
          <div className="mt-2.5 pt-2 border-t border-[#F0ECE6] text-[11px] text-[#0F766E] bg-[#F0FDFA] p-1.5 rounded">
            <span className="font-medium">Lý do:</span> {reason}
          </div>
        )}

        {/* Thanh hiển thị độ phù hợp nếu có score */}
        {typeof score === 'number' && (
          <div className="mt-2">
            <div className="flex justify-between text-[11px] text-[#57534E] mb-0.5">
              <span>Độ phù hợp</span>
              <span className="font-medium text-[#0F766E] tabular-nums">
                {Math.round(score * 100)}%
              </span>
            </div>
            <div className="w-full bg-[#E7E2DA] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#0F766E] h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, Math.max(10, score * 100))}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </article>
  );
};
