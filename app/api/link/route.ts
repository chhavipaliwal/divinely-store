import { NextResponse } from 'next/server';
import Link from '@/models/Link';
import { connectDB } from '@/lib/db';
import { auth } from '@/auth';

export const GET = auth(async function GET(request: any) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 20;
    const search = searchParams.get('search');

    await connectDB();

    // Build the search query if there's a search term
    const searchQuery = search
      ? {
          $or: [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
            { category: { $regex: search, $options: 'i' } },
            { tags: { $elemMatch: { $regex: search, $options: 'i' } } }
          ]
        }
      : {};

    // Paginate based on the page and limit
    const links = await Link.find(searchQuery)
      .skip((page - 1) * limit)
      .limit(limit);

    const totalLinks = await Link.countDocuments(searchQuery);
    const totalPages = Math.ceil(totalLinks / limit);

    return NextResponse.json({
      links,
      pagination: {
        page,
        limit,
        totalLinks,
        totalPages
      }
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 });
  }
});

export const POST = auth(async function POST(request: any) {
  try {
    if (!request.auth?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    await connectDB();
    const data = await request.json();
    data.addedBy = request.auth.user.email;
    data.modifiedBy = request.auth.user.email;
    const link = new Link(data);
    await link.save();
    return NextResponse.json(link);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 });
  }
});
