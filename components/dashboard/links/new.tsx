'use client';
import { categories } from '@/lib/config';
import { Category } from '@/lib/interface';
import { Icon } from '@iconify/react/dist/iconify.js';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Chip,
  Divider,
  Input,
  Select,
  SelectItem,
  Textarea
} from '@nextui-org/react';
import { IconCheck } from '@tabler/icons-react';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import React from 'react';
import { toast } from 'sonner';

interface Props {
  categories: Category[];
}

export default function New({ categories }: Props) {
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      url: '',
      category: '',
      tags: []
    },
    onSubmit: async (values) => {
      try {
        await fetch('/api/link', {
          method: 'POST',
          body: JSON.stringify(values)
        }).then(() => {
          toast.success('Link added successfully');
        });
        router.push('/');
      } catch (error) {
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
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  name="title"
                  placeholder="Title"
                />
              </dd>
            </div>

            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6">Description</dt>
              <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                <Textarea
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  name="description"
                  placeholder="Description"
                />
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6">URL</dt>
              <dd className="mt-1 space-y-2 text-sm leading-6 sm:col-span-2 sm:mt-0">
                <Input
                  value={formik.values.url}
                  onChange={formik.handleChange}
                  name="url"
                  placeholder="URL"
                />
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6">Category</dt>
              <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                <Select
                  value={formik.values.category}
                  onChange={formik.handleChange}
                  name="category"
                  placeholder="Category"
                  selectedKeys={[formik.values.category]}
                  aria-label="Category"
                >
                  {categories.map((category) => (
                    <SelectItem key={category.name}>{category.name}</SelectItem>
                  ))}
                </Select>
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6">Tags</dt>
              <dd className="mt-1 flex flex-col-reverse items-start justify-end gap-2 text-sm leading-6 sm:col-span-2 sm:mt-0">
                <div className="flex flex-wrap gap-1">
                  {formik?.values?.tags.map(
                    (tag, index) =>
                      tag && (
                        <>
                          <Chip
                            endContent={
                              <Icon
                                icon="solar:close-circle-bold-duotone"
                                fontSize={18}
                              />
                            }
                            key={index}
                            className="cursor-pointer hover:bg-danger-300"
                            onClick={() => {
                              formik.setFieldValue(
                                'tags',
                                formik.values.tags.filter(
                                  (item) => item !== tag
                                )
                              );
                            }}
                          >
                            {tag}
                          </Chip>
                        </>
                      )
                  )}
                </div>
                <Textarea
                  value={formik.values.tags as any}
                  onChange={(e) => {
                    formik.setFieldValue('tags', e.target.value.split(','));
                  }}
                  placeholder="Add Tags"
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
