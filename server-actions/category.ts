'use server';
import Category from '@/models/Category';
import { connectDB } from '@/lib/db';

export default async function getAllCategories() {
  await connectDB();
  const categories = await Category.find().lean();
  categories.sort((a, b) => a.name.localeCompare(b.name));
  return categories.map((category) => ({
    ...category,
    _id: category._id.toString()
  }));
}
