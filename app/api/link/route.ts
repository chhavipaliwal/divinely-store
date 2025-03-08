import { NextResponse } from 'next/server';
import Link from '@/models/Link';
import { connectDB } from '@/lib/db';
import { auth } from '@/auth';

export const GET = auth(async function GET(request: any) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '25', 10);
    const page = parseInt(searchParams.get('page') || '1', 10);

    const query = searchParams.get('query')?.trim() || '';
    const category = searchParams.get('category') || '';
    const sort = {
      column: searchParams.get('sortColumn') || 'title',
      direction: searchParams.get('sortDirection') || 'ascending'
    };

    const searchQuery = {
      ...(query
        ? {
            $or: [
              { title: { $regex: new RegExp(query.trim(), 'ig') } },
              { description: { $regex: new RegExp(query.trim(), 'ig') } },
              { tags: { $regex: new RegExp(query.trim(), 'ig') } },
              { url: { $regex: new RegExp(query.trim(), 'ig') } }
            ].filter(Boolean) as any[]
          }
        : {}),
      ...(category
        ? { category: { $regex: new RegExp(category.trim(), 'ig') } }
        : {})
    };

    await connectDB();

    let pipeline = [];

    // Add search conditions if any
    if (Object.keys(searchQuery).length > 0) {
      pipeline.push({ $match: searchQuery });
    }

    if (sort.column === 'relevance') {
      // Add a priority field for sorting
      pipeline.push({
        $addFields: {
          sortPriority: {
            $switch: {
              branches: [
                { case: { $eq: ['$isFeatured', true] }, then: 3 },
                { case: { $eq: ['$isEditorsPick', true] }, then: 2 },
                { case: { $eq: ['$isFeatured', false] }, then: 1 }
              ],
              default: 0
            }
          }
        }
      });

      // Sort by priority, creation date, and title
      pipeline.push({
        $sort: {
          sortPriority: -1 as const,
          createdAt: -1 as const,
          title: 1 as const
        }
      });
    } else {
      pipeline.push({
        $sort: {
          [sort.column]: (sort.direction === 'ascending' ? 1 : -1) as 1 | -1
        }
      });
    }

    // Add pagination
    pipeline.push({ $skip: (page - 1) * limit }, { $limit: limit });

    const links = await Link.aggregate(pipeline).catch((error) => {
      throw new Error(error.message);
    });

    const total = await Link.countDocuments(searchQuery);
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({ links, total, totalPages });
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
