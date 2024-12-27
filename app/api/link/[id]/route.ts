import { NextResponse } from 'next/server';
import Link from '@/models/Link';
import { connectDB } from '@/lib/db';
import { auth } from '@/auth';

export const GET = auth(async function GET(request: any, context: any) {
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
    const link = await Link.findByIdAndUpdate(context.params.id, data, {
      new: true
    });
    return NextResponse.json(link);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 });
  }
});

export const DELETE = auth(async function DELETE(request: any, context: any) {
  try {
    if (!request.auth?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    console.log(context.params.id);
    await connectDB();
    const link = await Link.findByIdAndDelete(context.params.id);
    return NextResponse.json(link);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 });
  }
});
