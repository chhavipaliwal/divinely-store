import React from 'react';
import Categories from '@/components/sections/homepage/categories';

export default function Page() {
  return (
    <div className="relative">
      <div className="fixed top-0 z-[-2] h-full min-h-screen w-screen bg-[#000000] bg-[radial-gradient(#ffffff33_1px,#1E2022_1px)] bg-[size:20px_20px]"></div>
      {/* <Links /> */}
      <Categories />
    </div>
  );
}
