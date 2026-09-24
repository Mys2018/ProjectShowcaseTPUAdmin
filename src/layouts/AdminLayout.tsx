import { Outlet, useOutletContext } from 'react-router-dom';
import { AppHeader } from '@/components/layout/AppHeader';
import type { User } from '@/types';

export function AdminLayout() {
  const { user } = useOutletContext<{ user: User }>();

  return (
    <div className="app-shell">
      <AppHeader user={user} />
      <main className="app-main">
        <Outlet context={{ user }} />
      </main>
    </div>
  );
}

export function AuthLayout() {
  return (
    <div className="auth-layout">
      <Outlet />
    </div>
  );
}
