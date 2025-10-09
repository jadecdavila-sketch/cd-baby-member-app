import { useAtomValue } from 'jotai';

import { charactersListQueryAtom, characterAtomFamily } from './example-atoms';

/**
 * Hook to get the complete list of Futurama characters
 * Uses TanStack Query through Jotai's atomWithQuery for caching and background refetching
 */
export const useExampleCharactersList = () => {
  const queryResult = useAtomValue(charactersListQueryAtom);

  return {
    data: queryResult.data ?? [],
    isLoading: queryResult.isLoading,
    error: queryResult.error,
    isError: queryResult.isError,
    refetch: queryResult.refetch,
  };
};

/**
 * Hook to get a specific character by ID from the atomFamily
 * First checks if character is available in the list, then falls back to individual fetch
 */
export const useExampleCharacter = (id: number) => {
  const character = useAtomValue(characterAtomFamily(id));

  return {
    data: character,
    isLoading: character === null, // Simple loading state - could be enhanced
    error: null, // Could be enhanced with proper error handling
    isError: false,
  };
};
