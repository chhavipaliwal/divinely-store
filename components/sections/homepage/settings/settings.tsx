'use client';
import CellWrapper from '@/components/ui/cell-wrapper';
import { Card, CardBody, CardHeader, Select, SelectItem } from '@heroui/react';
import { loadTableConfig, saveTableConfig } from '@/lib/localstorage-util';
import { useEffect, useState } from 'react';

export default function Settings() {
  const [tableConfig, setTableConfig] = useState<any>(null);

  useEffect(() => {
    setTableConfig(loadTableConfig('links-homepage'));
  }, []);

  return (
    <Card>
      <CardHeader>Settings</CardHeader>
      <CardBody>
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
              selectedKeys={[tableConfig?.limit?.toString() || '36']}
              onSelectionChange={(value) => {
                const selectedValue = Array.from(value)[0];
                saveTableConfig('links-homepage', {
                  ...tableConfig,
                  limit: Number(selectedValue)
                });
              }}
            >
              <SelectItem key="36">Default</SelectItem>
              <SelectItem key="20">20</SelectItem>
              <SelectItem key="50">50</SelectItem>
              <SelectItem key="100">100</SelectItem>
            </Select>
          </div>
        </CellWrapper>
      </CardBody>
    </Card>
  );
}
