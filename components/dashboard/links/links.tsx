'use client';
import {
  capitalize,
  humanReadableDate,
  humanReadableTime
} from '@/functions/utility';
import { Link as ILink, Category as ICategory } from '@/lib/interface';
import { Icon } from '@iconify/react/dist/iconify.js';
import {
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Table,
  Chip,
  Selection,
  Avatar,
  Dropdown,
  DropdownTrigger,
  Button,
  DropdownMenu,
  DropdownItem,
  SortDescriptor,
  Input,
  Pagination,
  Modal,
  ModalHeader,
  ModalBody,
  ModalContent,
  ModalFooter,
  useDisclosure
} from '@nextui-org/react';
import { useFormik } from 'formik';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import { toast } from 'sonner';
import { signOut } from 'next-auth/react';

interface HotelProps {
  links: ILink[];
  categories: ICategory[];
}

const INITIAL_VISIBLE_COLUMNS = ['title', 'description', 'category', 'actions'];

export default function Hotels({ links, categories }: HotelProps) {
  const deleteModal = useDisclosure();
  const router = useRouter();
  const [selected, setSelected] = React.useState<ILink | null>(null);
  const [filterValue, setFilterValue] = React.useState('');
  const [categoryFilter, setCategoryFilter] = React.useState<Selection>('all');

  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
    new Set([])
  );
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [rowsPerPage, setRowsPerPage] = React.useState(1000);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: 'name',
    direction: 'ascending'
  });

  const [page, setPage] = React.useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === 'all') return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  let filteredItems = React.useMemo(() => {
    let filteredLinks = [...links];

    if (hasSearchFilter) {
      filteredLinks = filteredLinks.filter(
        (link) =>
          link.title.toLowerCase().includes(filterValue.toLowerCase()) ||
          link.description.toLowerCase().includes(filterValue.toLowerCase()) ||
          link.category.toLowerCase().includes(filterValue.toLowerCase()) ||
          link.tags.some((tag) =>
            tag.toLowerCase().includes(filterValue.toLowerCase())
          )
      );
    }
    if (
      categoryFilter !== 'all' &&
      Array.from(categoryFilter).length !== categories.length
    ) {
      filteredLinks = filteredLinks.filter((link) =>
        Array.from(categoryFilter).includes(link.category)
      );
    }

    return filteredLinks;
  }, [links, filterValue, categoryFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a: ILink, b: ILink) => {
      const first = a[sortDescriptor.column as keyof ILink] as string;
      const second = b[sortDescriptor.column as keyof ILink] as string;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === 'descending' ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = React.useCallback((link: ILink, columnKey: React.Key) => {
    const cellValue = link[columnKey as keyof ILink];
    switch (columnKey) {
      case 'title':
        return (
          <>
            <div className="flex items-center gap-2">
              <Avatar
                src={`https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${link.url}&size=64`}
              />
              <div className="flex flex-col">
                <p className="text-bold whitespace-nowrap text-sm capitalize">
                  {link.title}
                </p>
                <p className="text-bold whitespace-nowrap text-sm capitalize text-default-400">
                  {link.category}
                </p>
              </div>
            </div>
          </>
        );
      case 'description':
        return (
          <div className="flex flex-col">
            <p className="text-bold max-w-sm overflow-hidden text-ellipsis whitespace-nowrap text-sm capitalize text-default-400">
              {link.description}
            </p>
          </div>
        );
      case 'tags':
        return (
          <div className="flex gap-2">
            {link.tags.map((tag) => (
              <Chip key={tag} size="sm" variant="flat">
                {tag}
              </Chip>
            ))}
          </div>
        );
      case 'category':
        return (
          <p className="text-bold whitespace-nowrap text-sm capitalize">
            {link.category}
          </p>
        );
      case 'updatedAt':
        return (
          <>
            <p className="text-bold whitespace-nowrap text-sm capitalize">
              {humanReadableDate(link.updatedAt)}
            </p>
            <p className="text-bold whitespace-nowrap text-sm capitalize text-default-400">
              {humanReadableTime(link.updatedAt)}
            </p>
          </>
        );
      case 'actions':
        return (
          <Dropdown>
            <DropdownTrigger>
              <Button variant="light" isIconOnly>
                <Icon icon="tabler:dots-vertical" fontSize={18} />
              </Button>
            </DropdownTrigger>
            <DropdownMenu>
              <DropdownItem
                key={'view'}
                startContent={<Icon icon="ic:round-view-in-ar" fontSize={20} />}
                as={Link}
                href={`/${link._id}`}
              >
                View
              </DropdownItem>
              <DropdownItem
                key={'edit'}
                startContent={<Icon icon="tabler:edit" fontSize={20} />}
                as={Link}
                href={`/${link._id}/edit`}
              >
                Edit
              </DropdownItem>
              <DropdownItem
                key={'delete'}
                startContent={<Icon icon="tabler:trash" fontSize={20} />}
                className="text-danger"
                color="danger"
                onPress={() => {
                  setSelected(link);
                  deleteModal.onOpen();
                }}
              >
                Delete
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        );
      default:
        return cellValue;
    }
  }, []);

  const onNextPage = React.useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = React.useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    []
  );

  const onSearchChange = React.useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue('');
    }
  }, []);

  const onClear = React.useCallback(() => {
    setFilterValue('');
    setPage(1);
  }, []);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-end justify-between gap-3">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search anything..."
            startContent={<Icon icon="tabler:search" />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  variant="flat"
                  endContent={
                    <Icon icon={'tabler:chevron-down'} fontSize={16} />
                  }
                >
                  Category
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={categoryFilter}
                selectionMode="multiple"
                onSelectionChange={setCategoryFilter}
              >
                {categories.map((category) => (
                  <DropdownItem key={category.name} className="capitalize">
                    {capitalize(category.uid)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={
                    <Icon icon={'tabler:chevron-down'} fontSize={16} />
                  }
                  variant="flat"
                >
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Button
              color="primary"
              endContent={<Icon icon={'tabler:plus'} />}
              as={Link}
              href="/new"
            >
              Add New
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-small text-default-400">
            Total {links.length} links
          </span>
          <label className="flex items-center text-small text-default-400">
            Rows per page:
            <select
              className="bg-transparent text-small text-default-400 outline-none"
              onChange={onRowsPerPageChange}
            >
              <option value="50">50</option>
              <option value="100">100</option>
              <option value="1000">1000</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    visibleColumns,
    onSearchChange,
    onRowsPerPageChange,
    links.length,
    hasSearchFilter,
    categoryFilter
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="flex items-center justify-between px-2 py-2">
        <span className="w-[30%] text-small text-default-400">
          {selectedKeys === 'all'
            ? 'All items selected'
            : `${selectedKeys.size} of ${filteredItems.length} selected`}
        </span>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="hidden w-[30%] justify-end gap-2 sm:flex">
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onPreviousPage}
          >
            Previous
          </Button>
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onNextPage}
          >
            Next
          </Button>
        </div>
      </div>
    );
  }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

  const formik = useFormik({
    initialValues: {},
    onSubmit: async () => {
      try {
        await fetch(`/api/link/${selected?._id}`, {
          method: 'DELETE'
        });
        toast.success('Link deleted successfully');
        deleteModal.onClose();
        // refresh data
        router.refresh();
      } catch (e) {
        toast.error('Failed to delete');
        console.error(e);
      }
    }
  });

  return (
    <>
      <Table
        aria-label="Hotels List"
        isHeaderSticky
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        classNames={{
          wrapper: 'max-h-[382px]'
        }}
        selectedKeys={selectedKeys}
        //   selectionMode="multiple"
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        onSelectionChange={setSelectedKeys}
        onSortChange={setSortDescriptor}
        onRowAction={(key) => {
          window.open(key as any, '_blank');
        }}
        className="cursor-pointer"
      >
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === 'actions' ? 'center' : 'start'}
              allowsSorting={column.sortable}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={sortedItems} emptyContent={'No links found'}>
          {(item) => (
            <TableRow
              key={item.url}
              className="transition-all hover:bg-default-100"
            >
              {(columnKey) => (
                // @ts-ignore
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex justify-end">
        <Button
          onPress={() => {
            signOut();
          }}
        >
          Logout
        </Button>
      </div>
      <Modal
        backdrop="blur"
        scrollBehavior="inside"
        isOpen={deleteModal.isOpen}
        onOpenChange={deleteModal.onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex-col items-center">
                <Icon
                  icon="tabler:trash-x"
                  fontSize={54}
                  className="text-danger"
                />
                <h2 className="mt-4 max-w-xs text-center text-sm font-[400]">
                  Are you sure you permanently want to delete{' '}
                  <span className="font-semibold">{selected?.title}</span> from
                  the Database?
                </h2>
              </ModalHeader>
              <ModalBody className="items-center text-sm">
                You can&apos;t undo this action.
              </ModalBody>
              <ModalFooter className="flex-col-reverse sm:flex-row">
                <Button fullWidth variant="flat" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="danger"
                  variant="flat"
                  fullWidth
                  isLoading={formik.isSubmitting}
                  onPress={() => formik.handleSubmit()}
                >
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

const columns = [
  { name: 'TITLE', uid: 'title', sortable: true },
  { name: 'DESCRIPTION', uid: 'description' },
  { name: 'TAGS', uid: 'tags' },
  { name: 'CATEGORY', uid: 'category', sortable: true },
  { name: 'UPDATED AT', uid: 'updatedAt', sortable: true },
  { name: 'ACTIONS', uid: 'actions' }
];
