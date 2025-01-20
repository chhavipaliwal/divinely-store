import React from 'react';
import Links from '@/components/dashboard/links/links';
import Categories from '@/components/sections/homepage/categories';

export default function Page() {
  return (
    <>
      <div className="absolute top-0 z-[-2] h-screen w-screen bg-[#000000] bg-[radial-gradient(#ffffff33_1px,#1E2022_1px)] bg-[size:20px_20px]"></div>
      <div className="p-4 md:p-8">
        {/* <Links /> */}
        <Categories />
      </div>
    </>
  );
}
