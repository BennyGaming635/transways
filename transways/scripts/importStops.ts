import fs from "fs";
import csv from "csv-parser";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function importStops() {
  const stops: any[] = [];

  fs.createReadStream("gtfs/stops.txt")
    .pipe(csv())
    .on("data", (row) => {
      stops.push(row);
    })
    .on("end", async () => {
      console.log(`Found ${stops.length} stops`);

      for (const stop of stops) {
        await prisma.stop.upsert({
          where: {
            id: stop.stop_id,
          },
          update: {},
          create: {
            id: stop.stop_id,
            code: stop.stop_code || null,
            name: stop.stop_name,
            latitude: Number(stop.stop_lat),
            longitude: Number(stop.stop_lon),
          },
        });
      }

      console.log("Import complete");
      await prisma.$disconnect();
    });
}

importStops();