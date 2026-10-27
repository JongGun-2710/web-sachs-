/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useCallback } from 'react';
import { getViewedRecommendations, ViewedRecommendationsResponse, getAnonymousUserId } from '../api';
import { BookCard } from './BookCard';
import { Sparkles } from 'lucide-react';

interface RecommendedSectionProps {
  className?: string;
  refreshTrigger?: number; // Cho phép component cha yêu cầu cập nhật lại
}

export const RecommendedSection: React.FC<RecommendedSectionProps> = ({
  className = '',
  refreshTrigger = 0,
}) => {
  const [data, setData] = useState<ViewedRecommendationsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const loadRecommendations = useCallback(async () => {
    try {
      setLoading(true);
      const userId = getAnonymousUserId();
      const res = await getViewedRecommendations(userId);
      setData(res);
    } catch {
      // Ẩn nhẹ nhàng nếu lỗi
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRecommendations();
  }, [loadRecommendations, refreshTrigger]);

  // Nếu đang tải hoặc không có cuốn sách nào đủ 3 lượt xem, ẩn hoàn toàn khu vực này!
  if (loading || !data || data.sections.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="recommended-heading"
      className={`mt-16 pt-10 border-t border-[#E7E2DA] ${className}`}
    >
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#0F766E] mb-1">
          <Sparkles className="w-4 h-4 text-[#0F766E]" />
          <span>Gợi ý theo lịch sử xem</span>
        </div>
        <h2 id="recommended-heading" className="font-serif-display text-2xl font-bold text-[#1C1917]">
          Có thể bạn quan tâm
        </h2>
        <p className="text-sm text-[#78716C] mt-1">
          Hệ thống phát hiện sở thích đọc của bạn dựa trên các đầu sách bạn thường xuyên tìm hiểu
        </p>
      </div>

      <div className="space-y-12">
        {data.sections.map((section, idx) => (
          <div key={section.based_on.id} className="space-y-4">
            {/* Lý do gợi ý */}
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="text-xs font-medium px-2.5 py-1 bg-[#F0FDFA] border border-[#CCFBF1] text-[#0F766E] rounded">
                Vì bạn đã xem &ldquo;{section.based_on.title}&rdquo; {section.view_count} lần
              </span>
              <span className="text-xs text-[#78716C]">
                {section.items.length} cuốn sách tương tự gợi ý riêng cho bạn
              </span>
            </div>

            {/* Lưới sách gợi ý */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
              {section.items.slice(0, 8).map(book => (
                <BookCard
                  key={`${section.based_on.id}-${book.id}`}
                  book={book}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
