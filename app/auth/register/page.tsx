import React from 'react';
import { auth } from '@/auth';
import Register from '@/components/auth/Register';
import { redirect } from 'next/navigation';

export default async function Login() {
  const session = await auth();

  if (session) {
    redirect('/');
  }
  return (
    <>
      <Register />
    </>
  );
}
