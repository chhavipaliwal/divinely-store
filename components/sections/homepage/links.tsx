'use client';
import { Link } from '@/lib/interface';
import {
  addToast,
  Button,
  Card,
  CardBody,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Image,
  Pagination,
  SortDescriptor
} from '@heroui/react';
import axios from 'axios';
import { encode } from 'qss';
import { useEffect, useState } from 'react';
import useDebounce from '@/hooks/useDebounce';
import Skeleton from '@/components/ui/skeleton';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { useQueryState } from 'nuqs';
import { useForm } from './context';
import { saveTableConfig } from '@/lib/localstorage-util';

const getAllLinks = async (params: {
  limit?: number;
  page?: number;
  sortColumn?: string;
  sortDirection?: string;
  query?: string;
  category?: string;
}): Promise<{
  links: Link[];
  total: number;
  totalPages: number;
}> => {
  const res = await axios.get(`/api/link`, {
    params: { ...params }
  });
  return res.data;
};

export default function Links() {
  const { formik } = useForm();

  const [searchQuery] = useQueryState('query');
  const [category, setCategory] = useQueryState('category');
  const query = useDebounce(searchQuery || '', 1000);

  const { data, isLoading, refetch } = useQuery({
    queryKey: [
      'links',
      formik.values.page,
      formik.values.limit,
      query,
      category,
      formik.values.sortDescriptor.column,
      formik.values.sortDescriptor.direction
    ],
    queryFn: () =>
      getAllLinks({
        limit: formik.values.limit,
        page: formik.values.page,
        sortColumn: formik.values.sortDescriptor.column as string,
        sortDirection: formik.values.sortDescriptor.direction,
        query: query || '',
        category: category || ''
      })
  });

  useEffect(() => {
    if (data) {
      formik.setFieldValue('pages', data?.totalPages);
    }
  }, [data]);

  useEffect(() => {
    formik.setFieldValue('page', 1);
    setCategory(null);
  }, [query]);

  const links = data?.links || [];

  useEffect(() => {
    saveTableConfig('links-homepage', formik.values);
  }, [formik.values]);

  return (
    <div
      id="links"
      className="relative flex flex-col items-center gap-12 px-4 md:px-8"
    >
      {isLoading ? (
        <LoadingSkeleton />
      ) : (
        <>
          <div className="mt-12 grid w-full gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {links.map((link) => (
              <PressableCard key={link._id} link={link} refetch={refetch} />
            ))}
          </div>

          {links.length === 0 ? (
            <div className="flex flex-col items-center gap-4">
              <h1 className="text-2xl font-bold">No Refrences found!!!</h1>
              <p className="text-default-500">
                Try changing the search query or category
              </p>
            </div>
          ) : (
            <div className="flex justify-between">
              <Pagination
                isCompact
                showControls
                showShadow
                color="primary"
                page={formik.values.page}
                total={formik.values.pages}
                onChange={(page) => {
                  formik.setFieldValue('page', page);
                }}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

function PressableCard({ link, refetch }: { link: Link; refetch: () => void }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const params = encode({
    url: link.url,
    screenshot: true,
    meta: false,
    embed: 'screenshot.url',
    colorScheme: 'dark',
    'viewport.isMobile': true,
    'viewport.deviceScaleFactor': 1,
    'viewport.width': 1236,
    'viewport.height': 800
  });
  const src = `https://api.microlink.io/?${params}`;

  return (
    <>
      <Card
        isHoverable
        isPressable
        className="backdrop-blur-md hover:bg-default-200/30"
        onPress={() => {
          window.open(link.url, '_blank');
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          window.open(`/${link._id}/edit`, '_blank');
        }}
      >
        <CardBody className="gap-2">
          <div className="w-full">
            <Image
              isBlurred
              isLoading={isLoading}
              src={
                link.thumbnail
                  ? link.thumbnail
                  : isError
                    ? 'https://heroui.com/images/hero-card-complete.jpeg'
                    : ''
              }
              onLoad={() => {
                setIsLoading(false);
              }}
              onError={() => {
                setIsError(true);
              }}
              loading="lazy"
              alt={link.title}
              className="mb-4 aspect-video w-full bg-default-200 object-cover"
              width={600}
              classNames={{
                wrapper: 'aspect-video'
              }}
            />
          </div>
          <div className="flex items-center justify-between gap-2">
            {/* <div>
              <Avatar
                src={`https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${link.url}&size=64`}
              />
            </div> */}
            <div className="flex flex-col">
              <h3>{link.title}</h3>
              <p className="line-clamp-1" title={link.description}>
                {link.description}
              </p>
            </div>
            <div>
              <Dropdown aria-label="Options" placement="top-end">
                <DropdownTrigger>
                  <Button variant="flat" size="sm" isIconOnly>
                    <Icon icon="tabler:dots-vertical" width={16} />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu>
                  <DropdownItem key="view" target="_BLANK" href={link.url}>
                    View
                  </DropdownItem>
                  <DropdownItem key="edit" href={`/${link._id}/edit`}>
                    Edit
                  </DropdownItem>
                  <DropdownItem
                    key="delete"
                    className="text-danger"
                    color="danger"
                    onPress={async () => {
                      await axios
                        .delete(`/api/link/${link._id}`)
                        .then(() => {
                          addToast({
                            title: 'Successfully deleted',
                            description: 'Link has been deleted',
                            color: 'success'
                          });
                          refetch();
                        })
                        .catch((error) => {
                          addToast({
                            title: 'Error deleting link',
                            description: error.response.data.message,
                            color: 'danger'
                          });
                        });
                    }}
                  >
                    Delete
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>
        </CardBody>
      </Card>
    </>
  );
}

function LoadingSkeleton() {
  return (
    <>
      <div className="mt-12 grid w-full gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 12 }).map((_, index) => (
          <Card
            key={index}
            className="bg- space-y-5 bg-background/30 p-4 backdrop-blur-md"
            radius="lg"
          >
            <Skeleton className="rounded-lg">
              <div className="aspect-video w-full rounded-lg bg-default-300" />
            </Skeleton>
            <div className="space-y-3">
              <Skeleton className="w-3/5 rounded-lg">
                <div className="h-3 w-3/5 rounded-lg bg-default-200" />
              </Skeleton>
              <Skeleton className="w-4/5 rounded-lg">
                <div className="h-3 w-4/5 rounded-lg bg-default-200" />
              </Skeleton>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
