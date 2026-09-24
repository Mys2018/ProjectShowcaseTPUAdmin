import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authQueries, pkceService } from '@/features/auth';
import { Alert, Button, PageLoader } from '@/components/ui';
import { getErrorMessage } from '@/api/errors';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export function CallbackPage() {
  useDocumentTitle('Авторизация');
  const navigate = useNavigate();
  const login = authQueries.useLogin();
  const started = useRef(false);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const params = pkceService.parseCallback(window.location.search);
    if (!params) {
      // deferred to avoid sync setState-in-effect lint cascade on first paint
      queueMicrotask(() => {
        setError('Некорректный ответ OAuth или истек state. Попробуйте войти снова.');
        setReady(true);
      });
      return;
    }

    login.mutate(params, {
      onSuccess: () => navigate('/projects', { replace: true }),
      onError: (err) => {
        setError(getErrorMessage(err, 'Не удалось завершить вход'));
        setReady(true);
      },
    });
  }, [login, navigate]);

  if (error) {
    return (
      <div className="auth-card">
        <h1>Ошибка входа</h1>
        <Alert tone="error">{error}</Alert>
        <div style={{ marginTop: 16 }}>
          <Link to="/login">
            <Button variant="primary">На страницу входа</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-card">
      <PageLoader label={ready ? 'Ошибка…' : 'Завершаем вход…'} />
    </div>
  );
}
