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
  useDisclosure,
  Spinner
} from '@nextui-org/react';
import { useFormik } from 'formik';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { toast } from 'sonner';
import { signOut } from 'next-auth/react';
import axios from 'axios';
import { useQueryState, parseAsInteger } from 'nuqs';
import useDebounce from '@/hooks/useDebounce';

const INITIAL_VISIBLE_COLUMNS = ['title', 'description', 'category', 'actions'];

export default function Links() {
  const [links, setLinks] = React.useState<ILink[]>([]);
  const [pages, setPages] = React.useState(1);
  const [pagination, setPagination] = React.useState({
    page: 1,
    limit: 20,
    totalLinks: 0,
    totalPages: 0
  });
  const [isLoading, setIsLoading] = React.useState(true);

  const deleteModal = useDisclosure();
  const router = useRouter();
  const [selected, setSelected] = React.useState<ILink | null>(null);
  const [filterValue, setFilterValue] = useQueryState('query', {
    defaultValue: ''
  });
  const debouncedSearchTerm = useDebounce(filterValue, 500);

  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
    new Set([])
  );
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [rowsPerPage, setRowsPerPage] = useQueryState(
    'rows',
    parseAsInteger.withDefault(20)
  );
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: 'name',
    direction: 'ascending'
  });
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));

  useEffect(() => {
    const getLinks = async () => {
      setIsLoading(true);
      const res = await axios.get(`/api/link`, {
        params: {
          page,
          limit: rowsPerPage,
          search: filterValue
        }
      });
      const data = res.data.links;
      setLinks(data);
      setPages(res.data.pagination.totalPages);
      setPagination(res.data.pagination);
      setIsLoading(false);
    };
    getLinks();
  }, [debouncedSearchTerm, rowsPerPage, page]);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === 'all') return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  let filteredItems = React.useMemo(() => {
    let filteredLinks = [...links];

    return filteredLinks;
  }, [links]);

  const sortedItems = React.useMemo(() => {
    return [...links].sort((a: ILink, b: ILink) => {
      const first = a[sortDescriptor.column as keyof ILink] as string;
      const second = b[sortDescriptor.column as keyof ILink] as string;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === 'descending' ? -cmp : cmp;
    });
  }, [sortDescriptor, links]);

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
            Total {pagination.totalLinks} links
          </span>
          <label className="flex items-center text-small text-default-400">
            Rows per page:
            <select
              className="bg-transparent text-small text-default-400 outline-none"
              onChange={onRowsPerPageChange}
            >
              {rows.map((row) => (
                <option key={row.label} value={row.value}>
                  {row.label}
                </option>
              ))}
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
    links.length
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
  }, [selectedKeys, links.length, page, pages]);

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
        aria-label="Links List"
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
        <TableBody
          items={sortedItems}
          loadingContent={<Spinner />}
          loadingState={isLoading ? 'loading' : 'idle'}
          emptyContent={'No links found'}
        >
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

const rows = [
  {
    label: '20',
    value: 20
  },
  {
    label: '50',
    value: 50
  },
  {
    label: '100',
    value: 100
  },
  {
    label: '1000',
    value: 1000
  }
];
