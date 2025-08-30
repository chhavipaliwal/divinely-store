'use client';
import { cn } from '@/lib/utils';
import { Button } from '@heroui/react';
import { Icon } from '@iconify/react/dist/iconify.js';
import Link from 'next/link';

const socialLinks = [
  {
    icon: 'mdi:github',
    href: 'https://github.com/chhavipaliwal',
    label: 'GitHub'
  },
  {
    icon: 'mdi:twitter',
    href: 'https://x.com/chhavipaliwal',
    label: 'Twitter'
  },
  {
    icon: 'mdi:linkedin',
    href: 'https://www.linkedin.com/in/chhavipaliwal/',
    label: 'LinkedIn'
  },

];

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
            href="https://github.com/chhavipaliwal/divinely-store"
          >
            Contribute
          </Button>
        </div>
        <div className="flex items-center gap-2">
          {socialLinks.map((link) => (
            <Button
              key={link.href}
              isIconOnly
              as={Link}
              href={link.href}
              variant="flat"
              target="_blank"
            >
              <Icon icon={link.icon} width={20} />
            </Button>
          ))}
        </div>
      </div>
    </>
  );
}
