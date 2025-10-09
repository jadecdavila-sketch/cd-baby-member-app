import type { Meta, StoryObj } from '@storybook/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider as JotaiProvider } from 'jotai';
import { within, waitFor, expect } from 'storybook/test';

import {
  useExampleCharactersList,
  useExampleCharacter,
} from '@/shared/state/example/use-example';
import type { ExampleCharacter } from '@/shared/types/example';

// Utility function to format character name
const formatCharacterName = (name: ExampleCharacter['name']): string => {
  const parts = [name.first, name.middle, name.last].filter(Boolean);
  return parts.join(' ');
};

// Storybook Providers Decorator
const StorybookProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1, // Allow one retry for real API calls
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <JotaiProvider>{children}</JotaiProvider>
    </QueryClientProvider>
  );
};

// Character Card Component (inline)
const CharacterCard = ({ characterId }: { characterId: number }) => {
  const { data: character, isLoading } = useExampleCharacter(characterId);

  if (isLoading) {
    return (
      <div className="w-80 animate-pulse rounded-lg border p-4">
        <div className="mb-4 h-48 rounded bg-gray-200"></div>
        <div className="mb-2 h-4 rounded bg-gray-200"></div>
        <div className="mb-1 h-3 rounded bg-gray-200"></div>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="w-80 rounded-lg border p-4 text-center text-gray-500">
        Character not found
      </div>
    );
  }

  const characterName = formatCharacterName(character.name);
  
  return (
    <div className="w-80 rounded-lg border p-4 transition-shadow hover:shadow-md">
      <img
        src={character.images.main}
        alt={characterName}
        className="mb-4 h-48 w-full rounded object-cover"
        onError={(e) => {
          (e.target as HTMLImageElement).src =
            `https://via.placeholder.com/150x200/3498db/ffffff?text=${encodeURIComponent(characterName)}`;
        }}
      />
      <h3 className="mb-2 text-lg font-bold">{characterName}</h3>
      <div className="space-y-1 text-sm text-gray-600">
        <p>
          <strong>Species:</strong> {character.species}
        </p>
        <p>
          <strong>Occupation:</strong> {character.occupation}
        </p>
        <p>
          <strong>Age:</strong> {character.age}
        </p>
        <p>
          <strong>Home Planet:</strong> {character.homePlanet}
        </p>
        {character.sayings.length > 0 && (
          <div>
            <strong>Famous Quote:</strong>
            <p className="italic">&ldquo;{character.sayings[0]}&rdquo;</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Characters List Component (inline)
const CharactersList = () => {
  const {
    data: characters,
    isLoading,
    error,
    isError,
  } = useExampleCharactersList();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="animate-pulse rounded-lg border p-4">
            <div className="mb-4 h-48 rounded bg-gray-200"></div>
            <div className="mb-2 h-4 rounded bg-gray-200"></div>
            <div className="h-3 rounded bg-gray-200"></div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 text-center text-red-600">
        <h3 className="mb-2 text-lg font-semibold">Error loading characters</h3>
        <p>{error?.message ?? 'Something went wrong'}</p>
      </div>
    );
  }

  if (characters.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <h3 className="mb-2 text-lg font-semibold">No characters found</h3>
        <p>The character database appears to be empty.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="mb-4 text-2xl font-bold">
        Futurama Characters ({characters.length})
      </h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {characters.map((character) => (
          <div
            key={character.id}
            className="transition-transform hover:scale-105"
            data-testid={`character-${character.id}`}
          >
            <CharacterCard characterId={character.id} />
          </div>
        ))}
      </div>
    </div>
  );
};

// Individual Character Demo Component (inline)
const CharacterDemo = ({ characterId }: { characterId: number }) => {
  return (
    <div className="mx-auto max-w-md">
      <h2 className="mb-4 text-xl font-bold">Individual Character Demo</h2>
      <p className="mb-4 text-gray-600">
        This demonstrates the atomFamily pattern - each character has its own
        atom.
      </p>
      <CharacterCard characterId={characterId} />
    </div>
  );
};

// Multiple Characters Demo Component (inline)
const MultipleCharactersDemo = () => {
  const { data: characters } = useExampleCharactersList();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h2 className="mb-4 text-xl font-bold">Multiple Characters Demo</h2>
        <p className="mb-4 text-gray-600">
          Demonstrates how atomFamily efficiently manages multiple character
          instances.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {characters.slice(0, 6).map((char) => (
          <CharacterCard key={char.id} characterId={char.id} />
        ))}
      </div>

      <div className="rounded-lg bg-blue-50 p-4">
        <h3 className="mb-2 font-semibold text-blue-900">
          AtomFamily Benefits:
        </h3>
        <ul className="space-y-1 text-sm text-blue-800">
          <li>• Each character has its own atom instance</li>
          <li>
            • Updates to one character don&apos;t trigger re-renders of others
          </li>
          <li>• Automatic cleanup when characters are no longer used</li>
          <li>• Efficient memory usage with lazy atom creation</li>
        </ul>
      </div>
    </div>
  );
};

// Meta configuration
const meta: Meta = {
  title: 'Examples/State Management/Jotai + TanStack Query',
  decorators: [
    (Story) => (
      <StorybookProviders>
        <div className="mx-auto max-w-6xl p-6">
          <Story />
        </div>
      </StorybookProviders>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component: `
# Jotai + TanStack Query Integration Example

This example demonstrates modern React state management patterns using real data from the Futurama Characters API:

- **atomWithQuery**: Server state management with automatic caching
- **atomFamily**: Individual item state management for scalability  
- **Custom Hooks**: Clean abstraction layer for components
- **TypeScript**: Full type safety across the entire flow

## Key Features

- 🔄 **Automatic Caching**: TanStack Query handles server state caching
- ⚡ **Performance**: AtomFamily prevents unnecessary re-renders
- 🎯 **Type Safety**: Full TypeScript integration
- 🧪 **Testable**: Isolated atoms make testing easier
- 🔧 **Maintainable**: Clear separation of concerns
- 🌐 **Real Data**: Uses live Futurama Characters API

## Architecture

1. **API Layer**: Axios client with structured query keys
2. **Atom Layer**: Jotai atoms for state management
3. **Hook Layer**: Custom hooks for component consumption
4. **Component Layer**: React components using the hooks

## Usage Patterns

- Use \`useExampleCharactersList()\` for the complete list
- Use \`useExampleCharacter(id)\` for individual characters
- Use \`useSelectedCharacter()\` for UI selection state
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Stories
export const CharactersListStory: Story = {
  name: '📝 Characters List',
  render: () => <CharactersList />,
  parameters: {
    docs: {
      description: {
        story: `
Demonstrates fetching a list of characters using \`atomWithQuery\` from the real Futurama Characters API. Shows loading states, error handling, and character selection with \`atomFamily\`.

**Key Features:**
- Real API data from https://api.sampleapis.com/futurama/characters
- Loading skeleton states
- Error boundaries
- Interactive character selection
- Responsive grid layout
        `,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Wait for characters to load from API
    await waitFor(
      () => {
        expect(canvas.getByText(/Futurama Characters/)).toBeInTheDocument();
      },
      { timeout: 10000 }
    );

    // Wait for character cards to render
    await waitFor(
      () => {
        const characterCards = canvas.getAllByTestId(/character-/);
        expect(characterCards.length).toBeGreaterThan(0);
      },
      { timeout: 5000 }
    );

    // Verify characters are displayed
    const characterCards = canvas.getAllByTestId(/character-/);
    expect(characterCards.length).toBeGreaterThan(0);
  },
};

export const IndividualCharacterStory: Story = {
  name: '🎭 Individual Character',
  render: (args) => <CharacterDemo characterId={args.characterId} />,
  args: {
    characterId: 1,
  },
  argTypes: {
    characterId: {
      control: { type: 'number', min: 1, max: 20, step: 1 },
      description: 'Enter a character ID (1-20) to see atomFamily in action',
    },
  },
  parameters: {
    docs: {
      description: {
        story: `
Shows how individual characters are managed using \`atomFamily\`. Each character gets its own atom, preventing unnecessary re-renders when other characters update.

**AtomFamily Benefits:**
- Individual atoms per character ID  
- Automatic cleanup when not used
- Efficient memory usage
- Isolated updates
- Works with real API data
        `,
      },
    },
  },
};

export const MultipleCharactersStory: Story = {
  name: '🎯 Multiple Characters',
  render: () => <MultipleCharactersDemo />,
  parameters: {
    docs: {
      description: {
        story: `
Demonstrates how atomFamily efficiently manages multiple character instances. Each character gets its own atom, preventing unnecessary re-renders and enabling efficient state management.

**AtomFamily Benefits:**
- Individual atoms per character ID
- Efficient memory usage with lazy creation
- Automatic cleanup when not used
- Isolated updates prevent cascading re-renders
- Real-time data from Futurama API
        `,
      },
    },
  },
};
