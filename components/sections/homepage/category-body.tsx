'use client';
import { Category } from '@/lib/interface';
import { cn } from '@/lib/utils';
import getAllCategories from '@/server-actions/category';
import { Icon } from '@iconify/react/dist/iconify.js';
import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ScrollShadow,
  Select,
  SelectItem,
  useDisclosure
} from '@nextui-org/react';
import { useQueryState } from 'nuqs';
import { useEffect, useState } from 'react';
import Links from './links';
import SwitchCell from '@/components/ui/switch-cell';
import {
  defaultSettings,
  SettingsProps,
  sortTypes,
  useSettings
} from '@/hooks/useSettings';
import CellWrapper from '@/components/ui/cell-wrapper';
import { useRouter } from 'next/navigation';

export default function CategoryBody() {
  const [categories, setCategories] = useState<Category[]>([]);
  const settingModal = useDisclosure();
  const [selected, setSelected] = useQueryState('category');
  const [query, setQuery] = useQueryState('query');
  const { settings, dispatch } = useSettings();

  useEffect(() => {
    const getData = async () => {
      const data = await getAllCategories();
      setCategories(data);
    };
    getData();
  }, []);

  const handleSortChange = (newSortType: 'name' | 'date' | 'relevance') => {
    dispatch({ type: 'UPDATE_SORT_TYPE', sortType: newSortType });
  };

  return (
    <>
      <div id="category-body" className="min-h-[90vh]">
        <div className="sticky top-0 z-20 flex flex-col gap-4 bg-background/70 px-4 py-4 backdrop-blur-lg md:flex-row md:items-center md:px-8">
          <div className="flex gap-2">
            <Input
              className="min-w-72"
              placeholder="Search the realm..."
              value={query as string}
              onChange={(e) => {
                if (e.target.value === '') {
                  setQuery(null);
                } else {
                  setQuery(e.target.value);
                }
              }}
              classNames={{
                mainWrapper: 'backdrop-blur-lg',
                inputWrapper: 'backdrop-blur-lg'
              }}
              variant="bordered"
            />
            <Button isIconOnly variant="bordered" onPress={settingModal.onOpen}>
              <Icon icon="mingcute:settings-7-line" width={20} />
            </Button>
          </div>
          <ScrollShadow
            orientation="horizontal"
            className="no-scrollbar flex gap-2 p-2"
          >
            <Chip
              as={Button}
              className={cn('rounded-xl p-2 py-4 backdrop-blur-lg', {
                'py-[18px]': !selected
              })}
              variant={selected ? 'bordered' : 'flat'}
              color={selected ? 'default' : 'primary'}
              onPress={() => {
                setSelected(null);
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
          </ScrollShadow>
        </div>
        <Links />
      </div>
      <Modal
        backdrop="blur"
        isOpen={settingModal.isOpen}
        onOpenChange={settingModal.onOpenChange}
        scrollBehavior="inside"
      >
        <ModalContent className="bg-background/70 shadow-none">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Settings
              </ModalHeader>
              <ModalBody>
                <ScrollShadow className="flex flex-col gap-2">
                  <SwitchCell
                    description="Search amoung all the realms"
                    label="Global Search"
                    isSelected={settings.globalSearch}
                    onChange={() =>
                      dispatch({ type: 'TOGGLE', field: 'globalSearch' })
                    }
                  />
                  <CellWrapper>
                    <div>
                      <p>Sort </p>
                      <p className="text-small text-default-500">
                        Sort the links by the name or the most recent
                      </p>
                    </div>
                    <div className="flex w-full flex-wrap items-center justify-end gap-6 sm:w-auto sm:flex-nowrap">
                      <Dropdown placement="bottom-end">
                        <DropdownTrigger>
                          <Button variant="bordered" className="capitalize">
                            {settings.sortType}
                          </Button>
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Set Sort">
                          {sortTypes
                            .sort((a, b) => a.label.localeCompare(b.label))
                            .map((sortType) => (
                              <DropdownItem
                                key={sortType.value}
                                onPress={() =>
                                  handleSortChange(
                                    sortType.value as SettingsProps['sortType']
                                  )
                                }
                              >
                                {sortType.label}
                              </DropdownItem>
                            ))}
                        </DropdownMenu>
                      </Dropdown>
                    </div>
                  </CellWrapper>
                  <CellWrapper>
                    <div>
                      <p>Items per page</p>
                      <p className="text-small text-default-500">
                        Set the number of links to display per page
                      </p>
                    </div>
                    <div className="flex w-full flex-wrap items-center justify-end gap-6 sm:w-auto sm:flex-nowrap">
                      <Select
                        aria-label="Items per page"
                        className="w-28"
                        selectedKeys={[settings.limit?.toString()]}
                        onSelectionChange={(value) => {
                          const selectedValue = Array.from(value)[0];
                          dispatch({
                            type: 'UPDATE_LIMIT',
                            limit: Number(selectedValue)
                          });
                        }}
                      >
                        <SelectItem key="12">Default</SelectItem>
                        <SelectItem key="20">20</SelectItem>
                        <SelectItem key="50">50</SelectItem>
                        <SelectItem key="100">100</SelectItem>
                      </Select>
                    </div>
                  </CellWrapper>
                </ScrollShadow>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={() => dispatch({ type: 'RESET', defaultSettings })}
                >
                  Reset
                </Button>
                <Button color="default" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
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
