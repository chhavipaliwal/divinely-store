'use client';
import React from 'react';
import { Category, Link as ILink } from '@/lib/interface';
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

interface Props {
  link: ILink;
  categories: Category[];
}

export default function EditLink({ link, categories }: Props) {
  const formik = useFormik({
    initialValues: {
      link
    },
    onSubmit: async (values) => {
      try {
        await fetch(`/api/link/${link._id}`, {
          method: 'PUT',
          body: JSON.stringify(values.link)
        }).then(() => {
          toast.success('Link updated successfully');
        });
      } catch (error) {
        toast.error('Failed to update link');
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
                  value={formik.values.link.title}
                  onChange={formik.handleChange}
                  name="link.title"
                  placeholder="Title"
                />
              </dd>
            </div>

            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6">Description</dt>
              <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                <Textarea
                  value={formik.values.link.description}
                  onChange={formik.handleChange}
                  name="link.description"
                  placeholder="Description"
                />
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6">URL</dt>
              <dd className="mt-1 space-y-2 text-sm leading-6 sm:col-span-2 sm:mt-0">
                <Input
                  value={formik.values.link.url}
                  onChange={formik.handleChange}
                  name="link.url"
                  placeholder="URL"
                />
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6">Category</dt>
              <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                <Select
                  value={formik.values.link.category}
                  onChange={formik.handleChange}
                  name="link.category"
                  placeholder="Category"
                  selectedKeys={[formik.values.link.category]}
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
                  {formik.values?.link?.tags.map(
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
                                'link.tags',
                                formik.values.link.tags.filter(
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
                  value={formik.values.link.tags as any}
                  onChange={(e) => {
                    formik.setFieldValue(
                      'link.tags',
                      e.target.value.split(',')
                    );
                  }}
                  placeholder="Add Tags"
                />
              </dd>
            </div>
          </CardBody>
          <Divider />

          <dl>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6">Modified By</dt>
              <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                {link.modifiedBy} on{' '}
                {humanReadableDate(link.updatedAt) +
                  ' at ' +
                  humanReadableTime(link.updatedAt)}
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6">Added By</dt>
              <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                {link.addedBy} on{' '}
                {humanReadableDate(link.createdAt) +
                  ' at ' +
                  humanReadableTime(link.createdAt)}
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
