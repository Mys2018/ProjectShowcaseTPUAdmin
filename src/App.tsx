import { Navigate, Route, Routes } from 'react-router-dom';
import {
  RequireAuth,
  RequireStaff,
} from '@/features/auth/components/RequireAuth';
import { AdminLayout, AuthLayout } from '@/layouts/AdminLayout';
import { LoginPage } from '@/pages/auth/LoginPage';
import { CallbackPage } from '@/pages/auth/CallbackPage';
import { ProjectsPage } from '@/pages/projects/ProjectsPage';
import { ProjectDetailPage } from '@/pages/projects/ProjectDetailPage';
import { ProjectCreatePage } from '@/pages/projects/ProjectCreatePage';
import { ProjectEditPage } from '@/pages/projects/ProjectEditPage';
import { UsersPage } from '@/pages/users/UsersPage';
import { UserDetailPage } from '@/pages/users/UserDetailPage';
import { RolesPage } from '@/pages/roles/RolesPage';
import { ReportsPage } from '@/pages/reports/ReportsPage';
import { SettingsLayout } from '@/pages/settings/SettingsLayout';
import { PartnersPage } from '@/pages/settings/PartnersPage';
import { TagsPage } from '@/pages/settings/TagsPage';
import { PlatformsPage } from '@/pages/settings/PlatformsPage';
import { CheckpointsPage } from '@/pages/settings/CheckpointsPage';
import { ComplaintsPage } from '@/pages/settings/ComplaintsPage';
import { ForbiddenPage, NotFoundPage } from '@/pages/errors/ErrorPages';

export default function App() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth/callback" element={<CallbackPage />} />
      </Route>

      <Route path="/forbidden" element={<ForbiddenPage />} />

      <Route element={<RequireAuth />}>
        <Route element={<RequireStaff />}>
          <Route element={<AdminLayout />}>
            <Route path="/" element={<Navigate to="/projects" replace />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/new" element={<ProjectCreatePage />} />
            <Route path="/projects/:projectId/edit" element={<ProjectEditPage />} />
            <Route path="/projects/:projectId" element={<ProjectDetailPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/users/:userId" element={<UserDetailPage />} />
            <Route path="/roles" element={<RolesPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/settings" element={<SettingsLayout />}>
              <Route index element={<Navigate to="partners" replace />} />
              <Route path="partners" element={<PartnersPage />} />
              <Route path="checkpoints" element={<CheckpointsPage />} />
              <Route path="tags" element={<TagsPage />} />
              <Route path="platforms" element={<PlatformsPage />} />
              <Route path="complaints" element={<ComplaintsPage />} />
            </Route>
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
