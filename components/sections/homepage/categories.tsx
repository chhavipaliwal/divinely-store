import { auth } from '@/auth';
import CategoryBody from './category-body';
import CategoryHeader from './category-header';
import { FormProvider } from './context';

export default async function Categories() {
  const session = await auth();
  return (
    <>
      <FormProvider>
        <div>
          <CategoryHeader />
          <CategoryBody session={session} />
        </div>
      </FormProvider>
    </>
  );
}
