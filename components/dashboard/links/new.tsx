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
  Textarea,
  Image,
  addToast,
  Switch
} from '@heroui/react';
import { IconCheck } from '@tabler/icons-react';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import getAllCategories from '@/server-actions/category';
import axios from 'axios';
import slugify from 'slugify';
import * as Yup from 'yup';
import { cn } from '@/lib/utils';

const validationSchema = Yup.object({
  title: Yup.string().required('Title is required'),
  url: Yup.string().required('URL is required'),
  category: Yup.string().required('Category is required')
});

export default function NewLink() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);

  const { data } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getAllCategories()
  });

  const categories = (data as Category[]) || [];

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      url: '',
      category: '',
      thumbnail: '',
      tags: [],
      thumbnailPreview: '',
      isFeatured: false,
      isEditorsPick: false
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        if (file && file.name) {
          if (file.size > 1000000) {
            addToast({
              title: 'File size should not exceed 1MB',
              color: 'danger'
            });
            return;
          }
          const formData = new FormData();
          const filename = `${slugify(values.title, {
            trim: true,
            lower: true
          })}.${file.name.split('.').pop()}`;
          formData.append('file', file);
          formData.append('filename', filename);

          try {
            const uploadResponse = await axios.post('/api/s3-upload', formData);
            values.thumbnail = uploadResponse.data.url;
          } catch (error: any) {
            addToast({
              title: 'Failed to upload image',
              color: 'danger'
            });

            return;
          }
        }

        await axios.post('/api/link', values);
        addToast({
          title: 'Link created successfully',
          color: 'success'
        });
        router.push('/');
      } catch (error: any) {
        console.error('Error saving link:', error);
      }
    }
  });

  const [isGeneratingContent, setIsGeneratingContent] = useState(false);
  const [tagInput, setTagInput] = useState('');

  const generateContent = async () => {
    if (!formik.values.url) {
      addToast({
        title: 'Please provide a URL before generating content',
        color: 'warning'
      });
      return;
    }

    setIsGeneratingContent(true);
    try {
      const response = await fetch('/api/ai/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url: formik.values.url
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate content');
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      if (data.title && data.description && data.tags) {
        formik.setFieldValue('title', data.title);
        formik.setFieldValue('description', data.description);
        formik.setFieldValue('tags', data.tags);
        addToast({
          title: 'Content generated successfully!',
          color: 'success'
        });
      } else {
        throw new Error('Invalid response format - missing required fields');
      }
    } catch (error: any) {
      console.error('Error generating content:', error);
      const errorMessage =
        error.message || 'Failed to generate content. Please try again.';
      addToast({
        title: errorMessage,
        color: 'danger'
      });
    } finally {
      setIsGeneratingContent(false);
    }
  };

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
  }, [formik]);

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
                  e.currentTarget.classList.add('border-primary');
                }}
                onDragLeave={(e) => {
                  e.currentTarget.classList.remove('border-primary');
                }}
                onDrop={handleDrop}
              >
                <Image
                  src={`${formik.values.thumbnailPreview}`}
                  alt={formik.values.title}
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
                className={cn(
                  'group mx-auto mb-4 flex aspect-video w-full max-w-3xl items-center justify-center rounded-large border !border-b border-dashed border-default p-4 pb-4 transition-all hover:border-default-400',
                  {
                    '!border-danger-500': formik.errors.thumbnail,
                    'border-primary': false
                  }
                )}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  e.currentTarget.classList.add('border-primary');
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove('border-primary');
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const droppedFile = e.dataTransfer.files[0];
                  if (droppedFile && droppedFile.type.startsWith('image/')) {
                    setFile(droppedFile);
                    const reader = new FileReader();
                    reader.onload = () => {
                      formik.setFieldValue('thumbnailPreview', reader.result);
                    };
                    reader.readAsDataURL(droppedFile);
                  }
                  e.currentTarget.classList.remove('border-primary');
                }}
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
                  {formik.errors.thumbnail && (
                    <p className="text-xs/5 text-danger-600">
                      {formik.errors.thumbnail}
                    </p>
                  )}
                </div>
              </label>
            )}
            <div className="!border-t-0 px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6">Title</dt>
              <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                <Input
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  name="title"
                  placeholder="Title"
                  isInvalid={
                    formik.touched.title && formik.errors.title ? true : false
                  }
                  errorMessage={formik.errors.title}
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
                <div className="flex gap-2">
                  <Input
                    value={formik.values.url}
                    onChange={formik.handleChange}
                    name="url"
                    placeholder="Enter URL to auto-generate content"
                    isInvalid={
                      formik.touched.url && formik.errors.url ? true : false
                    }
                    errorMessage={formik.errors.url}
                    className="flex-1"
                    description={
                      <p className="text-xs text-default-500">
                        Enter a URL and click &quot;Generate Content&quot; to
                        automatically create title, description, and tags
                      </p>
                    }
                  />
                  <Button
                    variant="light"
                    size="sm"
                    onPress={generateContent}
                    isLoading={isGeneratingContent}
                    isDisabled={!formik.values.url}
                  >
                    {isGeneratingContent ? 'Generating...' : 'Generate Content'}
                  </Button>
                </div>
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
                  isInvalid={
                    formik.touched.category && formik.errors.category
                      ? true
                      : false
                  }
                  errorMessage={formik.errors.category}
                >
                  {categories.map((category) => (
                    <SelectItem key={category.uid}>{category.name}</SelectItem>
                  ))}
                </Select>
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6">Tags</dt>
              <dd className="mt-1 flex flex-col items-start justify-end gap-2 text-sm leading-6 sm:col-span-2 sm:mt-0">
                <div className="flex w-full flex-col gap-2">
                  <Input
                    className="w-full"
                    placeholder="Add a tag and press Enter"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const newTag = tagInput.trim();
                        if (
                          newTag &&
                          !(formik.values.tags as string[]).includes(newTag)
                        ) {
                          formik.setFieldValue('tags', [
                            ...(formik.values.tags as string[]),
                            newTag
                          ]);
                        }
                        setTagInput('');
                      }
                    }}
                    description={
                      formik.values.tags.length > 0 && (
                        <p className="mt-2 text-xs text-default-500">
                          {formik.values.tags.length} tag(s) added
                        </p>
                      )
                    }
                  />
                </div>
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
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6">Featured</dt>
              <dd className="mt-1 space-y-2 text-sm leading-6 sm:col-span-2 sm:mt-0">
                <Switch
                  aria-label="Featured"
                  isSelected={formik.values.isFeatured}
                  onChange={formik.handleChange}
                  name="isFeatured"
                />
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6">
                Editor&apos;s Pick
              </dt>
              <dd className="mt-1 space-y-2 text-sm leading-6 sm:col-span-2 sm:mt-0">
                <Switch
                  aria-label="Editor's Pick"
                  isSelected={formik.values.isEditorsPick}
                  onChange={formik.handleChange}
                  name="isEditorsPick"
                />
              </dd>
            </div>
          </CardBody>
          <Divider />

          <CardFooter className="justify-end">
            <Button
              radius="full"
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
