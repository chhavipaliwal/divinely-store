'use client';
import { useQueryState } from 'nuqs';
import CategoryBody from './category-body';
import CategoryHeader from './category-header';
import { SettingsProvider } from '@/hooks/useSettings';

export default function Categories() {
  return (
    <>
      <SettingsProvider>
        <div>
          <CategoryHeader />
          <CategoryBody />
        </div>
      </SettingsProvider>
    </>
  );
}
