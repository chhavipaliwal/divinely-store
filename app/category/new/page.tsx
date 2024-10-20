'use client';
import React from 'react';
import {
  Button,
  Divider,
  Input,
  Card,
  CardBody,
  CardFooter
} from '@nextui-org/react';
import { IconCheck } from '@tabler/icons-react';
import { useFormik } from 'formik';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function EditCategory() {
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      name: ''
    },
    onSubmit: async (values) => {
      try {
        await fetch(`/api/category`, {
          method: 'POST',
          body: JSON.stringify(values)
        }).then(() => {
          toast.success('Category added successfully');
          router.push('/category');
        });
      } catch (error) {
        toast.error('Failed to add category');
        console.error(error);
      }
    }
  });
  return (
    <>
      <div>
        <Card
          className="mt-6 p-4"
          as={'form'}
          onSubmit={(e) => {
            e.preventDefault();
            formik.handleSubmit();
          }}
        >
          <CardBody className="divide-y divide-default">
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6">Title</dt>
              <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                <Input
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  name="name"
                  placeholder="Name"
                />
              </dd>
            </div>
          </CardBody>
          <Divider />

          <CardFooter className="justify-end">
            <Button
              radius="full"
              variant="flat"
              startContent={<IconCheck size={18} />}
              type="submit"
              color="primary"
              isLoading={formik.isSubmitting}
            >
              Save
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
