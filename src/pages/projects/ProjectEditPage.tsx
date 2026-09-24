import { useNavigate, useParams } from 'react-router-dom';
import { projectsQueries } from '@/features/projects/api/projects.queries';
import { ProjectForm } from '@/features/projects/components/ProjectForm';
import { PageHeader } from '@/components/layout/PageHeader';
import { Alert, Button, PageLoader } from '@/components/ui';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { getErrorMessage } from '@/api/errors';
import { useToast } from '@/providers';
import type { UpdateProjectRequest } from '@/types';

export function ProjectEditPage() {
  const { projectId = '' } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const detail = projectsQueries.useDetail(projectId);
  const update = projectsQueries.useUpdate(projectId);

  useDocumentTitle(detail.data ? `Редактировать · ${detail.data.meta.title}` : 'Редактировать проект');

  if (detail.isLoading) return <PageLoader />;
  if (detail.isError || !detail.data) {
    return <Alert tone="error">{getErrorMessage(detail.error, 'Проект не найден')}</Alert>;
  }

  return (
    <div>
      <PageHeader
        title="Редактировать проект"
        description={detail.data.meta.title}
        actions={
          <Button variant="ghost" onClick={() => navigate(`/projects/${projectId}`)}>
            ← К проекту
          </Button>
        }
      />
      <ProjectForm
        mode="edit"
        initial={detail.data}
        submitting={update.isPending}
        onSubmit={(payload) => {
          update.mutate(payload as UpdateProjectRequest, {
            onSuccess: () => {
              toast.success('Проект обновлён');
              navigate(`/projects/${projectId}`);
            },
            onError: (err) => toast.error(getErrorMessage(err)),
          });
        }}
      />
    </div>
  );
}
