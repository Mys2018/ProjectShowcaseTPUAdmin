import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { PageHeader } from '@/components/layout/PageHeader';

export function ReportsPage() {
  useDocumentTitle('Отчёты');
  return (
    <div>
      <PageHeader
        title="Отчёты"
        description="Раздел аналитики и выгрузок"
      />
      <div className="card placeholder-page">
        <h2>Скоро</h2>
        <p>Раздел отчётов и аналитики будет доступен позже.</p>
      </div>
    </div>
  );
}
