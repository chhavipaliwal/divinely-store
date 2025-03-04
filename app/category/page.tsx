import React from 'react';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Categories from '@/components/dashboard/categories/categories';
import { Category } from '@/lib/interface';
import { API_BASE_URL } from '@/lib/config';
import { cookies } from 'next/headers';

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
  const categories: Category[] = await getCategories();
  const session = await auth();
  if (!session) {
    redirect('/auth/login');
  }
  return (
    <>
      <Categories categories={categories} />
    </>
  );
}
