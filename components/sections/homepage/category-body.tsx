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
  ScrollShadow,
  Select,
  SelectItem,
  Tooltip,
  useDisclosure
} from '@heroui/react';
import { useQueryState } from 'nuqs';
import { useEffect, useState } from 'react';
import Links from './links';
import Skeleton from '@/components/ui/skeleton';
import Link from 'next/link';
import { useForm } from './context';

export default function CategoryBody({ session }: { session?: any }) {
  const { formik } = useForm();
  const [categories, setCategories] = useState<Category[]>([]);
  const settingModal = useDisclosure();
  const [selected, setSelected] = useQueryState('category');
  const [query, setQuery] = useQueryState('query');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      const data = await getAllCategories();
      setCategories(data);
      setIsLoading(false);
    };
    getData();
  }, []);

  const iconMap = {
    ascending: 'solar:sort-from-top-to-bottom-linear',
    descending: 'solar:sort-from-bottom-to-top-linear'
  };

  const sortItems = [
    {
      label: 'Title',
      value: 'title'
    },
    {
      label: 'Created At',
      value: 'createdAt'
    }
  ];

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
              isClearable
              onClear={() => {
                setQuery(null);
              }}
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
                  selectedKeys={['title']}
                  closeOnSelect={false}
                  items={sortItems}
                >
                  {(item) => (
                    <DropdownItem
                      key={item.value}
                      onPress={() => {
                        formik.setFieldValue(
                          'sortDescriptor.column',
                          item.value
                        );
                        formik.setFieldValue(
                          'sortDescriptor.direction',
                          formik.values.sortDescriptor.column === item.value
                            ? formik.values.sortDescriptor.direction ===
                              'ascending'
                              ? 'descending'
                              : 'ascending'
                            : 'ascending'
                        );
                      }}
                      endContent={
                        formik.values.sortDescriptor.column === item.value && (
                          <Icon
                            icon={
                              iconMap[formik.values.sortDescriptor.direction]
                            }
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
                  {
                    'py-[18px]': !selected
                  }
                )}
                variant={selected ? 'bordered' : 'flat'}
                color={selected ? 'default' : 'primary'}
                onClick={() => {
                  setSelected(null);
                  setQuery(null);
                }}
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
              {session?.user?.role === 'admin' && (
                <Chip
                  as={Link}
                  className={cn('rounded-xl p-2 py-4 backdrop-blur-lg')}
                  variant="bordered"
                  color="default"
                  href={'/links/new'}
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
  return (
    <>
      <Chip
        as={Button}
        onPress={() => {
          setSelected(category.uid);
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
            className="h-10 w-24 min-w-24 rounded-xl"
          />
        ))}
      </div>
    </>
  );
}
