import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const stops = await prisma.stop.findMany({
        take: 50,
        orderBy: { name: "asc" },
    });

    return NextResponse.json(stops);
}