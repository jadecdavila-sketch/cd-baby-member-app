This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Storybook Testing  

We use **Storybook Test Runner** to validate UI components using Playwright. This ensures that components behave as expected within Storybook. For more information can check the [Test runner](https://storybook.js.org/docs/writing-tests/component-testing) and [Storybook Tests](https://storybook.js.org/docs/writing-tests/component-testing) documentations.


#### Running Storybook Tests  
To execute the Storybook Test Runner, run:  

```sh
npm run test-storybook
```
This command will:

- Run interactive tests defined in Storybook stories using the play function.

- Validate accessibility, interactions, and component states.

If you need to install Playwright for Storybook testing, run:
```sh
npx playwright install
```

### Test Automation 
We also use storybook-addon-test-codegen to automatically generate test cases from Storybook interactions. You can also check the addon [Documentation](https://www.npmjs.com/package/storybook-addon-test-codegen?activeTab=readme)

## Jotai + TanStack Query Example

This project includes a comprehensive example demonstrating how to integrate **Jotai** with **TanStack Query** for efficient state management. The example uses the [Futurama Characters API](https://api.sampleapis.com/futurama/characters) to showcase modern React patterns.

### 🚀 Key Features Demonstrated

- **atomWithQuery**: Server state management with automatic caching and background refetching
- **atomFamily**: Individual item state management for scalable applications  
- **Custom Hooks**: Clean abstraction layer for component consumption
- **TypeScript Integration**: Full type safety across the entire data flow
- **Axios Integration**: Robust HTTP client with proper error handling
- **Query Keys Pattern**: Structured cache management following TanStack Query best practices

### 📁 Example Structure

```
src/
├── shared/
│   ├── types/example.ts              # TypeScript definitions
│   └── state/example/
│       ├── example-atoms.ts          # Jotai atoms (atomWithQuery + atomFamily)
│       └── use-example.ts            # Custom hooks for components
└── api/src/example-api/
    ├── example-api.ts                # Axios client + Query keys
    └── index.ts                      # API exports
```

### 🔧 Implementation Details

#### **1. Types** (`src/shared/types/example.ts`)
```typescript
export type ExampleCharacter = {
  id: number;
  name: string;
  images: { main: string };
  gender: string;
  species: string;
  occupation: string;
  sayings: string[];
  homePlanet: string;
  age: string;
};
```

#### **2. API Client** (`src/api/src/example-api/example-api.ts`)
- Dedicated Axios instance with proper configuration
- Structured query keys for consistent caching:
```typescript
export const exampleQueryKeys = {
  all: ['example-characters'] as const,
  lists: () => [...exampleQueryKeys.all, 'list'] as const,
  details: () => [...exampleQueryKeys.all, 'detail'] as const,
  detail: (id: number) => [...exampleQueryKeys.details(), id] as const,
};
```

#### **3. Jotai Atoms** (`src/shared/state/example/example-atoms.ts`)
- **`charactersListQueryAtom`**: Uses `atomWithQuery` for the complete list
- **`characterAtomFamily`**: Uses `atomFamily` for individual character access
- Automatic data synchronization between list and individual items

#### **4. Custom Hooks** (`src/shared/state/example/use-example.ts`)
- **`useExampleCharactersList()`**: Access complete characters list
- **`useExampleCharacter(id)`**: Access individual character by ID
- **`useSelectedCharacter()`**: Manage UI selection state

### 🎯 Usage Example

```typescript
import { 
  useExampleCharactersList, 
  useExampleCharacter 
} from '@/shared/state/example/use-example';

function CharactersList() {
  const { data: characters, isLoading } = useExampleCharactersList();
  
  if (isLoading) return <div>Loading characters...</div>;
  
  return (
    <div>
      {characters.map(char => (
        <CharacterCard key={char.id} characterId={char.id} />
      ))}
    </div>
  );
}

function CharacterCard({ characterId }: { characterId: number }) {
  const { data: character } = useExampleCharacter(characterId);
  
  return (
    <div>
      <h3>{character?.name}</h3>
      <p>{character?.occupation}</p>
    </div>
  );
}
```

### 🏆 Benefits

- **Performance**: Automatic caching and background synchronization
- **Scalability**: AtomFamily pattern for efficient individual item management
- **Developer Experience**: Type-safe APIs with excellent IDE support
- **Maintainability**: Clear separation of concerns with custom hooks
- **Flexibility**: Easy to extend with additional query variations and mutations

This example serves as a reference implementation for building scalable React applications with modern state management patterns.