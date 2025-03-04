import { NextResponse } from 'next/server';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand
} from '@aws-sdk/client-s3';
import { auth } from '@/auth';

const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com/divinely-store`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.CLOUDFLARE_ACCESS_KEY_SECRET || ''
  }
});

async function uploadFile(
  buffer: Buffer,
  filename: string,
  contentType: string
) {
  if (!buffer) {
    throw new Error('Buffer is required');
  }
  const params = {
    Bucket: 'r2',
    Key: filename,
    Body: buffer,
    ContentType: contentType
  };
  const command = new PutObjectCommand(params);
  return await s3Client
    .send(command)
    .then((data) => {
      return data;
    })
    .catch((error) => {
      throw error;
    });
}

async function deleteFile(filename: string) {
  const params = {
    Bucket: process.env.CLOUDFLARE_BUCKET_NAME,
    Key: filename
  };
  await s3Client
    .send(new DeleteObjectCommand(params))
    .then((data) => {
      return data;
    })
    .catch((error) => {
      throw error;
    });
}

export const POST = auth(async function POST(request: any) {
  try {
    // if (request.auth?.user?.role !== 'admin') {
    //   return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    // }
    const data = await request.formData();
    const file = data.get('file');
    const filename = data.get('filename');
    if (!file) {
      return NextResponse.json(
        { message: 'Please select a file' },
        { status: 400 }
      );
    }
    const contentType = file.type;
    const buffer = Buffer.from(await file.arrayBuffer());
    const res = await uploadFile(buffer, filename, contentType);
    return NextResponse.json({
      message: 'File uploaded successfully',
      res,
      url: `https://${process.env.CLOUDFLARE_PUBLIC_ID}.r2.dev/r2/${filename}`
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
});

export const DELETE = auth(async function DELETE(request: any) {
  try {
    if (request.auth?.user?.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const data = await request.json();
    const filename = data.filename;
    if (!filename) {
      return NextResponse.json(
        { message: 'Please provide filename' },
        { status: 400 }
      );
    }
    await deleteFile(filename);
    return NextResponse.json({ message: 'File deleted successfully' });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
});
