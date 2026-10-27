/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { GENRES_MAP } from '../api/types';

interface BookCoverProps {
  title: string;
  author: string;
  primaryGenre?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const GENRE_GRADIENTS: Record<string, string> = {
  kiem_tien_dau_tu: 'from-[#064E3B] via-[#0F766E] to-[#134E4A]', // Ngọc bích / Thông
  khoi_nghiep_kinh_doanh: 'from-[#78350F] via-[#92400E] to-[#451A03]', // Hổ phách / Đồng
  hoc_lap_trinh_cong_nghe: 'from-[#0F172A] via-[#1E293B] to-[#0E7490]', // Lam sẫm / Công nghệ
  phat_trien_ban_than: 'from-[#115E59] via-[#047857] to-[#064E3B]', // Ngọc lục bảo
  giao_tiep_lanh_dao: 'from-[#312E81] via-[#3730A3] to-[#1E1B4B]', // Chàm hoàng gia
  tam_ly_suc_khoe: 'from-[#065F46] via-[#166534] to-[#14532D]', // Xanh rêu / Bình an
  hoc_ngoai_ngu: 'from-[#881337] via-[#9F1239] to-[#4C0519]', // Đỏ vang / Gạch nung
  van_hoc: 'from-[#4C0519] via-[#701A75] to-[#2E1065]', // Rượu vang / Cổ điển
  khoa_hoc_lich_su: 'from-[#172554] via-[#1E3A8A] to-[#0B0F19]', // Vũ trụ / Đêm sao
  thieu_nhi: 'from-[#0369A1] via-[#0284C7] to-[#075985]', // Bầu trời / Tuổi thơ
};

export const BookCover: React.FC<BookCoverProps> = ({
  title,
  author,
  primaryGenre = 'phat_trien_ban_than',
  size = 'md',
  className = '',
}) => {
  const gradient = GENRE_GRADIENTS[primaryGenre] || 'from-[#1F2937] via-[#374151] to-[#111827]';
  const genreLabel = GENRES_MAP[primaryGenre] || 'Sách';

  // Kích thước chuẩn tỉ lệ sách 2:3 hoặc 3:4
  const sizeClasses = {
    sm: 'w-24 h-36 text-xs p-2.5',
    md: 'w-full aspect-[2/3] p-4 text-sm',
    lg: 'w-64 h-96 p-6 text-base',
  };

  return (
    <div
      className={`relative rounded-md overflow-hidden bg-gradient-to-br ${gradient} text-white shadow-md transition-all duration-300 flex flex-col justify-between select-none ${sizeClasses[size]} ${className}`}
      style={{
        boxShadow: 'inset 4px 0 8px rgba(0,0,0,0.35), 0 6px 16px -2px rgba(0,0,0,0.18)',
      }}
    >
      {/* Giả lập gáy sách bên trái */}
      <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-gradient-to-r from-black/40 via-white/10 to-transparent pointer-events-none" />

      {/* Đường viền dập chìm mỹ thuật */}
      <div className="absolute inset-1.5 border border-white/15 rounded pointer-events-none" />

      {/* Phần trên bìa: Thể loại & Họa tiết trang nhã */}
      <div className="relative z-10">
        <span className="text-[10px] tracking-wider uppercase opacity-75 font-medium block truncate">
          {genreLabel}
        </span>
      </div>

      {/* Phần giữa: Tiêu đề sách */}
      <div className="relative z-10 my-auto py-2">
        <h3
          className={`font-serif-display font-bold text-white tracking-tight leading-snug drop-shadow-sm ${
            size === 'sm' ? 'text-xs line-clamp-3' : size === 'lg' ? 'text-xl line-clamp-4' : 'text-base line-clamp-3'
          }`}
          title={title}
        >
          {title}
        </h3>
      </div>

      {/* Phần dưới bìa: Tác giả & biểu tượng xuất bản tối giản */}
      <div className="relative z-10 pt-2 border-t border-white/20 flex items-center justify-between">
        <p className="text-[11px] text-white/85 truncate font-medium">
          {author}
        </p>
        <span className="text-[9px] opacity-60 tracking-widest font-mono">
          REC
        </span>
      </div>
    </div>
  );
};
