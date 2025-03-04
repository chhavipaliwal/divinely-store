'use client';
import { Category } from '@/lib/interface';
import { cn } from '@/lib/utils';
import getAllCategories from '@/server-actions/category';
import { Icon } from '@iconify/react/dist/iconify.js';
import {
  Button,
  Chip,
  Input,
  ScrollShadow,
  useDisclosure
} from "@heroui/react";
import { useQueryState } from 'nuqs';
import { useEffect, useState } from 'react';
import Links from './links';
import { useSettings } from '@/hooks/useSettings';
import Skeleton from '@/components/ui/skeleton';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import Settings from './settings';

export default function CategoryBody({ session }: { session?: any }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const settingModal = useDisclosure();
  const [selected, setSelected] = useQueryState('category');
  const [query, setQuery] = useQueryState('query');
  const { settings, dispatch } = useSettings();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      const data = await getAllCategories();
      setCategories(data);
      setIsLoading(false);
    };
    getData();
  }, []);

  return (
    <>
      <div id="category-body" className="min-h-[90vh]">
        <div className="sticky top-0 z-20 flex flex-col gap-2 bg-background/70 px-4 py-2 backdrop-blur-lg md:flex-row md:items-center md:gap-4 md:px-8 md:py-4">
          <div className="flex gap-2">
            <Input
              className="min-w-72 backdrop-blur-sm"
              placeholder="Search the realm..."
              value={(query as string) || ''}
              onChange={(e) => {
                if (e.target.value === '') {
                  setQuery(null);
                } else {
                  setQuery(e.target.value);
                }
              }}
              classNames={{
                mainWrapper: 'backdrop-blur-lg bg-transparent',
                inputWrapper: 'backdrop-blur-lg bg-transparent'
              }}
              variant="bordered"
            />
            <Button isIconOnly variant="bordered" onPress={settingModal.onOpen}>
              <Icon icon="mingcute:settings-7-line" width={20} />
            </Button>
          </div>
          {isLoading ? (
            <LoadingSkeleton />
          ) : (
            <ScrollShadow
              orientation="horizontal"
              className="no-scrollbar flex gap-2 p-2"
            >
              <Chip
                as={Link}
                className={cn('rounded-xl p-2 py-4 backdrop-blur-lg', {
                  'py-[18px]': !selected
                })}
                variant={selected ? 'bordered' : 'flat'}
                color={selected ? 'default' : 'primary'}
                href={'/'}
              >
                <div className="flex items-center gap-4">
                  <div>
                    <Icon icon="mingcute:home-4-fill" width={24} />
                  </div>
                  <div>
                    <h3 className="whitespace-nowrap">Home</h3>
                  </div>
                </div>
              </Chip>
              {categories.map((category: Category) => (
                <PressableCard
                  selected={selected}
                  setSelected={setSelected}
                  key={category._id}
                  category={category}
                />
              ))}
            </ScrollShadow>
          )}
        </div>
        <Links session={session} />
      </div>
      <Settings
        isOpen={settingModal.isOpen}
        onOpenChange={settingModal.onOpenChange}
        session={session}
      />
    </>
  );
}

function PressableCard({
  category,
  selected,
  setSelected
}: {
  category: Category;
  selected: string | null;
  setSelected: (value: string | null) => void;
}) {
  const [_query, setQuery] = useQueryState('query');

  return (
    <>
      <Chip
        as={Button}
        onPress={() => {
          if (selected === category.uid) {
            setSelected(null);
          } else {
            setSelected(category.uid);
            setQuery(null);
          }
        }}
        className={cn('rounded-xl p-2 py-4 backdrop-blur-lg', {
          'py-[18px]': category.uid === selected
        })}
        variant={category.uid === selected ? 'flat' : 'bordered'}
        color={category.uid === selected ? 'primary' : 'default'}
      >
        <div className="flex items-center gap-4">
          <div>
            <Icon icon={category.icon} width={24} />
          </div>
          <div>
            <h3 className="whitespace-nowrap">{category.name}</h3>
          </div>
        </div>
      </Chip>
    </>
  );
}

function LoadingSkeleton() {
  return (
    <>
      <div className="flex items-center gap-4 overflow-hidden">
        {[...Array(10)].map((_, index) => (
          <Skeleton
            key={`loading-skeleton-${index}`}
            className="h-10 w-24 rounded-xl"
          />
        ))}
      </div>
    </>
  );
}
