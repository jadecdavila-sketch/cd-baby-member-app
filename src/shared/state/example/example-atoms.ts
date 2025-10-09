import { atom } from 'jotai';
import { atomFamily } from 'jotai/utils';
import { atomWithQuery } from 'jotai-tanstack-query';

import { exampleApi, exampleQueryKeys } from '@/api/src/example-api';

// Characters list query
export const charactersListQueryAtom = atomWithQuery(() => ({
  queryKey: exampleQueryKeys.lists(),
  queryFn: async () => await exampleApi.getCharacters(),
  staleTime: 5 * 60 * 1000,
  refetchOnWindowFocus: false,
}));

// Read-only character atom family
export const characterAtomFamily = atomFamily((id: number) =>
  atom((get) => {
    const charactersQuery = get(charactersListQueryAtom);
    return charactersQuery.data?.find((char) => char.id === id) ?? null;
  })
);
