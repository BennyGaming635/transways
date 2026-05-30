import { prisma } from "@/app/lib/prisma";

export default async function StopPage({
  params,
}: {
  params: { id: string };
}) {
  const stop = await prisma.stop.findUnique({
    where: { id: params.id },
  });

  if (!stop) return <div>Stop not found</div>;

  return (
    <div style={{ padding: 24 }}>
      <h1>{stop.name}</h1>

      <p>Lat: {stop.latitude}</p>
      <p>Lon: {stop.longitude}</p>

      <a href="/stops">Back</a>
    </div>
  );
}