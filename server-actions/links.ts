'use server';
import { connectDB } from '@/lib/db';
import Link from '@/models/Link';

export async function getAllLinks(category: string | null) {
  await connectDB();
  const links = await Link.find(category ? { category: category } : {})
    .limit(5)
    .lean();
  links.sort((a, b) => a.title.localeCompare(b.title));

  return links.map((link) => ({
    ...link,
    _id: link._id.toString()
  }));
}
