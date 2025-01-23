import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function Layout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return <div className="mx-auto max-w-7xl">{children}</div>;
}
