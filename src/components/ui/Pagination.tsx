import { Button } from './Button';

interface PaginationProps {
  total: number;
  offset: number;
  limit: number;
  onChange: (offset: number, limit?: number) => void;
}

export function Pagination({ total, offset, limit, onChange }: PaginationProps) {
  const from = total === 0 ? 0 : offset + 1;
  const to = Math.min(offset + limit, total);
  const canPrev = offset > 0;
  const canNext = offset + limit < total;

  return (
    <div className="ui-pagination">
      <div>
        {total > 0 ? `${from}–${to} из ${total}` : 'Нет записей'}
      </div>
      <div className="ui-pagination-actions">
        <Button
          size="sm"
          disabled={!canPrev}
          onClick={() => onChange(Math.max(0, offset - limit), limit)}
        >
          Назад
        </Button>
        <Button
          size="sm"
          disabled={!canNext}
          onClick={() => onChange(offset + limit, limit)}
        >
          Вперёд
        </Button>
      </div>
    </div>
  );
}
