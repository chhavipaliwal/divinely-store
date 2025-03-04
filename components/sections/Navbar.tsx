'use client';
import React from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';
import {
  cn,
  Navbar as NextNavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Divider
} from '@nextui-org/react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const pathname = usePathname();
  if (pathname.includes('/auth')) return null;

  const menuItems = [
    'About',
    'Blog',
    'Customers',
    'Pricing',
    'Enterprise',
    'Changelog',
    'Documentation',
    'Contact Us'
  ];

  return (
    <NextNavbar
      classNames={{
        base: cn('border-default-100', {
          'bg-default-200/50 dark:bg-default-100/50': isMenuOpen
        }),
        wrapper: 'w-full justify-center',
        item: 'hidden md:flex'
      }}
      height="60px"
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
    >
      {/* Left Content */}
      <NavbarBrand>
        <Link href={'/'} className="flex items-center">
          <Image
            alt="logo"
            height={40}
            src="/logo.svg"
            className="rounded-full bg-foreground p-2"
            width={40}
          />
          <span className="ml-2 text-lg font-medium">
            Divinely<span className="text-primary">Store</span>
          </span>
        </Link>
      </NavbarBrand>

      {/* Center Content */}
      <NavbarContent justify="center">
        <NavbarItem>
          <Link className="text-default-500" href="/">
            Home
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link className="text-default-500" href="/dashboard">
            Dashboard
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link
            className="text-default-500"
            href="https://divinely.dev/contact"
          >
            Contact
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link className="text-default-500" href="https://divinely.dev/about">
            About Us
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link className="text-default-500" href="/https://divinely.dev">
            Portfolio
          </Link>
        </NavbarItem>
      </NavbarContent>

      {/* Right Content */}
      <NavbarContent className="hidden md:flex" justify="end">
        <NavbarItem className="ml-2 !flex gap-2">
          <Button
            className="text-default-500"
            as={Link}
            href="/auth/login"
            radius="full"
            variant="light"
          >
            Login
          </Button>
          <Button
            color="primary"
            endContent={<Icon icon="solar:alt-arrow-right-linear" />}
            radius="full"
            variant="flat"
            as={Link}
            href="/auth/register"
          >
            Get Started
          </Button>
        </NavbarItem>
      </NavbarContent>

      <NavbarMenuToggle className="text-default-400 md:hidden" />

      <NavbarMenu
        className="top-[calc(var(--navbar-height)_-_1px)] max-h-fit bg-default-200/50 pb-6 pt-6 shadow-medium backdrop-blur-md backdrop-saturate-150 dark:bg-default-100/50"
        motionProps={{
          initial: { opacity: 0, y: -20 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -20 },
          transition: {
            ease: 'easeInOut',
            duration: 0.2
          }
        }}
      >
        <NavbarMenuItem>
          <Button fullWidth as={Link} href="/auth/register" variant="faded">
            Sign In
          </Button>
        </NavbarMenuItem>
        <NavbarMenuItem className="mb-4">
          <Button
            fullWidth
            as={Link}
            className="bg-foreground text-background"
            href="/auth/register"
          >
            Get Started
          </Button>
        </NavbarMenuItem>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link className="mb-2 w-full text-default-500" href="#">
              {item}
            </Link>
            {index < menuItems.length - 1 && <Divider className="opacity-50" />}
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </NextNavbar>
  );
};

export default Navbar;
