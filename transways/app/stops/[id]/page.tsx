import { prisma } from "@/app/lib/prisma";

export default async function StopPage({
  params,
}: {
  params: { id: string | string[] };
}) {
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  if (!id) return <div>Stop not found</div>;

  const stop = await prisma.stop.findUnique({
    where: { id },
    select: {
      id: true,
      code: true,
      name: true,
      latitude: true,
      longitude: true,
    },
  });

  if (!stop) return <div>Stop not found</div>;

  return (
    <div style={{ padding: 24 }}>
      <h1>{stop.name}</h1>
      <p>Code: {stop.code ?? "N/A"}</p>
      <p>
        {stop.latitude}, {stop.longitude}
      </p>
    </div>
  );
}