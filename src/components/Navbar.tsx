/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { BookOpen, Search, Menu, X, Sparkles } from 'lucide-react';
import { isMockMode } from '../api';

export const Navbar: React.FC = () => {
  const [quickQuery, setQuickQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickQuery.trim()) return;
    navigate(`/muc-tieu?q=${encodeURIComponent(quickQuery.trim())}`);
    setMobileMenuOpen(false);
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium whitespace-nowrap transition-colors py-1 relative focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E] rounded ${
      isActive
        ? 'text-[#0F766E] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#0F766E]'
        : 'text-[#57534E] hover:text-[#1C1917]'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-sm border-b border-[#E7E2DA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4 lg:gap-8">
          {/* Vùng 1: Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/"
              className="flex items-center gap-2.5 text-[#1C1917] hover:text-[#0F766E] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E] rounded"
              aria-label="Về trang chủ Thư viện gợi ý sách"
            >
              <div className="w-9 h-9 rounded-md bg-[#0F766E] text-white flex items-center justify-center shadow-sm">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="font-serif-display text-lg sm:text-xl font-bold tracking-tight whitespace-nowrap">
                Thư viện gợi ý sách
              </span>
            </Link>

            {/* Nhãn chế độ Mock/API tinh tế */}
            <span
              className={`hidden xl:inline-flex text-[11px] px-2 py-0.5 rounded font-mono ${
                isMockMode ? 'bg-amber-100/80 text-amber-800' : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              {isMockMode ? 'Mô phỏng' : 'Backend API'}
            </span>
          </div>

          {/* Vùng 2: Các liên kết điều hướng */}
          <nav className="hidden md:flex items-center gap-7">
            <NavLink to="/" end className={navLinkClass}>
              Trang chủ
            </NavLink>
            <NavLink to="/thu-vien" className={navLinkClass}>
              Thư viện
            </NavLink>
            <NavLink to="/demo" className={navLinkClass}>
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Bảng Demo</span>
              </span>
            </NavLink>
          </nav>

          {/* Vùng 3: Ô tìm nhanh theo mục tiêu */}
          <div className="flex items-center gap-3 shrink-0">
            <form
              onSubmit={handleSearchSubmit}
              className="relative hidden sm:block w-48 md:w-64 lg:w-72"
            >
              <label htmlFor="nav-quick-search" className="sr-only">
                Tìm nhanh theo mục tiêu
              </label>
              <input
                id="nav-quick-search"
                type="text"
                value={quickQuery}
                onChange={(e) => setQuickQuery(e.target.value)}
                placeholder="Tìm mục tiêu: vd học code..."
                className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm bg-white border border-[#D6D0C7] rounded-lg text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:ring-2 focus:ring-[#0F766E] focus:border-transparent transition-all"
              />
              <Search className="w-4 h-4 text-[#78716C] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </form>

            {/* Nút bật menu mobile */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#57534E] hover:text-[#1C1917] rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E]"
              aria-label={mobileMenuOpen ? 'Đóng menu' : 'Mở menu'}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu trên điện thoại */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FAF8F5] border-b border-[#E7E2DA] px-4 pt-2 pb-4 space-y-3">
          <form onSubmit={handleSearchSubmit} className="pt-2">
            <div className="relative">
              <input
                type="text"
                value={quickQuery}
                onChange={(e) => setQuickQuery(e.target.value)}
                placeholder="Gõ mục tiêu: học code, kiếm tiền..."
                className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-[#D6D0C7] rounded-lg text-[#1C1917]"
              />
              <Search className="w-4 h-4 text-[#78716C] absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </form>

          <div className="flex flex-col space-y-2 pt-2 border-t border-[#E7E2DA]">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium py-2 text-[#1C1917]"
            >
              Trang chủ
            </Link>
            <Link
              to="/thu-vien"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium py-2 text-[#1C1917]"
            >
              Thư viện sách
            </Link>
            <Link
              to="/demo"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium py-2 text-[#0F766E] font-semibold flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Bảng điều khiển Demo (Bảo vệ đồ án)</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
