'use server';
import { cookies } from 'next/headers';

export async function getConfig({ name }: { name: string }) {
  const cookieStore = await cookies();
  const config = cookieStore.get(name);
  return config;
}

export async function setConfig({ name, value }: { name: string; value: any }) {
  const cookieStore = await cookies();
  cookieStore.set(name, JSON.stringify(value));
}
