-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_StopTime" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tripId" TEXT NOT NULL,
    "stopId" TEXT NOT NULL,
    "arrivalTime" TEXT NOT NULL,
    "departureTime" TEXT NOT NULL,
    "stopSequence" INTEGER NOT NULL,
    CONSTRAINT "StopTime_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "StopTime_stopId_fkey" FOREIGN KEY ("stopId") REFERENCES "Stop" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_StopTime" ("arrivalTime", "departureTime", "id", "stopId", "stopSequence", "tripId") SELECT "arrivalTime", "departureTime", "id", "stopId", "stopSequence", "tripId" FROM "StopTime";
DROP TABLE "StopTime";
ALTER TABLE "new_StopTime" RENAME TO "StopTime";
CREATE INDEX "StopTime_stopId_idx" ON "StopTime"("stopId");
CREATE INDEX "StopTime_tripId_idx" ON "StopTime"("tripId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
