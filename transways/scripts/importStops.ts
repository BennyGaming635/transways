import fs from "fs";
import csv from "csv-parser";
import { prisma } from "../app/lib/prisma";

type GTFSStop = {
  stop_id: string;
  stop_code?: string;
  stop_name: string;
  stop_lat: string;
  stop_lon: string;
};

function readStops(): Promise<GTFSStop[]> {
  return new Promise((resolve, reject) => {
    const stops: GTFSStop[] = [];

    fs.createReadStream("gtfs/stops.txt")
      .pipe(csv())
      .on("data", (row) => {
        stops.push(row);
      })
      .on("end", () => resolve(stops))
      .on("error", reject);
  });
}

async function importStops() {
  console.log("Reading GTFS stops.txt...");

  const stops = await readStops();

  console.log(`Loaded ${stops.length} stops`);

  const formatted = stops.map((stop) => ({
    id: stop.stop_id,
    code: stop.stop_code || null,
    name: stop.stop_name,
    latitude: Number(stop.stop_lat),
    longitude: Number(stop.stop_lon),
  }));

  console.log("Importing into database...");

  const BATCH_SIZE = 1000;

  for (let i = 0; i < formatted.length; i += BATCH_SIZE) {
    const batch = formatted.slice(i, i + BATCH_SIZE);

    await prisma.stop.createMany({
      data: batch,
    });

    console.log(
      `Inserted ${Math.min(i + BATCH_SIZE, formatted.length)} / ${formatted.length}`
    );
  }

  console.log("Stops import complete.");

  await prisma.$disconnect();
}

importStops().catch((err) => {
  console.error("Import failed:", err);
  process.exit(1);
});