/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { isMockMode } from '../api';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-[#E7E2DA] bg-[#F5F2EB] text-[#57534E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 text-[#1C1917] mb-3">
              <BookOpen className="w-5 h-5 text-[#0F766E]" />
              <span className="font-serif-display font-bold text-base">Thư viện gợi ý sách</span>
            </div>
            <p className="text-xs leading-relaxed text-[#78716C] max-w-sm">
              Đồ án nghiên cứu khoa học: Hệ thống khuyến nghị sách tiếng Việt thông minh dựa trên lịch sử tương tác và truy vấn mục tiêu ngôn ngữ tự nhiên.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#1C1917] mb-3">
              Liên kết nhanh
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-[#0F766E] transition-colors">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link to="/thu-vien" className="hover:text-[#0F766E] transition-colors">
                  Thư viện và bộ lọc
                </Link>
              </li>
              <li>
                <Link to="/demo" className="hover:text-[#0F766E] transition-colors">
                  Bảng điều khiển thử nghiệm (Demo)
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#1C1917] mb-3">
              Trạng thái hệ thống
            </h3>
            <div className="text-xs space-y-2 text-[#78716C]">
              <p>
                <span className="font-medium text-[#1C1917]">Chế độ hoạt động:</span>{' '}
                <span className={isMockMode ? 'text-amber-700 font-mono' : 'text-emerald-700 font-mono'}>
                  {isMockMode ? 'Dữ liệu mô phỏng (Mock Data)' : 'Đã kết nối Backend Python API'}
                </span>
              </p>
              <p>
                Hỗ trợ thuật toán lọc dựa trên nội dung (Content-based), theo dõi lịch sử xem và gợi ý mục tiêu.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[#E7E2DA] flex flex-col sm:flex-row items-center justify-between text-xs text-[#A8A29E] gap-4">
          <p>© 2026 Đồ án nghiên cứu khoa học - Hệ thống khuyến nghị sách tiếng Việt</p>
          <p>Mã nguồn mở phục vụ mục đích học thuật và nghiên cứu</p>
        </div>
      </div>
    </footer>
  );
};
