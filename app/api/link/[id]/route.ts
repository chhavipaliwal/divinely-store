import { NextResponse } from 'next/server';
import Link from '@/models/Link';
import { connectDB } from '@/lib/db';
import { auth } from '@/auth';

export const GET = auth(async function GET(_request: any, context: any) {
  try {
    await connectDB();
    const link = await Link.findById(context.params.id);
    return NextResponse.json(link);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 });
  }
});

export const PUT = auth(async function PUT(request: any, context: any) {
  try {
    if (!request.auth?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const data = await request.json();
    data.modifiedBy = request.auth.user.email;

    const link = await Link.findById(context.params.id);
    if (
      request.auth.user.email !== link?.addedBy &&
      request.auth.user.role !== 'admin'
    ) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const updatedLink = await Link.findByIdAndUpdate(context.params.id, data, {
      new: true
    });

    return NextResponse.json(updatedLink);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 });
  }
});

export const PATCH = async function PATCH(request: any, context: any) {
  try {
    await connectDB();

    const { action } = await request.json();

    if (action === 'increment-views') {
      const updatedLink = await Link.findByIdAndUpdate(
        context.params.id,
        { $inc: { views: 1 } },
        { new: true }
      );

      if (!updatedLink) {
        return NextResponse.json(
          { message: 'Link not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        message: 'View count updated',
        views: updatedLink.views
      });
    }

    return NextResponse.json({ message: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 });
  }
};

export const DELETE = auth(async function DELETE(request: any, context: any) {
  try {
    if (!request.auth?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const link = await Link.findById(context.params.id);
    if (
      request.auth.user.email !== link?.addedBy &&
      request.auth.user.role !== 'admin'
    ) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    await Link.findByIdAndDelete(context.params.id);
    return NextResponse.json({ message: 'Link deleted' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 });
  }
});
