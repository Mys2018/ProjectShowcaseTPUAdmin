import { NavLink, Outlet } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';

const LINKS = [
  { to: '/settings/partners', label: 'Партнёры' },
  { to: '/settings/checkpoints', label: 'Чекпоинты' },
  { to: '/settings/tags', label: 'Теги' },
  { to: '/settings/platforms', label: 'Платформы' },
  { to: '/settings/complaints', label: 'Жалобы' },
];

export function SettingsLayout() {
  return (
    <div>
      <PageHeader
        title="Настройки"
        description="Справочники платформы и модерация жалоб"
      />
      <div className="settings-layout">
        <nav className="settings-nav card" style={{ padding: 12 }}>
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => (isActive ? 'active' : undefined)}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
