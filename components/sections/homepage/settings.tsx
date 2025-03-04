'use client';
import CellWrapper from '@/components/ui/cell-wrapper';
import SwitchCell from '@/components/ui/switch-cell';

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ScrollShadow,
  Dropdown,
  DropdownTrigger,
  Button,
  DropdownMenu,
  DropdownItem,
  Select,
  SelectItem,
  ModalFooter
} from '@heroui/react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { useForm } from './context';

export default function Settings({
  isOpen,
  onOpenChange,
  session
}: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  session?: any;
}) {
  const { formik } = useForm();

  const sortItems = [
    { label: 'Title', value: 'title' },
    { label: 'Date', value: 'date' },
    { label: 'Relevance', value: 'relevance' }
  ];

  return (
    <>
      <Modal
        backdrop="blur"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        scrollBehavior="inside"
      >
        <ModalContent className="bg-background/70 shadow-none">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Settings
              </ModalHeader>
              <ModalBody>
                <SwitchCell
                  description="Search amoung all the realms"
                  label="Global Search"
                />
                <div
                  className={
                    'flex items-center justify-between gap-2 rounded-medium bg-default/50 p-4 backdrop-blur-lg'
                  }
                >
                  <div>
                    <p>Sort </p>
                    <p className="text-small text-default-500">
                      Sort the links by the name or the most recent
                    </p>
                  </div>
                  <Select
                    items={sortItems}
                    selectedKeys={[formik.values.sortDescriptor.column]}
                    onSelectionChange={(keys) => {
                      formik.setFieldValue('sortDescriptor.column', keys);
                    }}
                    className="w-full"
                  >
                    {(item) => (
                      <SelectItem key={item.value}>{item.label}</SelectItem>
                    )}
                  </Select>
                </div>
                <CellWrapper>
                  <div>
                    <p>Items per page</p>
                    <p className="text-small text-default-500">
                      Set the number of links to display per page
                    </p>
                  </div>
                  <div className="flex w-full flex-wrap items-center justify-end gap-6 sm:w-auto sm:flex-nowrap">
                    <Dropdown>
                      <DropdownTrigger>
                        <Button variant="bordered" className="capitalize">
                          12
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu>
                        <DropdownItem key="12">12</DropdownItem>
                        <DropdownItem key="20">20</DropdownItem>
                        <DropdownItem key="50">50</DropdownItem>
                        <DropdownItem key="100">100</DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                </CellWrapper>
                {session ? (
                  <CellWrapper className="justify-end">
                    <div className="flex w-full flex-wrap items-center justify-end gap-6 sm:w-auto sm:flex-nowrap">
                      <Button
                        color="danger"
                        variant="light"
                        onPress={() => signOut()}
                      >
                        Logout
                      </Button>
                    </div>
                  </CellWrapper>
                ) : (
                  <CellWrapper>
                    <div>
                      <p>Login</p>
                      <p className="text-small text-default-500">
                        Login to access more features
                      </p>
                    </div>
                    <div className="flex w-full flex-wrap items-center justify-end gap-6 sm:w-auto sm:flex-nowrap">
                      <Button as={Link} href="/auth/login" variant="bordered">
                        Login
                      </Button>
                    </div>
                  </CellWrapper>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light">
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
