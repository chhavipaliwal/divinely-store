import EditCategory from '@/components/dashboard/categories/editCategory';
import { API_BASE_URL } from '@/lib/config';
import { Category } from '@/lib/interface';
import { cookies } from 'next/headers';
import React from 'react';

interface Props {
  params: {
    uid: string;
  };
}

const getCategory = async (uid: string) => {
  const res = await fetch(`${API_BASE_URL}/category/${uid}`, {
    cache: 'no-cache',
    method: 'GET',
    headers: { Cookie: cookies().toString() }
  });
  const data = await res.json();
  return data;
};

export default async function Page({ params }: Props) {
  const category: Category = await getCategory(params.uid);
  return (
    <>
      <EditCategory category={category} />
    </>
  );
}
