import { IPaging } from '@/types';
import { useCallback, useState } from 'react';

interface State<T extends object = any> {
  paging: IPaging;
  filter: T;
}

export const usePaging = <T extends object>(limit: number, initFilter: T) => {
  const [state, setState] = useState<State<T>>({
    paging: {
      limit,
      page: 1,
      total: 0,
    },
    filter: initFilter,
  });

  const onTotalItemsChange = useCallback((totalItems: number) => {
    setState((pre) => ({
      ...pre,
      paging: {
        ...pre.paging,
        total: totalItems,
      },
    }));
  }, []);

  const onPageChange = useCallback((currentPage: number) => {
    setState((pre) => ({
      ...pre,
      paging: {
        ...pre.paging,
        page: currentPage,
      },
    }));
  }, []);

  const onPageSizeChange = useCallback((currentSize: number) => {
    setState((pre) => ({
      ...pre,
      paging: {
        ...pre.paging,
        limit: currentSize,
      },
    }));
  }, []);

  const handleFilterChange = useCallback(<TKey extends keyof T>(key: TKey, value: T[TKey]) => {
    setState((pre) => ({
      ...pre,
      filter: {
        ...pre.filter,
        [key]: value,
      },
    }));
  }, []);

  return {
    paging: state.paging,
    filter: state.filter,
    onPageChange,
    onPageSizeChange,
    onTotalItemsChange,
    handleFilterChange,
  };
};
