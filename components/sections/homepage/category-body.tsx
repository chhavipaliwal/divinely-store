'use client';
import { Category } from '@/lib/interface';
import { cn } from '@/lib/utils';
import getAllCategories from '@/server-actions/category';
import { Icon } from '@iconify/react/dist/iconify.js';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
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
  useDisclosure
} from '@nextui-org/react';
import { useQueryState } from 'nuqs';
import { useEffect, useState } from 'react';
import Links from './links';

export default function CategoryBody() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selected, setSelected] = useQueryState('category');
  const [query, setQuery] = useQueryState('query');
  const settingModal = useDisclosure();

  useEffect(() => {
    const getData = async () => {
      const data = await getAllCategories();
      setCategories(data);
    };
    getData();
  }, []);

  return (
    <>
      <div id="category-body" className="min-h-[90vh]">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
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
              <Icon icon="mingcute:filter-fill" width={20} />
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
      >
        <ModalContent className="bg-background/70 shadow-none">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Settings
              </ModalHeader>
              <ModalBody></ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Action
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
