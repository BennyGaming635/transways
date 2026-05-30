import { prisma } from "@/app/lib/prisma";

export default async function StopsPage({
  searchParams,
}: {
  searchParams: { search?: string };
}) {
  const search = searchParams.search || "";

  const stops = await prisma.stop.findMany({
    where: search
      ? {
          name: {
            contains: search,
          },
        }
      : undefined,
    take: 100,
    orderBy: { name: "asc" },
  });

  return (
    <div style={{ padding: 24 }}>
      <h1>Stops</h1>

      {stops.map((stop) => (
        <a
          key={stop.id}
          href={`/stops/${stop.id}`}
          style={{ display: "block", marginBottom: 8 }}
        >
          {stop.name}
        </a>
      ))}
    </div>
  );
}