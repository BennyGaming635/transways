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

async function importStops() {
  console.log("Reading GTFS stops.txt...");

  const stops: GTFSStop[] = [];

  fs.createReadStream("gtfs/stops.txt")
    .pipe(csv())
    .on("data", (row) => {
      stops.push(row);
    })
    .on("end", async () => {
      console.log(`Loaded ${stops.length} stops from file`);

      console.log("Transforming data...");

      const formatted = stops.map((stop) => ({
        id: stop.stop_id,
        code: stop.stop_code || null,
        name: stop.stop_name,
        latitude: Number(stop.stop_lat),
        longitude: Number(stop.stop_lon),
      }));

      console.log("Writing to database (fast batch insert)...");

      try {
        await prisma.stop.createMany({
          data: formatted,
          skipDuplicates: true as any,
        } as any);

        console.log("Stops import complete.");
      } catch (err) {
        console.error("Import failed:", err);
      } finally {
        await prisma.$disconnect();
      }
    });
}

importStops();