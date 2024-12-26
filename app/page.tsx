import React from 'react';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Links from '@/components/dashboard/links/links';

export default async function Page() {
  // const links: Link[] = await getLinks();
  const session = await auth();
  if (!session) {
    redirect('/auth/login');
  }
  return (
    <>
      <Links />
    </>
  );
}
