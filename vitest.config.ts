import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    typecheck: {
      tsconfig: './tsconfig.test.json',
    },
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
    include: ['**/__tests__/**/*.test.{ts,tsx}'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*'],
      exclude: [
        'node_modules/',
        'src/test-setup.ts',
        '**/*.d.ts',
        '**/*.stories.tsx',
        '**/__mocks__/**/*',
        'src/legacy/**/*',
        '.next/**/*',
        '**/index.ts',
        '**/index.tsx',
      ],
    },
    globals: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/api': path.resolve(__dirname, './src/api'),
      '@/app': path.resolve(__dirname, './src/app'),
      '@/modules': path.resolve(__dirname, './src/modules'),
      '@/shared': path.resolve(__dirname, './src/shared'),
      '@/shared/components': path.resolve(__dirname, './src/shared/components'),
      '@/shared/hooks': path.resolve(__dirname, './src/shared/hooks'),
      '@/shared/services': path.resolve(__dirname, './src/shared/services'),
      '@/shared/types': path.resolve(__dirname, './src/shared/types'),
      '@/shared/utils': path.resolve(__dirname, './src/shared/utils'),
      '@/shared/constants': path.resolve(__dirname, './src/shared/constants'),
    },
  },
});
