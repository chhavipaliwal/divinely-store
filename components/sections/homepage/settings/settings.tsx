'use client';
import CellWrapper from '@/components/ui/cell-wrapper';
import {
  addToast,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Select,
  SelectItem,
  Switch
} from '@heroui/react';
import { setConfig } from '@/server-actions/cookies';
import { useFormik } from 'formik';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { DEFAULT_CONFIG } from '@/lib/config';

export default function Settings({ config }: { config: any }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const formik = useFormik({
    initialValues: {
      limit: config.limit || 36,
      globalSearch: config.globalSearch || true,
      sort: config.sort || {
        column: config.sort?.column || 'title',
        direction: config.sort?.direction || 'ascending'
      }
    },
    onSubmit: async (values) => {
      await setConfig({ name: 'config', value: values }).then(() => {
        addToast({
          title: 'Settings saved',
          description: 'Your settings have been saved',
          color: 'success'
        });
      });
    }
  });

  const handleReset = async () => {
    await setConfig({ name: 'config', value: DEFAULT_CONFIG }).then(() => {
      formik.setValues(DEFAULT_CONFIG);
      addToast({
        title: 'Settings reset',
        description: 'Your settings have been reset to default'
      });
    });
  };

  useEffect(() => setMounted(true), []);

  const iconMap = {
    ascending: 'solar:sort-from-top-to-bottom-linear',
    descending: 'solar:sort-from-bottom-to-top-linear'
  };

  const sortItems = [
    {
      label: 'Relevance',
      value: 'relevance'
    },
    {
      label: 'Title',
      value: 'title'
    },
    {
      label: 'Created At',
      value: 'createdAt'
    }
  ];

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (formik.dirty) {
        event.preventDefault();
        event.returnValue = true;
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [formik.dirty]);

  return (
    <Card>
      <CardHeader>Settings</CardHeader>
      <CardBody className="gap-4">
        <CellWrapper>
          <div>
            <p>Items per page</p>
            <p className="text-small text-default-500">
              Set the number of links to display per page
            </p>
          </div>
          <Select
            name="limit"
            aria-label="Items per page"
            className="max-w-36"
            selectedKeys={[formik.values.limit.toString()]}
            value={formik.values.limit.toString()}
            onChange={formik.handleChange}
          >
            <SelectItem key="36" textValue="Default (36)">
              Default (36)
            </SelectItem>
            <SelectItem key="20" textValue="20">
              20
            </SelectItem>
            <SelectItem key="50" textValue="50">
              50
            </SelectItem>
            <SelectItem key="100" textValue="100">
              100
            </SelectItem>
          </Select>
        </CellWrapper>
        <CellWrapper>
          <div>
            <p>Items per page</p>
            <p className="text-small text-default-500">
              Set the number of links to display per page
            </p>
          </div>
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Button
                variant="bordered"
                endContent={
                  <Icon
                    icon={
                      iconMap[
                        formik.values.sort.direction as keyof typeof iconMap
                      ]
                    }
                    width={20}
                  />
                }
              >
                {
                  sortItems.find(
                    (item) => item.value === formik.values.sort.column
                  )?.label
                }
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
                    formik.setFieldValue('sort.column', item.value);
                    formik.setFieldValue(
                      'sort.direction',
                      formik.values.sort.column === item.value
                        ? formik.values.sort.direction === 'ascending'
                          ? 'descending'
                          : 'ascending'
                        : 'ascending'
                    );
                  }}
                  endContent={
                    formik.values.sort.column === item.value && (
                      <Icon
                        icon={
                          iconMap[
                            formik.values.sort.direction as keyof typeof iconMap
                          ]
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
        </CellWrapper>
        <CellWrapper>
          <div>
            <p>Global search</p>
            <p className="text-small text-default-500">
              Enable global search to search for links across all categories
            </p>
          </div>
          <Switch
            name="globalSearch"
            aria-label="Global search"
            isSelected={formik.values.globalSearch}
            onChange={formik.handleChange}
            isDisabled
          />
        </CellWrapper>
        <CellWrapper>
          <div>
            <p>Theme</p>
            <p className="text-small text-default-500">
              Enable dark mode across the app?
            </p>
          </div>
          {mounted && (
            <Switch
              name="theme"
              aria-label="Theme"
              isSelected={theme == 'dark'}
              onChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            />
          )}
        </CellWrapper>
      </CardBody>
      <CardFooter className="justify-end gap-4">
        <Button
          radius="full"
          variant="bordered"
          onPress={() => {
            handleReset();
          }}
        >
          Reset to default
        </Button>
        <Button
          radius="full"
          color="primary"
          onPress={() => formik.handleSubmit()}
          isLoading={formik.isSubmitting}
        >
          Save
        </Button>
      </CardFooter>
    </Card>
  );
}
