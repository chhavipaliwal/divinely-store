'use client';

import { uploadObject } from '@/server-actions/r2-object';
import { Button } from '@nextui-org/react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function Page() {
  const [file, setFile] = useState<File | null | undefined>(null);

  const handleUpload = async () => {
    if (!file) return;
    await uploadObject(file)
      .then((res) => {
        console.log(res);
        toast.success('Uploaded successfully');
      })
      .catch((err) => {
        console.error(err);
        toast.error('Failed to upload');
      });
  };

  return (
    <>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0])}
        accept="image/*"
        name="file"
      />
      <Button color="primary" onClick={handleUpload}>
        Upload
      </Button>
    </>
  );
}
