import { useMemo, useState } from 'react';
import { partnersQueries } from '@/features/partners/api/partners.queries';
import { tagsQueries } from '@/features/tags/api/tags.queries';
import { checkpointsQueries } from '@/features/checkpoints/api/checkpoints.queries';
import { roleTypesQueries } from '@/features/roleTypes/api/roleTypes.queries';
import {
  Button,
  Field,
  Input,
  Select,
  Textarea,
} from '@/components/ui';
import type {
  CreateProjectRequest,
  ProjectCheckpoint,
  ProjectResponse,
  ProjectType,
  UpdateProjectRequest,
} from '@/types';
import { getProjectType } from '@/utils/projectStatus';

type Mode = 'create' | 'edit';

interface ProjectFormProps {
  mode: Mode;
  initial?: ProjectResponse | null;
  onSubmit: (payload: CreateProjectRequest | UpdateProjectRequest) => void;
  submitting: boolean;
}

function splitLines(value: string): string[] {
  return value
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);
}

function joinLines(arr?: string[]): string {
  return (arr ?? []).join('\n');
}

export function ProjectForm({ mode, initial, onSubmit, submitting }: ProjectFormProps) {
  const isEdit = mode === 'edit';
  const initialType = initial ? getProjectType(initial) : 'Study';

  const [type, setType] = useState<ProjectType>(initialType);
  const [title, setTitle] = useState(initial?.meta.title ?? '');
  const [description, setDescription] = useState(initial?.meta.description ?? '');
  const [partnerId, setPartnerId] = useState(initial?.partner.projectPartnerId ?? '');
  const [checkpointsId, setCheckpointsId] = useState(initial?.checkpoints.id ?? '');
  const [primaryTagId, setPrimaryTagId] = useState(initial?.primaryTag.tagId ?? '');
  const [tagIds, setTagIds] = useState<string[]>(
    () => initial?.tags?.map((t) => t.tagId) ?? [],
  );

  const [customCheckpoints, setCustomCheckpoints] = useState<ProjectCheckpoint[]>(
    () => initial?.customCheckpoints ?? [],
  );
  const [roles, setRoles] = useState<
    Array<{ roleTypeId: string; placesCount: number; minPlacesCount: number; skillIds?: string[] }>
  >(
    () =>
      (initial?.roles ?? []).map((r) => ({
        roleTypeId: r.roleType.id,
        placesCount: r.placesCount,
        minPlacesCount: r.minPlacesCount,
      })),
  );

  const prd = initial?.prdMeta as Record<string, unknown> | undefined;

  const [prerequisites, setPrerequisites] = useState(
    (prd?.prerequisites as string) ?? '',
  );
  const [projectGoal, setProjectGoal] = useState((prd?.projectGoal as string) ?? '');
  const [problemStatement, setProblemStatement] = useState(
    (prd?.problemStatement as string) ?? '',
  );
  const [productVision, setProductVision] = useState(
    (prd?.productVision as string) ?? '',
  );
  const [businessGoal, setBusinessGoal] = useState((prd?.businessGoal as string) ?? '');
  const [keyFunctionality, setKeyFunctionality] = useState(
    joinLines(prd?.keyFunctionality as string[] | undefined),
  );
  const [functional, setFunctional] = useState(
    joinLines(prd?.functional as string[] | undefined),
  );
  const [nonFunctional, setNonFunctional] = useState(
    joinLines(prd?.nonFunctional as string[] | undefined),
  );
  const [businessMetrics, setBusinessMetrics] = useState(
    joinLines(prd?.businessMetrics as string[] | undefined),
  );
  const [projectPlan, setProjectPlan] = useState(
    joinLines(prd?.projectPlan as string[] | undefined),
  );
  const [error, setError] = useState<string | null>(null);

  const partners = partnersQueries.useList({ offset: 0, limit: 100 });
  const tagsGrouped = tagsQueries.useGrouped();
  const checkpoints = checkpointsQueries.useList({ offset: 0, limit: 50 });
  const roleTypes = roleTypesQueries.useList();

  const allTags = useMemo(
    () => (tagsGrouped.data ?? []).flatMap((g) => g.tags ?? []),
    [tagsGrouped.data],
  );

  const validate = (): string | null => {
    if (!title.trim()) return 'Укажите название';
    if (!description.trim()) return 'Укажите описание';
    if (!isEdit) {
      if (!partnerId) return 'Выберите партнёра';
      if (!checkpointsId) return 'Выберите набор чекпоинтов';
      if (!primaryTagId) return 'Выберите основной тег';
    }
    if (type === 'Study') {
      if (!prerequisites.trim()) return 'Укажите prerequisites';
      if (!projectGoal.trim()) return 'Укажите цель проекта';
    }
    if (type === 'Case') {
      if (!prerequisites.trim()) return 'Укажите prerequisites';
      if (!projectGoal.trim()) return 'Укажите цель проекта';
      if (!problemStatement.trim()) return 'Укажите постановку проблемы';
    }
    if (type === 'Real') {
      if (!productVision.trim()) return 'Укажите видение продукта';
      if (!projectGoal.trim()) return 'Укажите цель проекта';
      if (!businessGoal.trim()) return 'Укажите бизнес-цель';
    }
    return null;
  };

  const handleSubmit = () => {
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setError(null);

    if (!isEdit) {
      const base = {
        partnerId,
        meta: { title: title.trim(), description: description.trim() },
        checkpoints: checkpointsId,
        customCheckpoints: customCheckpoints.length ? customCheckpoints : undefined,
        roles: roles.length ? roles : undefined,
        primaryTagId,
        tagIds: tagIds.length ? tagIds : undefined,
      };

      if (type === 'Study') {
        onSubmit({
          ...base,
          type: 'Study',
          prdMeta: {
            prerequisites: prerequisites.trim(),
            projectGoal: projectGoal.trim(),
            keyFunctionality: splitLines(keyFunctionality) || undefined,
          },
        } as CreateProjectRequest);
        return;
      }
      if (type === 'Case') {
        onSubmit({
          ...base,
          type: 'Case',
          prdMeta: {
            prerequisites: prerequisites.trim(),
            projectGoal: projectGoal.trim(),
            problemStatement: problemStatement.trim(),
            functional: splitLines(functional) || undefined,
          },
        } as CreateProjectRequest);
        return;
      }
      onSubmit({
        ...base,
        type: 'Real',
        prdMeta: {
          productVision: productVision.trim(),
          projectGoal: projectGoal.trim(),
          businessGoal: businessGoal.trim(),
          functional: splitLines(functional) || undefined,
          nonFunctional: splitLines(nonFunctional) || undefined,
          businessMetrics: splitLines(businessMetrics) || undefined,
          projectPlan: splitLines(projectPlan) || undefined,
        },
      } as CreateProjectRequest);
      return;
    }

    const payload: Record<string, unknown> = {
      type,
      title: title.trim(),
      description: description.trim(),
      primaryTagId: primaryTagId || undefined,
      tagIds: tagIds.length ? tagIds : undefined,
      customCheckpoints: customCheckpoints.length ? customCheckpoints : undefined,
      roles: roles.length
        ? roles.map((r) => ({
            roleTypeId: r.roleTypeId,
            placesCount: r.placesCount,
            minPlacesCount: r.minPlacesCount,
          }))
        : undefined,
    };

    if (type === 'Study') {
      payload.prdMeta = {
        prerequisites: prerequisites.trim(),
        projectGoal: projectGoal.trim(),
        keyFunctionality: splitLines(keyFunctionality) || undefined,
      };
    } else if (type === 'Case') {
      payload.prdMeta = {
        prerequisites: prerequisites.trim(),
        projectGoal: projectGoal.trim(),
        problemStatement: problemStatement.trim(),
        functional: splitLines(functional) || undefined,
      };
    } else {
      payload.prdMeta = {
        productVision: productVision.trim(),
        projectGoal: projectGoal.trim(),
        businessGoal: businessGoal.trim(),
        functional: splitLines(functional) || undefined,
        nonFunctional: splitLines(nonFunctional) || undefined,
        businessMetrics: splitLines(businessMetrics) || undefined,
        projectPlan: splitLines(projectPlan) || undefined,
      };
    }

    onSubmit(payload as unknown as UpdateProjectRequest);
  };

  return (
    <div className="stack">
      {error ? (
        <div className="ui-alert ui-alert-error">{error}</div>
      ) : null}

      <div className="grid-2">
        <Field label="Тип">
          <Select
            value={type}
            onChange={(e) => setType(e.target.value as ProjectType)}
            disabled={isEdit}
          >
            <option value="Study">Учебный</option>
            <option value="Case">Кейс</option>
            <option value="Real">Реальный</option>
          </Select>
        </Field>
        <Field label="Партнёр" hint={isEdit ? 'При редактировании смена партнёра — по поддержке бэка' : undefined}>
          <Select
            value={partnerId}
            onChange={(e) => setPartnerId(e.target.value)}
            disabled={isEdit}
          >
            <option value="">— выберите —</option>
            {(partners.data?.partners ?? []).map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <Field label="Название">
        <Input value={title} onChange={(e) => setTitle(e.target.value)} />
      </Field>
      <Field label="Описание">
        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} />
      </Field>

      <div className="grid-2">
        <Field label="Набор чекпоинтов">
          <Select
            value={checkpointsId}
            onChange={(e) => setCheckpointsId(e.target.value)}
            disabled={isEdit}
          >
            <option value="">— выберите —</option>
            {(checkpoints.data?.checkpoints ?? []).map((c) => (
              <option key={c.id} value={c.id}>
                {c.id} — {(c.checkpoints ?? []).map((x) => x.title).join(' · ').slice(0, 60)}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Основной тег">
          <Select value={primaryTagId} onChange={(e) => setPrimaryTagId(e.target.value)}>
            <option value="">— выберите —</option>
            {allTags.map((t) => (
              <option key={t.tagId} value={t.tagId}>
                {t.tagName}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <Field label="Доп. теги" hint="Выберите несколько, удерживая Ctrl/Cmd">
                <select
          className="ui-select"
          multiple
          value={tagIds}
          onChange={(e) =>
            setTagIds(Array.from(e.target.selectedOptions, (o) => o.value))
          }
          style={{ minHeight: 96 }}
        >
          {allTags.map((t) => (
            <option key={t.tagId} value={t.tagId}>
              {t.tagName}
            </option>
          ))}
        </select>
      </Field>

      <div className="card" style={{ padding: 16 }}>
        <div className="card-title">PRD · {type}</div>
        {type === 'Study' ? (
          <div className="stack">
            <Field label="Prerequisites *">
              <Textarea value={prerequisites} onChange={(e) => setPrerequisites(e.target.value)} rows={3} />
            </Field>
            <Field label="Цель проекта *">
              <Textarea value={projectGoal} onChange={(e) => setProjectGoal(e.target.value)} rows={3} />
            </Field>
            <Field label="Ключевая функциональность (по строке)">
              <Textarea value={keyFunctionality} onChange={(e) => setKeyFunctionality(e.target.value)} rows={3} />
            </Field>
          </div>
        ) : null}
        {type === 'Case' ? (
          <div className="stack">
            <Field label="Prerequisites *">
              <Textarea value={prerequisites} onChange={(e) => setPrerequisites(e.target.value)} rows={3} />
            </Field>
            <Field label="Цель проекта *">
              <Textarea value={projectGoal} onChange={(e) => setProjectGoal(e.target.value)} rows={3} />
            </Field>
            <Field label="Постановка проблемы *">
              <Textarea value={problemStatement} onChange={(e) => setProblemStatement(e.target.value)} rows={3} />
            </Field>
            <Field label="Functional (по строке)">
              <Textarea value={functional} onChange={(e) => setFunctional(e.target.value)} rows={3} />
            </Field>
          </div>
        ) : null}
        {type === 'Real' ? (
          <div className="stack">
            <Field label="Видение продукта *">
              <Textarea value={productVision} onChange={(e) => setProductVision(e.target.value)} rows={3} />
            </Field>
            <Field label="Цель проекта *">
              <Textarea value={projectGoal} onChange={(e) => setProjectGoal(e.target.value)} rows={3} />
            </Field>
            <Field label="Бизнес-цель *">
              <Textarea value={businessGoal} onChange={(e) => setBusinessGoal(e.target.value)} rows={3} />
            </Field>
            <Field label="Functional (по строке)">
              <Textarea value={functional} onChange={(e) => setFunctional(e.target.value)} rows={3} />
            </Field>
            <Field label="Non-functional (по строке)">
              <Textarea value={nonFunctional} onChange={(e) => setNonFunctional(e.target.value)} rows={3} />
            </Field>
            <Field label="Бизнес-метрики (по строке)">
              <Textarea value={businessMetrics} onChange={(e) => setBusinessMetrics(e.target.value)} rows={3} />
            </Field>
            <Field label="План проекта (по строке)">
              <Textarea value={projectPlan} onChange={(e) => setProjectPlan(e.target.value)} rows={3} />
            </Field>
          </div>
        ) : null}
      </div>

      <div className="card" style={{ padding: 16 }}>
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <div className="card-title" style={{ marginBottom: 0 }}>
            Роли
          </div>
          <Button
            size="sm"
            onClick={() =>
              setRoles([
                ...roles,
                { roleTypeId: roleTypes.data?.[0]?.id ?? '', placesCount: 1, minPlacesCount: 1 },
              ])
            }
          >
            + Роль
          </Button>
        </div>
        <div className="stack" style={{ marginTop: 12 }}>
          {roles.length === 0 ? <span className="muted">Роли не добавлены</span> : null}
          {roles.map((role, index) => (
            <div key={index} className="row" style={{ alignItems: 'end' }}>
              <Field label="Компетенция">
                <Select
                  value={role.roleTypeId}
                  onChange={(e) => {
                    const next = [...roles];
                    next[index] = { ...next[index], roleTypeId: e.target.value };
                    setRoles(next);
                  }}
                >
                  <option value="">— выберите —</option>
                  {(roleTypes.data ?? []).map((rt) => (
                    <option key={rt.id} value={rt.id}>
                      {rt.name}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Мест">
                <Input
                  type="number"
                  min={1}
                  value={String(role.placesCount)}
                  onChange={(e) => {
                    const next = [...roles];
                    next[index] = { ...next[index], placesCount: Number(e.target.value) || 0 };
                    setRoles(next);
                  }}
                  style={{ width: 90 }}
                />
              </Field>
              <Field label="Мин.">
                <Input
                  type="number"
                  min={1}
                  value={String(role.minPlacesCount)}
                  onChange={(e) => {
                    const next = [...roles];
                    next[index] = {
                      ...next[index],
                      minPlacesCount: Number(e.target.value) || 0,
                    };
                    setRoles(next);
                  }}
                  style={{ width: 90 }}
                />
              </Field>
              <Button size="sm" variant="ghost" onClick={() => setRoles(roles.filter((_, i) => i !== index))}>
                ×
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ padding: 16 }}>
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <div className="card-title" style={{ marginBottom: 0 }}>
            Доп. чекпоинты
          </div>
          <Button size="sm" onClick={() => setCustomCheckpoints([...customCheckpoints, { title: '', deadline: '' }])}>
            + Чекпоинт
          </Button>
        </div>
        <div className="stack" style={{ marginTop: 12 }}>
          {customCheckpoints.length === 0 ? <span className="muted">Нет</span> : null}
          {customCheckpoints.map((cp, index) => (
            <div key={index} className="row" style={{ alignItems: 'end' }}>
              <Field label={`Название #${index + 1}`}>
                <Input
                  value={cp.title}
                  onChange={(e) => {
                    const next = [...customCheckpoints];
                    next[index] = { ...next[index], title: e.target.value };
                    setCustomCheckpoints(next);
                  }}
                />
              </Field>
              <Field label="Дедлайн">
                <Input
                  type="date"
                  value={cp.deadline}
                  onChange={(e) => {
                    const next = [...customCheckpoints];
                    next[index] = { ...next[index], deadline: e.target.value };
                    setCustomCheckpoints(next);
                  }}
                />
              </Field>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setCustomCheckpoints(customCheckpoints.filter((_, i) => i !== index))}
              >
                ×
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="row">
        <Button variant="primary" loading={submitting} onClick={handleSubmit}>
          {isEdit ? 'Сохранить' : 'Создать'}
        </Button>
      </div>
    </div>
  );
}
