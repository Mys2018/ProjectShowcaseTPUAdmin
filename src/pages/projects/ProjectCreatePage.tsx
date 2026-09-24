import { useNavigate } from 'react-router-dom';
import { projectsQueries } from '@/features/projects/api/projects.queries';
import { ProjectForm } from '@/features/projects/components/ProjectForm';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { getErrorMessage } from '@/api/errors';
import { useToast } from '@/providers';
import type { CreateProjectRequest } from '@/types';

export function ProjectCreatePage() {
  useDocumentTitle('Новый проект');
  const navigate = useNavigate();
  const toast = useToast();
  const create = projectsQueries.useCreate();

  const handleSubmit = (payload: CreateProjectRequest) => {
    create.mutate(payload as CreateProjectRequest, {
      onSuccess: (res) => {
        toast.success('Проект создан');
        navigate(`/projects/${res.projectId}`);
      },
      onError: (err) => toast.error(getErrorMessage(err)),
    });
  };

  return (
    <div>
      <PageHeader
        title="Новый проект"
        description="Создайте проект типа Учебный, Кейс или Реальный"
        actions={
          <Button variant="ghost" onClick={() => navigate('/projects')}>
            ← К списку
          </Button>
        }
      />
      <ProjectForm
        mode="create"
        onSubmit={(payload) => handleSubmit(payload as CreateProjectRequest)}
        submitting={create.isPending}
      />
    </div>
  );
}
