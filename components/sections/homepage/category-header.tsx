'use client';
import { cn } from '@/lib/utils';
import { Button } from '@heroui/react';
import Link from 'next/link';

export default function CategoryHeader() {
  const handleExploreClick = () => {
    const categoryBodyElement = document.getElementById('category-body');
    if (categoryBodyElement) {
      categoryBodyElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <div
        className={cn(
          'mb-12 flex flex-col items-center gap-4 overflow-hidden p-2 px-4 md:px-8'
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
          <Button onPress={handleExploreClick} color="primary">
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
    </>
  );
}
