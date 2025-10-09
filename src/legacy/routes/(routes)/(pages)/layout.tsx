import SiteNav from '@/components/_shared/SiteNav';

export default function PageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SiteNav />
      <main className="flex-1 px-6 md:p-6 md:pl-[calc(16rem+1.5rem)]">
        {children}
      </main>
    </>
  );
}
