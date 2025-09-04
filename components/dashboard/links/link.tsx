import React from 'react';
import { Link as ILink } from '@/lib/interface';
import { humanReadableDate, humanReadableTime } from '@/functions/utility';
import {
  Button,
  Divider,
  Link as NextLink,
  Card,
  Chip,
  CardHeader,
  CardBody,
  Avatar
} from '@heroui/react';
import { IconPencil } from '@tabler/icons-react';
import { Icon } from '@iconify/react/dist/iconify.js';
import Link from 'next/link';
import axios from 'axios';

interface Props {
  link: ILink;
}

export default function ViewLink({ link }: Props) {
  return (
    <>
      <div>
        <Card className="mt-6 bg-transparent p-4 shadow-none">
          <CardHeader className="justify-between">
            <Avatar
              size="lg"
              src={`https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${link.url}&size=64`}
            />
            <Button
              radius="full"
              variant="bordered"
              startContent={<IconPencil size={18} />}
              className="hover:border-primary hover:bg-primary"
              as={Link}
              href={`/${link._id}/edit`}
            >
              Edit
            </Button>
          </CardHeader>
          <CardBody className="divide-y divide-default">
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6">Title</dt>
              <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                {link.title}
              </dd>
            </div>

            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6">Description</dt>
              <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                {link.description}
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6">URL</dt>
              <dd className="mt-1 space-y-2 text-sm leading-6 sm:col-span-2 sm:mt-0">
                <NextLink
                  href={link.url}
                  className="hover:underline"
                  target="_blank"
                  rel="noreferrer"
                  onClick={async () => {
                    try {
                      // Increment view count
                      await axios.patch(`/api/link/${link._id}`, {
                        action: 'increment-views'
                      });
                    } catch (error) {
                      // Silently fail if view count update fails - don't prevent user from opening link
                      console.error('Failed to increment view count:', error);
                    }
                  }}
                >
                  {link.url}
                </NextLink>
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6">Category</dt>
              <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                {link.category}
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6">Tags</dt>
              <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                {link?.tags?.map((tag, index) => (
                  <Chip key={index} className="mr-2">
                    {tag}
                  </Chip>
                ))}
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6">Views</dt>
              <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                <div className="flex items-center gap-2">
                  <Icon icon="tabler:eye" width={16} />
                  <span>{link.views || 0} views</span>
                </div>
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
        </Card>
      </div>
    </>
  );
}
