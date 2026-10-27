/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getAnonymousUserId,
  isMockMode,
  currentApiBaseUrl,
  demoGetAllBooks,
  getDemoAllViewCounts,
  demoSimulateIncrementView,
  demoClearViewHistory,
  Book,
  GENRES_MAP,
  MIN_VIEWS,
} from '../api';
import {
  Sparkles,
  RotateCcw,
  Plus,
  Compass,
  CheckCircle2,
  AlertTriangle,
  Server,
  User,
  ArrowRight,
} from 'lucide-react';

const SAMPLE_GOALS = [
  'Tôi muốn học lập trình để làm việc trong ngành công nghệ',
  'Tôi muốn kiếm tiền và tự do tài chính',
  'Muốn rèn luyện thói quen và kỷ luật bản thân',
  'Bí quyết khởi nghiệp và tìm kiếm khách hàng',
  'Cải thiện kỹ năng giao tiếp và thuyết phục đồng nghiệp',
  'Làm sao để giảm stress, ngủ ngon và sống hạnh phúc',
  'Tự học tiếng Anh giao tiếp cấp tốc',
  'Khám phá lịch sử loài người và bí ẩn vũ trụ',
];

export const DemoPage: React.FC = () => {
  const navigate = useNavigate();
  const userId = getAnonymousUserId();

  const [books] = useState<Book[]>(demoGetAllBooks());
  const [viewCounts, setViewCounts] = useState<Record<string, number>>({});
  const [copied, setCopied] = useState(false);

  // Tải bảng số lượt xem
  const refreshViews = () => {
    setViewCounts({ ...getDemoAllViewCounts(userId) });
  };

  useEffect(() => {
    refreshViews();
  }, [userId]);

  // Giả lập thêm 1 lượt xem cho 1 cuốn sách
  const handleIncrement = (bookId: string) => {
    demoSimulateIncrementView(userId, bookId);
    refreshViews();
  };

  // Xóa toàn bộ lịch sử xem
  const handleClearHistory = () => {
    if (window.confirm('Bạn có chắc muốn xóa sạch lịch sử xem để đưa hệ thống về trạng thái ban đầu?')) {
      demoClearViewHistory(userId);
      refreshViews();
    }
  };

  const handleCopyUserId = () => {
    navigator.clipboard.writeText(userId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSampleGoalClick = (goal: string) => {
    navigate(`/muc-tieu?q=${encodeURIComponent(goal)}`);
  };

  // Thống kê nhanh
  const totalBooks = books.length;
  const viewedBooks = Object.keys(viewCounts).filter((k) => (viewCounts[k] || 0) > 0).length;
  const qualifyingBooks = Object.keys(viewCounts).filter((k) => (viewCounts[k] || 0) >= MIN_VIEWS).length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Tiêu đề bảng điều khiển */}
      <div className="mb-8 pb-6 border-b border-[#E7E2DA]">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-amber-100 text-amber-900 text-xs font-semibold uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4 text-amber-700" />
          <span>Bảng điều khiển phục vụ bảo vệ đồ án NCKH</span>
        </div>
        <h1 className="font-serif-display text-2xl sm:text-3xl font-bold text-[#1C1917]">
          Bảng điều khiển thử nghiệm (Demo Control Panel)
        </h1>
        <p className="text-xs sm:text-sm text-[#78716C] mt-1 max-w-3xl">
          Công cụ hỗ trợ hội đồng và người báo cáo kiểm tra trực tiếp 3 chức năng cốt lõi: tìm theo thể loại/tác giả, kích hoạt gợi ý theo lịch sử xem (từ 3 lượt trở lên), và kiểm chứng mô hình gợi ý theo mục tiêu.
        </p>
      </div>

      {/* THÔNG TIN HỆ THỐNG & NGƯỜI DÙNG */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {/* Khối Mã người dùng ẩn danh */}
        <div className="p-5 bg-white border border-[#E7E2DA] rounded-xl shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#78716C] uppercase mb-2">
            <User className="w-4 h-4 text-[#0F766E]" />
            <span>Mã người dùng ẩn danh (Anonymous User ID)</span>
          </div>
          <div className="flex items-center gap-2 bg-[#FAF8F5] p-2.5 rounded border border-[#E7E2DA]">
            <span className="font-mono text-xs sm:text-sm text-[#1C1917] truncate flex-grow">
              {userId}
            </span>
            <button
              type="button"
              onClick={handleCopyUserId}
              className="px-2.5 py-1 text-xs font-medium bg-white hover:bg-[#F2ECE1] text-[#44403C] border border-[#D6D0C7] rounded transition-colors shrink-0"
            >
              {copied ? 'Đã sao chép' : 'Sao chép'}
            </button>
          </div>
          <p className="text-[11px] text-[#78716C] mt-2">
            Được tự động sinh bằng <code className="font-mono">crypto.randomUUID()</code> và lưu trong localStorage để gắn kết lịch sử xem xuyên suốt phiên làm việc.
          </p>
        </div>

        {/* Khối Chế độ vận hành */}
        <div className="p-5 bg-white border border-[#E7E2DA] rounded-xl shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#78716C] uppercase mb-2">
            <Server className="w-4 h-4 text-[#0F766E]" />
            <span>Chế độ vận hành & Kết nối API</span>
          </div>
          <div className="flex items-center justify-between bg-[#FAF8F5] p-2.5 rounded border border-[#E7E2DA]">
            <div className="flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  isMockMode ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
              />
              <span className="text-xs sm:text-sm font-semibold text-[#1C1917]">
                {isMockMode ? 'Dữ liệu mô phỏng (Mock Mode)' : 'Backend API thật'}
              </span>
            </div>
            <span className="text-[11px] font-mono text-[#78716C] truncate max-w-[180px]">
              {currentApiBaseUrl || 'VITE_API_BASE_URL (trống)'}
            </span>
          </div>
          <p className="text-[11px] text-[#78716C] mt-2">
            Để đổi sang backend Python thật: chỉ cần đặt biến <code className="font-mono">VITE_API_BASE_URL=&quot;http://localhost:8000&quot;</code> mà không cần sửa bất kỳ dòng code nào.
          </p>
        </div>
      </div>

      {/* PHẦN 1: DANH SÁCH 8 CÂU MỤC TIÊU MẪU */}
      <section aria-labelledby="sample-goals-heading" className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-[#0F766E]" />
            <h2 id="sample-goals-heading" className="font-serif-display text-xl font-bold text-[#1C1917]">
              8 câu mục tiêu mẫu (Bấm để chạy thử nghiệm ngay)
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SAMPLE_GOALS.map((goal, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSampleGoalClick(goal)}
              className="p-3.5 bg-white hover:bg-[#F0FDFA] border border-[#E7E2DA] hover:border-[#0F766E]/50 rounded-lg text-left transition-all group flex items-start justify-between gap-3 shadow-2xs focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E]"
            >
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-semibold text-[#0F766E] uppercase">
                  Mẫu 0{idx + 1}
                </span>
                <p className="text-xs sm:text-sm font-medium text-[#1C1917] group-hover:text-[#0F766E] transition-colors">
                  &ldquo;{goal}&rdquo;
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-[#A8A29E] group-hover:text-[#0F766E] group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
            </button>
          ))}
        </div>
      </section>

      {/* PHẦN 2: BẢNG SỐ LƯỢT XEM VÀ GIẢ LẬP GỢI Ý THEO LỊCH SỬ (CHỨC NĂNG 2) */}
      <section aria-labelledby="view-history-heading">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 id="view-history-heading" className="font-serif-display text-xl font-bold text-[#1C1917]">
                Bảng theo dõi lịch sử xem sách
              </h2>
            </div>
            <p className="text-xs text-[#78716C] mt-0.5">
              Quy tắc: Khi một cuốn sách đạt từ <strong>{MIN_VIEWS}</strong> lượt xem trở lên, khu vực &ldquo;Có thể bạn quan tâm&rdquo; sẽ tự động xuất hiện.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleClearHistory}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Xóa toàn bộ lịch sử xem</span>
            </button>
          </div>
        </div>

        {/* Thanh tóm tắt trạng thái trigger */}
        <div className="mb-4 p-3 bg-[#FAF8F5] border border-[#E7E2DA] rounded-lg flex flex-wrap items-center justify-between text-xs gap-2">
          <div className="flex items-center gap-4">
            <span>
              Tổng số sách trong kho: <strong className="tabular-nums">{totalBooks}</strong>
            </span>
            <span>·</span>
            <span>
              Đã xem: <strong className="tabular-nums">{viewedBooks}</strong> cuốn
            </span>
            <span>·</span>
            <span>
              Đạt ngưỡng &gt;= {MIN_VIEWS} lượt:{' '}
              <strong className="text-[#0F766E] tabular-nums">{qualifyingBooks}</strong> cuốn
            </span>
          </div>

          {qualifyingBooks > 0 ? (
            <div className="flex items-center gap-1.5 text-emerald-800 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Khu vực &ldquo;Có thể bạn quan tâm&rdquo; ĐANG HIỆN trên các trang</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-[#78716C]">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Chưa có cuốn nào đạt {MIN_VIEWS} lượt xem (Khu vực đang ẩn đúng theo yêu cầu)</span>
            </div>
          )}
        </div>

        {/* Bảng dữ liệu lượt xem */}
        <div className="bg-white border border-[#E7E2DA] rounded-xl overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F5F2EB] border-b border-[#E7E2DA] text-[#57534E] uppercase tracking-wider font-semibold">
                <tr>
                  <th scope="col" className="p-3 w-16">Mã</th>
                  <th scope="col" className="p-3">Tên sách</th>
                  <th scope="col" className="p-3">Tác giả</th>
                  <th scope="col" className="p-3">Thể loại</th>
                  <th scope="col" className="p-3 text-center w-28">Số lượt xem</th>
                  <th scope="col" className="p-3 text-center w-36">Trạng thái gợi ý</th>
                  <th scope="col" className="p-3 text-right w-44">Thao tác giả lập</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0ECE6]">
                {books.map((b) => {
                  const count = viewCounts[b.id] || 0;
                  const isQualifying = count >= MIN_VIEWS;
                  return (
                    <tr
                      key={b.id}
                      className={isQualifying ? 'bg-[#F0FDFA]/50 hover:bg-[#F0FDFA]' : 'hover:bg-[#FAF8F5]'}
                    >
                      <td className="p-3 font-mono text-[#78716C]">{b.id}</td>
                      <td className="p-3 font-medium text-[#1C1917]">
                        <span title={b.title} className="line-clamp-1">
                          {b.title}
                        </span>
                      </td>
                      <td className="p-3 text-[#57534E] truncate max-w-[140px]">
                        {b.authors.join(', ')}
                      </td>
                      <td className="p-3 text-[#78716C]">
                        {GENRES_MAP[b.genres[0]] || b.genres[0]}
                      </td>
                      <td className="p-3 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded font-mono font-bold tabular-nums ${
                            isQualifying
                              ? 'bg-[#0F766E] text-white'
                              : count > 0
                              ? 'bg-[#E7E2DA] text-[#1C1917]'
                              : 'text-[#A8A29E]'
                          }`}
                        >
                          {count}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        {isQualifying ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0F766E]">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Đã kích hoạt gợi ý</span>
                          </span>
                        ) : count > 0 ? (
                          <span className="text-[11px] text-[#78716C]">
                            Cần thêm {MIN_VIEWS - count} lượt
                          </span>
                        ) : (
                          <span className="text-[11px] text-[#A8A29E]">Chưa xem</span>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleIncrement(b.id)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium bg-white hover:bg-[#F0FDFA] text-[#0F766E] hover:text-[#0D655E] border border-[#0F766E]/30 rounded transition-colors shadow-2xs focus:outline-none focus-visible:ring-1 focus-visible:ring-[#0F766E]"
                          title="Tăng nhanh 1 lượt xem để test gợi ý"
                        >
                          <Plus className="w-3 h-3" />
                          <span>+1 lượt xem</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};
