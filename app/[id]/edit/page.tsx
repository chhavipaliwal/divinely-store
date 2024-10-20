import EditLink from '@/components/dashboard/links/EditLink';
import ViewLink from '@/components/dashboard/links/link';
import { API_BASE_URL } from '@/lib/config';
import { Category, Link } from '@/lib/interface';
import { cookies } from 'next/headers';
import React from 'react';

interface Props {
  params: {
    id: string;
  };
}

const getLink = async (id: string) => {
  const res = await fetch(`${API_BASE_URL}/link/${id}`, {
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

export default async function Page({ params }: Props) {
  const link: Link = await getLink(params.id);
  const categories: Category[] = await getCategories();
  return (
    <>
      <EditLink link={link} categories={categories} />
    </>
  );
}
