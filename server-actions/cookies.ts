'use server';
import { cookies } from 'next/headers';

export async function getConfig({ name }: { name: string }) {
  const cookieStore = cookies();
  const config = cookieStore.get(name);
  return config;
}

export async function setConfig({ name, value }: { name: string; value: any }) {
  const cookieStore = cookies();
  cookieStore.set(name, JSON.stringify(value));
}
