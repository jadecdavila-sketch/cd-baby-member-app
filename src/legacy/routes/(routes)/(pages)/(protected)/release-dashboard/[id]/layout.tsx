import { ReleaseSidebar } from '@/components/release-sidebar';

export default async function PageLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}>) {
  const { id } = await params;
  return (
    <div className="flex flex-1">
      <ReleaseSidebar releaseID={id} />
      {children}
    </div>
  );
}
