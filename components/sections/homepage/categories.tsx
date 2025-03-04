'use client';
import CategoryBody from './category-body';
import CategoryHeader from './category-header';
import { SettingsProvider } from '@/hooks/useSettings';

export default async function Categories() {
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
