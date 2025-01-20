'use client';
import { Button } from '@nextui-org/react';
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
      <div className="flex flex-col items-center gap-4">
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
    </>
  );
}
