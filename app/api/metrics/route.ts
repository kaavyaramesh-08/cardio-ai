import { NextResponse } from "next/server";
import { getModelMetrics } from "@/lib/ml-engine";

export async function GET() {
  try {
    const metrics = getModelMetrics();
    return NextResponse.json(metrics);
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to retrieve metrics.";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
