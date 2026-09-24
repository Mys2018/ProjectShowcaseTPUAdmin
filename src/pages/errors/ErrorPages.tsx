import { Link } from 'react-router-dom';
import { Button } from '@/components/ui';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export function NotFoundPage() {
  useDocumentTitle('Не найдено');
  return (
    <div className="placeholder-page card">
      <h1>Страница не найдена</h1>
      <p className="muted">Проверьте адрес или вернитесь к проектам.</p>
      <div style={{ marginTop: 16 }}>
        <Link to="/projects">
          <Button variant="primary">К проектам</Button>
        </Link>
      </div>
    </div>
  );
}

export function ForbiddenPage() {
  useDocumentTitle('Нет доступа');
  return (
    <div className="placeholder-page card">
      <h1>Недостаточно прав</h1>
      <p className="muted">
        Для доступа к админ-панели нужна staff-роль (Admin, Moderator и т.д.).
      </p>
      <div style={{ marginTop: 16 }}>
        <Link to="/login">
          <Button variant="primary">На вход</Button>
        </Link>
      </div>
    </div>
  );
}
