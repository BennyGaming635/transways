-- AlterTable
ALTER TABLE "Stop" ADD COLUMN "code" TEXT;

-- CreateTable
CREATE TABLE "Route" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shortName" TEXT,
    "longName" TEXT,
    "type" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Trip" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "routeId" TEXT NOT NULL,
    "headsign" TEXT,
    "directionId" INTEGER,
    CONSTRAINT "Trip_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "Route" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "StopTime" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tripId" TEXT NOT NULL,
    "stopId" TEXT NOT NULL,
    "arrivalTime" TEXT NOT NULL,
    "departureTime" TEXT NOT NULL,
    "stopSequence" INTEGER NOT NULL,
    CONSTRAINT "StopTime_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "StopTime_stopId_fkey" FOREIGN KEY ("stopId") REFERENCES "Stop" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Vehicle" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "routeId" TEXT,
    "tripId" TEXT,
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL,
    "bearing" REAL,
    "speed" REAL,
    "timestamp" DATETIME
);

-- CreateTable
CREATE TABLE "ServiceAlert" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "severity" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "FavouriteStop" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "stopId" TEXT NOT NULL,
    "label" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "JourneyHistory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fromStopId" TEXT NOT NULL,
    "toStopId" TEXT NOT NULL,
    "durationMin" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "StopTime_stopId_idx" ON "StopTime"("stopId");

-- CreateIndex
CREATE INDEX "StopTime_tripId_idx" ON "StopTime"("tripId");
