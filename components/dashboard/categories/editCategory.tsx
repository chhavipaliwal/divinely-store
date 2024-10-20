'use client';
import React from 'react';
import { Category as ICategory } from '@/lib/interface';
import { humanReadableDate, humanReadableTime } from '@/functions/utility';
import {
  Button,
  Textarea,
  Select,
  SelectItem,
  Divider,
  Input,
  Card,
  Chip,
  CardBody,
  CardFooter
} from '@nextui-org/react';
import { IconCheck } from '@tabler/icons-react';
import { useFormik } from 'formik';
import { Icon } from '@iconify/react/dist/iconify.js';
import { toast } from 'sonner';
import { categories } from '@/lib/config';

interface Props {
  category: ICategory;
}

export default function EditCategory({ category }: Props) {
  const formik = useFormik({
    initialValues: {
      category
    },
    onSubmit: async (values) => {
      try {
        await fetch(`/api/category/${category.uid}`, {
          method: 'PUT',
          body: JSON.stringify(values.category)
        }).then(() => {
          toast.success('Category updated successfully');
        });
      } catch (error) {
        toast.error('Failed to update category');
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
                  value={formik.values.category.name}
                  onChange={formik.handleChange}
                  name="category.name"
                  placeholder="Name"
                />
              </dd>
            </div>
          </CardBody>
          <Divider />

          <dl>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6">Modified By</dt>
              <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                {category.modifiedBy} on{' '}
                {humanReadableDate(category.updatedAt) +
                  ' at ' +
                  humanReadableTime(category.updatedAt)}
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6">Added By</dt>
              <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                {category.addedBy} on{' '}
                {humanReadableDate(category.createdAt) +
                  ' at ' +
                  humanReadableTime(category.createdAt)}
              </dd>
            </div>
          </dl>
          <CardFooter className="justify-end">
            <Button
              radius="full"
              variant="flat"
              startContent={<IconCheck size={18} />}
              type="submit"
              color="primary"
              isLoading={formik.isSubmitting}
            >
              Update
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
