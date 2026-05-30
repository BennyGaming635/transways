import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const url = new URL(request.url);
    const minLat = url.searchParams.get("minLat");
    const maxLat = url.searchParams.get("maxLat");
    const minLng = url.searchParams.get("minLng");
    const maxLng = url.searchParams.get("maxLng");

    // If bbox params are provided, return stops inside bounding box.
    if (minLat && maxLat && minLng && maxLng) {
        const minLatN = Number(minLat);
        const maxLatN = Number(maxLat);
        const minLngN = Number(minLng);
        const maxLngN = Number(maxLng);

        const stops = await prisma.stop.findMany({
            where: {
                latitude: {
                    gte: Math.min(minLatN, maxLatN),
                    lte: Math.max(minLatN, maxLatN),
                },
                longitude: {
                    gte: Math.min(minLngN, maxLngN),
                    lte: Math.max(minLngN, maxLngN),
                },
            },
            orderBy: { name: "asc" },
        });

        return NextResponse.json(stops);
    }

    // If no bbox provided, return empty array to avoid sending thousands by default.
    return NextResponse.json([]);
}