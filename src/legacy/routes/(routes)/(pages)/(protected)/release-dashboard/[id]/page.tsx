export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="space-y-6">
      {/* Throw away content to demonstrate scrolling */}
      <h1 className="text-lg font-semibold">Release Dashboard for {id}</h1>

      <p className="text-muted-foreground">
        Welcome to your dashboard. Scroll down to see the sidebar stay in place.
      </p>

      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="rounded-lg border p-6">
          <h2 className="mb-4 text-xl font-semibold">Section {i + 1}</h2>
          <p className="text-muted-foreground">
            This is a content section to demonstrate the sticky sidebar. As you
            scroll, the sidebar will remain fixed on the screen.
          </p>
        </div>
      ))}
    </div>
  );
}
