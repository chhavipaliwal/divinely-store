'use client';
import { cn } from '@/lib/utils';
import { Button } from '@nextui-org/react';
import Link from 'next/link';
import { useQueryState } from 'nuqs';

export default function CategoryHeader() {
  const [category] = useQueryState('category');

  const handleExploreClick = () => {
    const categoryBodyElement = document.getElementById('category-body');
    if (categoryBodyElement) {
      categoryBodyElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* {!category && ( */}
      <div
        className={cn(
          'mb-12 flex flex-col items-center gap-4 overflow-hidden px-4 md:px-8'
        )}
      >
        <h2 className="text-[clamp(1.5rem,8vw,13.5rem)] font-semibold">
          Divinely Store
        </h2>
        <p className="max-w-3xl text-center">
          Divinely Store is an open source project designed for designers &
          developers, providing centralized access to free and essential
          resources.
        </p>
        <div className="flex items-center gap-4">
          <Button onClick={handleExploreClick} color="primary">
            Explore
          </Button>
          <Button
            variant="flat"
            as={Link}
            href="https://github.com/imankitkalirawana/divinely-store"
          >
            Contribute
          </Button>
        </div>
      </div>
      {/* )} */}
    </>
  );
}
