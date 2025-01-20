'use client';
import { useQueryState } from 'nuqs';
import CategoryBody from './category-body';
import CategoryHeader from './category-header';
import Links from './links';

export default function Categories() {
  const [category, setCategory] = useQueryState('category');

  return (
    <>
      <div>
        <CategoryHeader />
        <CategoryBody />
      </div>
    </>
  );
}
