'use client';
import { Link } from '@/lib/interface';
import {
  Avatar,
  Button,
  Card,
  CardBody,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Image,
  Pagination,
  ScrollShadow
} from '@nextui-org/react';
import axios from 'axios';
import { parseAsInteger, useQueryState, useQueryStates } from 'nuqs';
import { encode } from 'qss';
import { useEffect, useMemo, useState } from 'react';
import useDebounce from '@/hooks/useDebounce';
import { useSettings } from '@/hooks/useSettings';
import Skeleton from '@/components/ui/skeleton';
import { Icon } from '@iconify/react/dist/iconify.js';

export default function Links({ session }: { session?: any }) {
  const [links, setLinks] = useState<Link[]>([]);
  const [category, setCategory] = useQueryState('category');
  const [categoryHistory] = useState(category);
  const [pages, setPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const [query] = useQueryState('query');
  const debouncedSearchTerm = useDebounce(query, 500);
  const { settings, dispatch } = useSettings();
  const [params, setParams] = useQueryStates({
    limit: parseAsInteger.withDefault(settings.limit || 12),
    page: parseAsInteger.withDefault(1)
  });

  useEffect(() => {
    if (settings.globalSearch && debouncedSearchTerm) {
      setCategory(null);
    } else {
      setCategory(categoryHistory);
    }
  }, [debouncedSearchTerm]);

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      await axios
        .get('/api/link', {
          params: {
            ...params,
            category,
            search: debouncedSearchTerm
          }
        })
        .then((res) => {
          setLinks(res.data.links);
          setPages(res.data.pagination.totalPages);
          if (res.data.pagination.totalPages < params.page) {
            setParams({ page: res.data.pagination.totalPages });
          }
          setIsLoading(false);
          //   scroll to to links
          if (params.page > 1) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        });
    };
    getData();
  }, [category, debouncedSearchTerm, params]);

  const sortedLinks = useMemo(() => {
    return links.sort((a, b) => {
      if (settings.sortType === 'name') {
        return a.title.localeCompare(b.title);
      } else if (settings.sortType === 'date') {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      } else {
        return 0;
      }
    });
  }, [links, settings.sortType]);

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
            {sortedLinks.map((link) => (
              <PressableCard key={link._id} link={link} />
            ))}
          </div>

          {sortedLinks.length === 0 ? (
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
                page={params.page}
                total={pages}
                onChange={(page) => {
                  setParams({ page });
                }}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

function PressableCard({ link }: { link: Link }) {
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
          <div className="flex items-center gap-2">
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
