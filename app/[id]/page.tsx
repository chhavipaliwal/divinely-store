import ViewLink from '@/components/dashboard/links/link';
import { API_BASE_URL } from '@/lib/config';
import { Link } from '@/lib/interface';
import { cookies } from 'next/headers';
import React from 'react';

interface Props {
  params: Promise<{
    id: string;
  }>;
}

const getLink = async (id: string) => {
  const res = await fetch(`${API_BASE_URL}/link/${id}`, {
    cache: 'no-cache',
    method: 'GET',
    headers: { Cookie: (await cookies()).toString() }
  });
  const data = await res.json();
  return data;
};

export default async function Page(props: Props) {
  const params = await props.params;
  const link: Link = await getLink(params.id);
  return (
    <>
      <ViewLink link={link} />
    </>
  );
}
