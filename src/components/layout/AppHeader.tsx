import { NavLink, useNavigate } from 'react-router-dom';
import { authQueries } from '@/features/auth';
import { useTheme } from '@/providers';
import { Button } from '@/components/ui';
import { getDisplayName } from '@/utils/userRoles';
import type { User } from '@/types';

const NAV = [
  { to: '/projects', label: 'Проекты' },
  { to: '/users', label: 'Пользователи' },
  { to: '/roles', label: 'Роли' },
  { to: '/settings', label: 'Настройки' },
  { to: '/reports', label: 'Отчёты' },
];

export function AppHeader({ user }: { user: User }) {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const logout = authQueries.useLogout();

  return (
    <header className="app-header">
      <div className="app-brand">
        <img src="/TPUlogo.ico" alt="" />
        <span>Витрина · Админ</span>
      </div>
      <nav className="app-nav">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => (isActive ? 'active' : undefined)}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="app-header-actions">
        <Button variant="ghost" size="sm" onClick={toggleTheme}>
          {theme === 'dark' ? 'Светлая' : 'Тёмная'}
        </Button>
        <div className="user-menu">
          <div className="user-menu-meta">
            <div>{getDisplayName(user)}</div>
            <div className="muted">{user.email}</div>
          </div>
          <Button
            size="sm"
            variant="secondary"
            loading={logout.isPending}
            onClick={() =>
              logout.mutate(undefined, {
                onSettled: () => navigate('/login', { replace: true }),
              })
            }
          >
            Выйти
          </Button>
        </div>
      </div>
    </header>
  );
}
