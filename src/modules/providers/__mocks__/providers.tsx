import React from 'react';

interface MockProvidersProps {
  children: React.ReactNode;
  session?: any;
}

export function Providers({ children }: MockProvidersProps) {
  return <div data-testid="mock-providers">{children}</div>;
}
