/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AlertCircle, RotateCw } from 'lucide-react';

interface ErrorAlertProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({
  message = 'Đã xảy ra lỗi khi tải dữ liệu từ hệ thống gợi ý. Vui lòng thử lại.',
  onRetry,
  className = '',
}) => {
  return (
    <div
      role="alert"
      className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-900 ${className}`}
    >
      <div className="flex items-center gap-2.5">
        <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
        <p className="text-sm font-medium">{message}</p>
      </div>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-700 bg-white border border-rose-300 rounded hover:bg-rose-100 transition-colors shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>Thử lại</span>
        </button>
      )}
    </div>
  );
};
