import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import {
  authQueries,
  buildAuthorizeUrl,
  pkceService,
  useAuthStore,
} from '@/features/auth';
import { Alert, Button } from '@/components/ui';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { getErrorMessage } from '@/api/errors';
import { useTheme } from '@/providers';

export function LoginPage() {
  useDocumentTitle('Вход');
  const { theme, toggleTheme } = useTheme();
  const isLoggedOut = useAuthStore((s) => s.isLoggedOut);
  const me = authQueries.useMe(!isLoggedOut);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isLoggedOut && me.data) {
    return <Navigate to="/projects" replace />;
  }

  const startLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      const { challenge, state } = await pkceService.prepareAuth();
      window.location.assign(buildAuthorizeUrl({ challenge, state }));
    } catch (err) {
      setError(getErrorMessage(err, 'Не удалось начать вход'));
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <div className="row" style={{ justifyContent: 'space-between', marginBottom: 8 }}>
        <img src="/TPUlogo.ico" alt="" width={32} height={32} />
        <Button variant="ghost" size="sm" onClick={toggleTheme}>
          {theme === 'dark' ? 'Светлая' : 'Тёмная'}
        </Button>
      </div>
      <h1>Админ-панель витрины</h1>
      <p>Войдите через аккаунт ТПУ, чтобы управлять проектами, пользователями и справочниками.</p>
      {error ? <Alert tone="error">{error}</Alert> : null}
      <div style={{ marginTop: 16 }}>
        <Button variant="primary" size="lg" loading={loading} onClick={startLogin}>
          Войти через ТПУ
        </Button>
      </div>
    </div>
  );
}
