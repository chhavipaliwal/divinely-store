'use client';
import React, { useEffect, useState } from 'react';
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
  CardFooter,
  Image,
  Spinner,
  addToast
} from '@heroui/react';
import { IconCheck } from '@tabler/icons-react';
import { useFormik } from 'formik';
import { Icon } from '@iconify/react/dist/iconify.js';
import { toast } from 'sonner';
import axios from 'axios';
import slugify from 'slugify';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import getAllCategories from '@/server-actions/category';
import { useRouter } from 'next/navigation';
import * as Yup from 'yup';
interface Props {
  link: ILink;
}

export default function EditLink({ link }: Props) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);

  const { data } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getAllCategories()
  });

  const categories = (data as Category[]) || [];

  const formik = useFormik({
    initialValues: {
      link,
      thumbnailPreview: link.thumbnail
    },
    onSubmit: async (values) => {
      if (file && file.name) {
        if (file.size > 1000000) {
          addToast({
            title: 'File size should not exceed 1MB',
            color: 'danger'
          });
          return;
        }
        const formData = new FormData();
        const filename = `${slugify(link.title, {
          trim: true,
          lower: true
        })}.${file.name.split('.').pop()}`;
        console.log(filename);
        formData.append('file', file);
        formData.append('filename', filename);
        await axios
          .post(`/api/s3-upload`, formData)
          .then((res) => {
            values.link.thumbnail = res.data.url;
          })
          .catch((error) => {
            addToast({
              title: error.response.data.message,
              color: 'danger'
            });
          });
      } else {
        console.log('No file');
      }
      await axios
        .put(`/api/link/${link._id}`, values.link)
        .then(() => {
          addToast({
            title: 'Link updated successfully',
            color: 'success'
          });
          router.push(`/`);
        })
        .catch((error) => {
          console.log(error);
          addToast({
            title: error.response.data.message,
            color: 'danger'
          });
        });
    }
  });

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        formik.setFieldValue('thumbnailPreview', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault(); // Prevent default to allow drop
    setFile(e.dataTransfer.files[0]);
    const reader = new FileReader();
    reader.onload = () => {
      formik.setFieldValue('thumbnailPreview', reader.result);
    };
    reader.readAsDataURL(e.dataTransfer.files[0]);
    e.currentTarget.classList.remove('border-primary'); // Remove highlight
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey && e.key === 's') {
        e.preventDefault();
        if (formik.isSubmitting) return;
        formik.handleSubmit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <>
      <div className="relative">
        <Card
          className="mt-6 bg-transparent p-4 shadow-none"
          as={'form'}
          onSubmit={(e) => {
            e.preventDefault();
            formik.handleSubmit();
          }}
        >
          <CardBody className="divide-y divide-default">
            <input
              type="file"
              id="thumbnail"
              className="sr-only"
              onChange={(e) => {
                handleFileInput(e);
              }}
              accept="image/*"
            />
            {formik.values.thumbnailPreview ? (
              <label
                htmlFor="thumbnail"
                className="relative mx-auto flex min-w-80 max-w-xl items-center justify-center overflow-hidden rounded-3xl"
                onDragOver={(e) => {
                  e.preventDefault(); // Prevent default to allow drop
                }}
                onDrop={handleDrop}
              >
                <Image
                  src={`${formik.values.thumbnailPreview}`}
                  alt={link.title}
                  width="100%"
                  className="aspect-video w-full object-cover"
                />
                <div className="absolute left-0 z-10 flex h-full w-full items-center justify-center opacity-0 backdrop-blur-sm transition-all hover:opacity-100">
                  <Icon icon="solar:pen-bold" width="48" />
                </div>
              </label>
            ) : (
              <label
                htmlFor="thumbnail"
                className="group mx-auto mb-4 flex aspect-video w-full max-w-3xl items-center justify-center rounded-large border !border-b border-dashed border-default p-4 pb-4 transition-all hover:border-default-400"
                onDragOver={(e) => {
                  e.preventDefault(); // Prevent default to allow drop
                  e.currentTarget.classList.add('border-primary'); // Optional: Highlight border on drag
                }}
                onDragEnter={(e) => {
                  e.currentTarget.classList.add('border-primary'); // Highlight border
                }}
                onDragLeave={(e) => {
                  e.currentTarget.classList.remove('border-primary'); // Remove highlight
                }}
                onDrop={handleDrop}
              >
                <div className="flex flex-col items-center">
                  <Icon icon="uim:image-v" width="48" />
                  <div className="mt-4 flex text-sm/6 text-default-600">
                    <div className="relative cursor-pointer rounded-md font-semibold text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 hover:text-primary">
                      <span>Upload a file</span>
                    </div>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs/5 text-default-600">
                    PNG, JPG, GIF up to 5MB
                  </p>
                </div>
              </label>
            )}
            <div className="!border-t-0 px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6">Title</dt>
              <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                <Input
                  value={formik.values.link.title}
                  onChange={formik.handleChange}
                  name="link.title"
                  placeholder="Title"
                  isInvalid={
                    formik.touched.link?.title && formik.errors.link?.title
                      ? true
                      : false
                  }
                  errorMessage={formik.errors.link?.title}
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
                  isInvalid={
                    formik.touched.link?.url && formik.errors.link?.url
                      ? true
                      : false
                  }
                  errorMessage={formik.errors.link?.url}
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
                  isInvalid={
                    formik.touched.link?.category &&
                    formik.errors.link?.category
                      ? true
                      : false
                  }
                  errorMessage={formik.errors.link?.category}
                >
                  {categories.map((category) => (
                    <SelectItem key={category.uid}>{category.name}</SelectItem>
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
                        <React.Fragment key={index}>
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
                        </React.Fragment>
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
          <CardFooter className="justify-end gap-2">
            <Button
              as={Link}
              href={`/${link._id}`}
              radius="full"
              variant="bordered"
            >
              Cancel
            </Button>
            <Button
              radius="full"
              startContent={<IconCheck size={18} />}
              type="submit"
              color="primary"
              isLoading={formik.isSubmitting}
            >
              Update
            </Button>
          </CardFooter>
        </Card>
        {formik.isSubmitting && (
          <div className="fixed left-0 top-0 z-20 flex h-full w-full flex-col items-center justify-center gap-2 backdrop-blur-sm">
            <Spinner />
            <h3>Saving...</h3>
          </div>
        )}
      </div>
    </>
  );
}
