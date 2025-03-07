import { auth } from '@/auth';
import CategoryBody from './category-body';
import CategoryHeader from './category-header';
import { FormProvider } from './context';
import { getConfig } from '@/server-actions/cookies';

export default async function Categories() {
  const session = await auth();
  const config = await getConfig({ name: 'config' });

  return (
    <>  
      <FormProvider config={JSON.parse(config?.value || '{}')}>
        <div>
          <CategoryHeader />
          <CategoryBody session={session} />
        </div>
      </FormProvider>
    </>
  );
}
