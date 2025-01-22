'use client';
import CellWrapper from '@/components/ui/cell-wrapper';
import SwitchCell from '@/components/ui/switch-cell';
import {
  sortTypes,
  SettingsProps,
  defaultSettings,
  useSettings
} from '@/hooks/useSettings';
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
} from '@nextui-org/react';
import { Link } from 'lucide-react';
import { signOut } from 'next-auth/react';

export default function Settings({
  isOpen,
  onOpenChange,
  session
}: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  session?: any;
}) {
  const { settings, dispatch } = useSettings();
  const handleSortChange = (newSortType: 'name' | 'date' | 'relevance') => {
    dispatch({ type: 'UPDATE_SORT_TYPE', sortType: newSortType });
  };

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
