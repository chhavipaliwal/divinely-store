import React from 'react';
import Categories from '@/components/sections/homepage/categories';

export default function Page() {
  return (
    <div className="relative">
      <div className="fixed top-0 z-[-2] h-full min-h-screen w-screen bg-background bg-[radial-gradient(#ffffff33_1px,hsl(var(--heroui-background))_1px)] bg-[size:20px_20px]"></div>
      <Categories />
    </div>
  );
}
