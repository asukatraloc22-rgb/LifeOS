import { PageHeader } from '@/shared/layouts/PageHeader';
import { Card } from '@/shared/components/ui';

export function ComingSoon({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div>
      <PageHeader title={title} subtitle={subtitle} />
      <Card className="flex flex-col items-center justify-center py-16 text-center border-dashed">
        <span className="text-2xl mb-2">🚧</span>
        <span className="text-sm text-text-2">Module en construction — prochain sprint</span>
      </Card>
    </div>
  );
}
