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

    stopTimes: {
      select: {
        trip: {
          select: {
            route: {
              select: {
                id: true,
                shortName: true,
                longName: true,
                color: true,
              },
            },
          },
        },
      },
    },
  },
}) as any;

  if (!stop) return <div>Stop not found</div>;

  const routesMap = new Map();

  if (stop.stopTimes) {
    for (const st of stop?.stopTimes ?? []) {
      const route = st.trip?.route;
      if (route) routesMap.set(route.id, route);
    }
  }

  const routes = Array.from(routesMap.values());

  return (
    <div style={{ padding: 24 }}>
      <h1>{stop.name}</h1>

      <p>Code: {stop.code ?? "N/A"}</p>
      <p>
        {stop.latitude}, {stop.longitude}
      </p>

      <h2>Routes</h2>
      {routes.length === 0 ? (
        <p>No routes found</p>
      ) : (
        <ul>
          {routes.map((r) => (
            <li key={r.id}>
              <strong>{r.shortName}</strong> {r.longName}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}