import Settings from '@/components/sections/homepage/settings/settings';
import { getConfig, setConfig } from '@/server-actions/cookies';

export default async function page() {
  const config = await getConfig({ name: 'config' });

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6">
      <Settings config={JSON.parse(config?.value || '{}')} />
    </div>
  );
}
