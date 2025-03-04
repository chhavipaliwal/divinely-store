import { auth } from '@/auth';
import CategoryBody from './category-body';
import CategoryHeader from './category-header';
import { SettingsProvider } from '@/hooks/useSettings';

export default async function Categories() {
  const session = await auth();
  return (
    <>
      <SettingsProvider>
        <div>
          <CategoryHeader />
          <CategoryBody session={session} />
        </div>
      </SettingsProvider>
    </>
  );
}
