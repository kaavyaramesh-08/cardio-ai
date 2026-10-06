import { NextResponse } from "next/server";
import { getClusterProfiles } from "@/lib/ml-engine";

export async function GET() {
  try {
    const clusters = getClusterProfiles();
    return NextResponse.json(clusters);
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to retrieve cluster profiles.";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
