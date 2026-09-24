import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

interface Options {
  defaultLimit?: number;
  prefix?: string;
}

export function usePagination({ defaultLimit = 20, prefix = '' }: Options = {}) {
  const [params, setParams] = useSearchParams();
  const offsetKey = `${prefix}offset`;
  const limitKey = `${prefix}limit`;

  const offset = Number(params.get(offsetKey) || 0) || 0;
  const limit = Number(params.get(limitKey) || defaultLimit) || defaultLimit;

  const setPage = useCallback(
    (nextOffset: number, nextLimit = limit) => {
      setParams((prev) => {
        const next = new URLSearchParams(prev);
        next.set(offsetKey, String(Math.max(0, nextOffset)));
        next.set(limitKey, String(nextLimit));
        return next;
      });
    },
    [limit, limitKey, offsetKey, setParams],
  );

  const page = useMemo(
    () => Math.floor(offset / Math.max(limit, 1)) + 1,
    [offset, limit],
  );

  return { offset, limit, page, setPage, params, setParams };
}
