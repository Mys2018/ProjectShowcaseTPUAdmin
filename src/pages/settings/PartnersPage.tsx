import { useMemo, useState } from 'react';
import { partnersQueries } from '@/features/partners/api/partners.queries';
import { filesQueries } from '@/features/files/api/files.queries';
import {
  Alert,
  Button,
  Field,
  FileButton,
  Input,
  Modal,
  PageLoader,
  Pagination,
  SearchInput,
  Table,
} from '@/components/ui';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { usePagination } from '@/hooks/usePagination';
import { getErrorMessage } from '@/api/errors';
import { useToast } from '@/providers';
import type { PartnerResponse } from '@/types';

export function PartnersPage() {
  useDocumentTitle('Партнёры');
  const toast = useToast();
  const { offset, limit, setPage } = usePagination({ defaultLimit: 20 });
  const [query, setQuery] = useState('');
  const debounced = useDebouncedValue(query);
  const params = useMemo(
    () => ({ offset, limit, query: debounced || undefined }),
    [offset, limit, debounced],
  );
  const list = partnersQueries.useList(params);
  const create = partnersQueries.useCreate();
  const upload = filesQueries.useUpload();

  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  const onCreate = () => {
    if (!name.trim()) return;
    create.mutate(
      {
        name: name.trim(),
        profilePicture: avatarUrl || undefined,
      },
      {
        onSuccess: () => {
          toast.success('Партнёр создан');
          setOpen(false);
          setName('');
          setAvatarUrl('');
        },
        onError: (err) => toast.error(getErrorMessage(err)),
      },
    );
  };

  return (
    <div>
      <div className="toolbar">
        <div className="toolbar-grow">
          <SearchInput value={query} onChange={setQuery} placeholder="Поиск партнёров" />
        </div>
        <Button variant="primary" onClick={() => setOpen(true)}>
          Добавить партнёра
        </Button>
      </div>

      {list.isLoading ? <PageLoader /> : null}
      {list.isError ? <Alert tone="error">{getErrorMessage(list.error)}</Alert> : null}

      {list.data ? (
        <div className="card" style={{ padding: 0 }}>
          <Table<PartnerResponse>
            rows={list.data.partners ?? []}
            rowKey={(row) => row.id}
            columns={[
              {
                key: 'avatar',
                header: '',
                width: '56px',
                render: (row) =>
                  row.profilePicture ? (
                    <img
                      src={row.profilePicture}
                      alt=""
                      width={32}
                      height={32}
                      style={{ borderRadius: 8, objectFit: 'cover' }}
                    />
                  ) : (
                    '—'
                  ),
              },
              {
                key: 'name',
                header: 'Название',
                render: (row) => row.name,
              },
              {
                key: 'id',
                header: 'ID',
                render: (row) => <span className="mono muted">{row.id}</span>,
              },
            ]}
          />
          <div style={{ padding: 16 }}>
            <Pagination
              total={list.data.total}
              offset={list.data.offset}
              limit={list.data.limit}
              onChange={setPage}
            />
          </div>
        </div>
      ) : null}

      <p className="muted text-sm" style={{ marginTop: 12 }}>
        API не поддерживает редактирование и удаление партнёров — только создание.
      </p>

      <Modal
        open={open}
        title="Новый партнёр"
        onClose={() => setOpen(false)}
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Отмена
            </Button>
            <Button variant="primary" loading={create.isPending} onClick={onCreate}>
              Создать
            </Button>
          </>
        }
      >
        <div className="stack">
          <Field label="Название">
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
          <Field label="Аватар (URL)" hint="Можно загрузить файл — URL подставится автоматически">
            <Input value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} />
          </Field>
          <FileButton
            label="Загрузить аватар"
            accept="image/*"
            loading={upload.isPending}
            onFile={(file) => {
              upload.mutate(file, {
                onSuccess: (res) => {
                  setAvatarUrl(res.url);
                  toast.success('Файл загружен');
                },
                onError: (err) => toast.error(getErrorMessage(err)),
              });
            }}
          />
        </div>
      </Modal>
    </div>
  );
}
