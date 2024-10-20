import New from '@/components/dashboard/links/new';
import { API_BASE_URL } from '@/lib/config';
import { Category } from '@/lib/interface';
import { cookies } from 'next/headers';
import React from 'react';

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

  return (
    <>
      <New categories={categories} />
    </>
  );
}
