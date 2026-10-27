/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export const BookCardSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-white rounded-lg border border-[#E7E2DA] p-3 animate-pulse">
      <div className="w-full aspect-[2/3] bg-[#EAE5DF] rounded-md mb-3" />
      <div className="h-3 w-1/3 bg-[#EAE5DF] rounded mb-2" />
      <div className="h-4 w-full bg-[#EAE5DF] rounded mb-1" />
      <div className="h-4 w-3/4 bg-[#EAE5DF] rounded mb-2" />
      <div className="h-3 w-1/2 bg-[#EAE5DF] rounded mt-auto" />
    </div>
  );
};
