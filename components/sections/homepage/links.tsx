'use client';
import { Link } from '@/lib/interface';
import { getAllLinks } from '@/server-actions/links';
import { Card, CardBody, Image } from '@nextui-org/react';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import { parseAsBoolean, useQueryState } from 'nuqs';
import { encode } from 'qss';
import { useEffect, useState } from 'react';
import useDebounce from '@/hooks/useDebounce';

export default function Links() {
  const [links, setLinks] = useState<Link[]>([]);
  const [category, setCategory] = useQueryState('category');
  const [globalSearch, setGlobalSearch] = useQueryState(
    'global',
    parseAsBoolean.withDefault(false)
  );
  const [query] = useQueryState('query');
  const debouncedSearchTerm = useDebounce(query, 500);

  useEffect(() => {
    if (globalSearch) {
      setCategory(null);
    }
  }, [debouncedSearchTerm]);

  useEffect(() => {
    const getData = async () => {
      await axios
        .get('/api/link', {
          params: {
            category: category,
            limit: 5,
            page: 1,
            search: query
          }
        })
        .then((res) => {
          setLinks(res.data.links);
        });
    };
    getData();
  }, [category, debouncedSearchTerm]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        transition={{ type: 'spring', delay: 0.2, exit: { delay: 0 } }}
        // className="mt-12 grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4"
        className="mt-12 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      >
        {links.map((link) => (
          <PressableCard key={link._id} link={link} />
        ))}
      </motion.div>
    </AnimatePresence>
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
        isPressable
        className="backdrop-blur-md hover:bg-default-200/30"
        onPress={() => {
          window.open(link.url, '_blank');
        }}
      >
        <CardBody className="gap-2">
          <div className="w-full">
            <Image
              isBlurred
              isLoading={isLoading}
              src={
                isError
                  ? 'https://heroui.com/images/hero-card-complete.jpeg'
                  : src
              }
              onLoad={() => {
                setIsLoading(false);
              }}
              onError={() => {
                setIsError(true);
              }}
              alt={link.title}
              className="object-over mb-4 aspect-video w-full bg-default-200"
              width={600}
              classNames={{
                wrapper: 'aspect-video'
              }}
            />
          </div>
          <div className="flex flex-col">
            <h3>{link.title}</h3>
            <p className="line-clamp-1">{link.description}</p>
          </div>
        </CardBody>
      </Card>
    </>
  );
}
