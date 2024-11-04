"use client";
import { useState, useMemo, useCallback } from 'react';

export function useSortableData<T extends Record<string, any>>(data: T[], config = null) {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T | string;
    direction: 'asc' | 'desc';
  } | null>(config);

  const getNestedValue = (obj: any, path: string): any => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  };

  const sortedData = useMemo(() => {
    let sortableData = [...data];
    if (sortConfig !== null) {
      sortableData.sort((a, b) => {
        const aValue = getNestedValue(a, sortConfig.key as string);
        const bValue = getNestedValue(b, sortConfig.key as string);

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableData;
  }, [data, sortConfig]);

  const requestSort = useCallback(
    (key: keyof T | string) => {
      let direction: 'asc' | 'desc' = 'asc';
      if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
        direction = 'desc';
      }
      setSortConfig({ key, direction });
    },
    [sortConfig]
  );

  return { sortedData, requestSort, sortConfig };
}
