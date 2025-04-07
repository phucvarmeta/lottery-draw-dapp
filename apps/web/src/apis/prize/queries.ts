import { createQuery } from 'react-query-kit';
import { getCurrentDraw } from './requests';
import { IDraw } from './types';

export const useGetCurrentDraw = createQuery<IDraw, string, Error>({
  queryKey: ['current-draw'],
  fetcher: getCurrentDraw,
});
