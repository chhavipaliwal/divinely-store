'use client';
import { Icon } from '@iconify/react/dist/iconify.js';
import {
  BreadcrumbItem,
  Breadcrumbs as NextUIBreadcrumbs
} from '@nextui-org/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

export default function Breadcrumb() {
  const pathname = usePathname();
  if (pathname.includes('/auth')) return null;

  const pathSegments = pathname?.split('/').filter((segment) => segment !== '');

  const breadcrumbItems = pathSegments?.map((segment, index) => {
    const path = `/${pathSegments.slice(0, index + 1).join('/')}`;
    return { label: segment, link: path };
  });
  return (
    <>
      <NextUIBreadcrumbs className="mb-12" variant="solid">
        <BreadcrumbItem>
          <Link href={'/'}>Home</Link>
        </BreadcrumbItem>
        {breadcrumbItems?.map((item, index) => (
          <BreadcrumbItem key={index}>
            {index !== breadcrumbItems.length - 1 ? (
              <Link href={item.link}>
                {item.label.charAt(0).toUpperCase() + item.label.slice(1)}
              </Link>
            ) : (
              <span>
                {item.label.charAt(0).toUpperCase() + item.label.slice(1)}
              </span>
            )}
          </BreadcrumbItem>
        ))}
      </NextUIBreadcrumbs>
    </>
  );
}
