import React from 'react';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Links from '@/components/dashboard/links/links';
import { Category, Link } from '@/lib/interface';
import { API_BASE_URL } from '@/lib/config';
import { cookies } from 'next/headers';

const getLinks = async () => {
  const res = await fetch(`${API_BASE_URL}/link`, {
    cache: 'no-cache',
    method: 'GET',
    headers: { Cookie: cookies().toString() }
  });
  const data = await res.json();
  return data;
};

const getCategories = async () => {
  const res = await fetch(`${API_BASE_URL}/category`, {
    cache: 'no-cache',
    method: 'GET',
    headers: { Cookie: cookies().toString() }
  });
  const data = await res.json();
  return data;
};

export default async function Page() {
  const links: Link[] = await getLinks();
  const categories: Category[] = await getCategories();
  const session = await auth();
  if (!session) {
    redirect('/auth/login');
  }
  return (
    <>
      <Links links={links} categories={categories} />
    </>
  );
}
