'use client';

import { Button } from '@nextui-org/react';
import axios from 'axios';
import { useState } from 'react';
import { toast } from 'sonner';

export default function Page() {
  const [file, setFile] = useState<File | null | undefined>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', file as File);
    formData.append('filename', 'test.png');

    await axios
      .post(`/api/s3-upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then((res) => {
        console.log(res.data);
        toast.success(res.data.message);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      })
      .finally(() => {
        setIsLoading(false);
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
      <Button isLoading={isLoading} color="primary" onClick={handleSubmit}>
        Upload
      </Button>
    </>
  );
}
