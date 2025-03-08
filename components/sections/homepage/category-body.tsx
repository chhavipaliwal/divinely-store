'use client';
import { Category } from '@/lib/interface';
import { cn } from '@/lib/utils';
import getAllCategories from '@/server-actions/category';
import { Icon } from '@iconify/react/dist/iconify.js';
import {
  Button,
  ButtonGroup,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  ScrollShadow
} from '@heroui/react';
import { useQueryState } from 'nuqs';
import { useCallback, useEffect, useMemo, useState, memo } from 'react';
import Links from './links';
import Skeleton from '@/components/ui/skeleton';
import Link from 'next/link';
import { useForm } from './context';

// Move static content outside component
const sortItems = [
  { label: 'Relevance', value: 'relevance' },
  { label: 'Title', value: 'title' },
  { label: 'Created At', value: 'createdAt' }
];

const iconMap = {
  ascending: 'solar:sort-from-top-to-bottom-linear',
  descending: 'solar:sort-from-bottom-to-top-linear'
} as const;

// Memoize PressableCard component
const PressableCard = memo(
  ({
    category,
    selected,
    setSelected
  }: {
    category: Category;
    selected: string | null;
    setSelected: (value: string | null) => void;
  }) => {
    const handlePress = useCallback(() => {
      setSelected(category.uid);
    }, [category.uid, setSelected]);

    return (
      <Chip
        as={Button}
        onPress={handlePress}
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
    );
  }
);

PressableCard.displayName = 'PressableCard';

// Memoize LoadingSkeleton component
const LoadingSkeleton = memo(() => (
  <div className="flex items-center gap-4 overflow-hidden">
    {[...Array(10)].map((_, index) => (
      <Skeleton
        key={`loading-skeleton-${index}`}
        className="h-10 w-24 min-w-24 rounded-xl"
      />
    ))}
  </div>
));

LoadingSkeleton.displayName = 'LoadingSkeleton';

export default function CategoryBody({ session }: { session?: any }) {
  const { formik } = useForm();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selected, setSelected] = useQueryState('category');
  const [query, setQuery] = useQueryState('query');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setIsLoading(false);
      }
    };
    getData();
  }, []);

  const handleQueryChange = useCallback(
    (value: string) => {
      if (value === '') {
        setQuery(null);
      } else {
        setQuery(value);
      }
    },
    [setQuery]
  );

  const handleSortChange = useCallback(
    (item: (typeof sortItems)[0]) => {
      formik.setFieldValue('sort.column', item.value);
      formik.setFieldValue(
        'sort.direction',
        formik.values.sort.column === item.value
          ? formik.values.sort.direction === 'ascending'
            ? 'descending'
            : 'ascending'
          : 'ascending'
      );
    },
    [formik]
  );

  const handleCategoryReset = useCallback(() => {
    setSelected(null);
    setQuery(null);
  }, [setSelected, setQuery]);

  // Memoize sorted items with their current sort state
  const sortedItemsWithState = useMemo(
    () =>
      sortItems.map((item) => ({
        ...item,
        isSelected: formik.values.sort.column === item.value,
        direction: formik.values.sort.direction
      })),
    [formik.values.sort]
  );

  return (
    <div id="category-body" className="min-h-[90vh]">
      <div className="sticky top-0 z-20 flex flex-col gap-2 bg-background/70 px-4 py-2 backdrop-blur-lg md:flex-row md:items-center md:gap-4 md:px-8 md:py-4">
        <div className="flex gap-2">
          <Input
            className="w-full max-w-72 backdrop-blur-sm sm:min-w-72"
            placeholder="Search the realm..."
            value={query || ''}
            onChange={(e) => handleQueryChange(e.target.value)}
            classNames={{
              mainWrapper: 'backdrop-blur-lg bg-transparent',
              inputWrapper: 'backdrop-blur-lg bg-transparent'
            }}
            isClearable
            onClear={() => handleQueryChange('')}
            variant="bordered"
          />

          <ButtonGroup>
            <Button as={Link} href="/settings" isIconOnly variant="bordered">
              <Icon icon="solar:settings-linear" width={20} />
            </Button>
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Button isIconOnly variant="bordered">
                  <Icon icon="solar:sort-vertical-linear" width={20} />
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                selectedKeys={[formik.values.sort.column]}
                closeOnSelect={false}
                items={sortedItemsWithState}
              >
                {(item) => (
                  <DropdownItem
                    key={item.value}
                    onPress={() => handleSortChange(item)}
                    endContent={
                      item.isSelected && (
                        <Icon
                          icon={iconMap[item.direction as keyof typeof iconMap]}
                          width={20}
                        />
                      )
                    }
                  >
                    {item.label}
                  </DropdownItem>
                )}
              </DropdownMenu>
            </Dropdown>
          </ButtonGroup>
        </div>

        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          <ScrollShadow
            orientation="horizontal"
            className="no-scrollbar flex gap-2 p-2"
          >
            <Chip
              className={cn(
                'cursor-pointer rounded-xl p-2 py-4 backdrop-blur-lg',
                { 'py-[18px]': !selected }
              )}
              variant={selected ? 'bordered' : 'flat'}
              color={selected ? 'default' : 'primary'}
              onClick={handleCategoryReset}
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
                key={category._id}
                selected={selected}
                setSelected={setSelected}
                category={category}
              />
            ))}

            {session?.user?.role === 'admin' && (
              <Chip
                as={Link}
                className="rounded-xl p-2 py-4 backdrop-blur-lg"
                variant="bordered"
                color="default"
                href="/links/new"
              >
                <div className="flex items-center gap-4">
                  <div>
                    <Icon icon="mingcute:add-fill" width={24} />
                  </div>
                  <div>
                    <h3 className="whitespace-nowrap">Add New Item</h3>
                  </div>
                </div>
              </Chip>
            )}
          </ScrollShadow>
        )}
      </div>
      <Links />
    </div>
  );
}
