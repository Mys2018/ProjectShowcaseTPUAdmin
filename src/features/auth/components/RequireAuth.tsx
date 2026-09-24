import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { authQueries, useAuthStore } from '@/features/auth';
import { onSessionExpired } from '@/api/sessionEvents';
import { PageLoader } from '@/components/ui';
import { isStaff } from '@/utils/userRoles';

export function RequireAuth() {
  const location = useLocation();
  const isLoggedOut = useAuthStore((s) => s.isLoggedOut);
  const setLoggedOut = useAuthStore((s) => s.setLoggedOut);
  const me = authQueries.useMe(!isLoggedOut);

  useEffect(() => {
    return onSessionExpired(() => {
      setLoggedOut(true);
    });
  }, [setLoggedOut]);

  if (isLoggedOut) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (me.isLoading || me.isFetching) {
    return <PageLoader label="Проверяем сессию…" />;
  }

  if (me.isError || !me.data) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet context={{ user: me.data }} />;
}

export function RequireStaff() {
  const isLoggedOut = useAuthStore((s) => s.isLoggedOut);
  const me = authQueries.useMe(!isLoggedOut);

  if (me.isLoading || !me.data) {
    return <PageLoader />;
  }

  if (!isStaff(me.data)) {
    return <Navigate to="/forbidden" replace />;
  }

  return <Outlet context={{ user: me.data }} />;
}
