# Legacy Components Preservation

This folder contains the original implementation preserved during the modernization to align with the frontend-tech-stack-guide.md.

## Preserved Structure

### Components (`./components/`)

All original UI components from `src/components/` have been moved here for safe keeping. These can be referenced during migration or restored if needed.

### Routes (`./routes/`)

Original route structure from `src/app/(routes)/` preserved here.

### Providers (`./providers/`)

Original provider setup from `src/_providers/` kept for reference.

## What Was NOT Moved

- `src/app/_utils/AuthGuard.tsx` - **KEPT IN ORIGINAL LOCATION** - This is actively used and integrated with the new provider structure
- `src/lib/utils.ts` - Moved to `src/shared/utils/` as part of the new structure
- `src/hooks/` - Moved to `src/shared/hooks/`
- `src/services/` - Moved to `src/shared/services/`
- `src/types/` - Moved to `src/shared/types/`

## Migration Notes

- All legacy components are fully functional
- Import paths need updating when migrating components back
- New structure follows the tech stack guide recommendations
- Test files have been created in the new structure

## Restoration Process

If you need to restore any component:

1. Copy from legacy folder
2. Update import paths to match new structure
3. Add proper tests in `__tests__/` folder
4. Add mocks in `__mocks__/` folder if needed
