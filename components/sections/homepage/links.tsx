'use client';
import { Link as LinkType } from '@/lib/interface';
import {
  addToast,
  Button,
  Card,
  CardBody,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Image,
  Pagination,
  Tooltip
} from '@heroui/react';
import axios from 'axios';
import { encode } from 'qss';
import { useCallback, useEffect, useMemo, useState } from 'react';
import useDebounce from '@/hooks/useDebounce';
import Skeleton from '@/components/ui/skeleton';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { useQueryState } from 'nuqs';
import { useForm } from './context';
import { useSession } from 'next-auth/react';

const getAllLinks = async (params: {
  limit?: number;
  page?: number;
  sortColumn?: string;
  sortDirection?: string;
  query?: string;
  category?: string;
}): Promise<{
  links: LinkType[];
  total: number;
  totalPages: number;
}> => {
  const res = await axios.get(`/api/link`, {
    params: { ...params }
  });
  return res.data;
};

type LinksResponse = {
  links: LinkType[];
  total: number;
  totalPages: number;
};

export default function Links() {
  const { formik } = useForm();

  const [searchQuery] = useQueryState('query');
  const [category] = useQueryState('category');
  const query = useDebounce(searchQuery || '', 1000);

  // Reset page when query or category changes
  useEffect(() => {
    formik.setFieldValue('page', 1);
  }, [query, category]);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [
      'links',
      formik.values.page,
      formik.values.limit,
      query,
      category,
      formik.values.sort.column,
      formik.values.sort.direction
    ],
    queryFn: async () =>
      await getAllLinks({
        limit: formik.values.limit,
        page: formik.values.page,
        sortColumn: formik.values.sort.column as string,
        sortDirection: formik.values.sort.direction,
        query: query || '',
        category: category || ''
      })
  });

  useEffect(() => {
    if (data) {
      formik.setFieldValue('pages', data?.totalPages);
    }
  }, [data]);

  const links = data?.links || [];

  if (error) {
    return (
      <div className="flex flex-col items-center gap-4 p-8">
        <Icon icon="tabler:alert-circle" className="h-12 w-12 text-danger" />
        <h2 className="text-xl font-bold text-danger">Error Loading Links</h2>
        <p className="text-center text-default-500">{error.message}</p>
        <Button color="primary" onPress={() => refetch()}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div
      id="links"
      className="relative flex flex-col items-center gap-2 px-4 md:px-8"
    >
      {isLoading ? (
        <LoadingSkeleton />
      ) : (
        <>
          <div className="mt-4 flex w-full items-start gap-2">
            <p className="text-default-500">
              Showing {formik.values.limit * (formik.values.page - 1) + 1}-
              {formik.values.limit * formik.values.page > (data?.total || 0)
                ? data?.total
                : formik.values.limit * formik.values.page}{' '}
              items out of {data?.total}
            </p>
          </div>
          <div className="grid w-full gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {links.map((link) => (
              <PressableCard key={link._id} link={link} refetch={refetch} />
            ))}
          </div>

          {links.length === 0 ? (
            <div className="flex flex-col items-center gap-4">
              <Icon icon="tabler:search-off" className="h-12 w-12" />
              <h1 className="text-2xl font-bold">No References found!</h1>
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

const PressableCard = React.memo(
  ({ link, refetch }: { link: LinkType; refetch: () => void }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [showMicrolinkImage, setShowMicrolinkImage] = useState(false);
    const [originalImageFailed, setOriginalImageFailed] = useState(false);
    const { data: session } = useSession();

    const src = useMemo(() => {
      if (!showMicrolinkImage || !originalImageFailed) return '';
      return `https://api.microlink.io/?${encode({
        url: link.url,
        screenshot: true,
        meta: false,
        embed: 'screenshot.url',
        colorScheme: 'dark',
        'viewport.isMobile': true,
        'viewport.deviceScaleFactor': 1,
        'viewport.width': 1236,
        'viewport.height': 800
      })}`;
    }, [link.url, showMicrolinkImage, originalImageFailed]);

    // Load microlink image only when component is visible and original image fails
    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && originalImageFailed) {
            setShowMicrolinkImage(true);
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );

      const element = document.getElementById(`card-${link._id}`);
      if (element) {
        observer.observe(element);
      }

      return () => observer.disconnect();
    }, [link._id, originalImageFailed]);

    const handleImageError = () => {
      setOriginalImageFailed(true);
      setIsLoading(false);
    };

    const isAdmin =
      session?.user?.role === 'admin' || session?.user?.email === link.addedBy;

    const onPress = useCallback(async () => {
      try {
        // Increment view count
        await axios.patch(`/api/link/${link._id}`, {
          action: 'increment-views'
        });
      } catch (error) {
        // Silently fail if view count update fails - don't prevent user from opening link
        console.error('Failed to increment view count:', error);
      }

      // Open the link
      window.open(link.url, '_blank');
    }, [link.url, link._id]);

    const onContextMenu = useCallback(
      (e: React.MouseEvent) => {
        if (session?.user?.role === 'admin') {
          e.preventDefault();
          window.open(`/${link._id}/edit`, '_blank');
        }
      },
      [session, link._id]
    );

    const onDelete = async () => {
      try {
        await axios.delete(`/api/link/${link._id}`);
        addToast({
          title: 'Successfully deleted',
          description: 'Link has been deleted',
          color: 'success'
        });
        refetch();
      } catch (error: any) {
        addToast({
          title: 'Error deleting link',
          description: error.response.data.message,
          color: 'danger'
        });
      }
    };

    const renderChip = () => {
      if (link.isFeatured) {
        return (
          <Chip
            size="sm"
            color="primary"
            className="absolute right-2 top-2 z-50 bg-purple-500/70 font-bold backdrop-blur-sm"
          >
            Featured
          </Chip>
        );
      }
      if (link.isEditorsPick) {
        return (
          <Chip
            size="sm"
            color="primary"
            className="absolute right-2 top-2 z-50 bg-blue-500/70 font-bold backdrop-blur-sm"
          >
            Editor&apos;s Pick
          </Chip>
        );
      }
      if (
        new Date(link.createdAt) >
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      ) {
        return (
          <Chip
            size="sm"
            color="primary"
            className="absolute right-2 top-2 z-50 bg-green-500/70 font-bold backdrop-blur-sm"
          >
            New
          </Chip>
        );
      }
      return null;
    };

    return (
      <Card
        id={`card-${link._id}`}
        isHoverable
        isPressable
        className="relative backdrop-blur-md hover:bg-default-200/30"
        onPress={onPress}
        onContextMenu={onContextMenu}
      >
        {renderChip()}
        <CardBody className="gap-2">
          <div className="relative w-full">
            {link.thumbnail && !originalImageFailed ? (
              <Image
                isBlurred
                isLoading={isLoading}
                src={link.thumbnail}
                onLoad={() => setIsLoading(false)}
                onError={handleImageError}
                loading="lazy"
                alt={link.title}
                className="mb-4 aspect-video w-full bg-default-200 object-cover"
                width={600}
                classNames={{ wrapper: 'aspect-video' }}
              />
            ) : showMicrolinkImage && originalImageFailed ? (
              <Image
                isBlurred
                isLoading={isLoading}
                src={src}
                onLoad={() => setIsLoading(false)}
                loading="lazy"
                alt={link.title}
                className="mb-4 aspect-video w-full bg-default-200 object-cover"
                width={600}
                classNames={{ wrapper: 'aspect-video' }}
              />
            ) : (
              <div className="mb-4 aspect-video w-full animate-pulse bg-default-200" />
            )}
            <div className="absolute left-0 top-0 z-10">
              <Chip variant="flat" size="sm" className="backdrop-blur-sm">
                {link.views || 0} view{link.views > 1 ? 's' : ''}
              </Chip>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-col">
              <h3 className="line-clamp-1" title={link.title}>
                {link.title}
              </h3>
              <Tooltip
                delay={1000}
                className="max-w-xs"
                content={link.description}
              >
                <p className="line-clamp-1 text-tiny text-default-500">
                  {link.description}
                </p>
              </Tooltip>
            </div>
            <Dropdown aria-label="Options" placement="top-end">
              <DropdownTrigger>
                <Button variant="flat" size="sm" isIconOnly>
                  <Icon icon="tabler:dots-vertical" width={16} />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem key="view" onPress={onPress}>
                  View
                </DropdownItem>
                {isAdmin ? (
                  <>
                    <DropdownItem key="edit" href={`/${link._id}/edit`}>
                      Edit
                    </DropdownItem>
                    <DropdownItem
                      key="delete"
                      color="danger"
                      className="text-danger"
                      onPress={onDelete}
                    >
                      Delete
                    </DropdownItem>
                  </>
                ) : null}
              </DropdownMenu>
            </Dropdown>
          </div>
        </CardBody>
      </Card>
    );
  }
);

PressableCard.displayName = 'PressableCard';

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
