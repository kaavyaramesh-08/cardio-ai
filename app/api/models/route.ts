import { NextResponse } from "next/server";
import { getModelMetrics } from "@/lib/ml-engine";

export async function GET() {
  try {
    const metrics = getModelMetrics();
    return NextResponse.json({
      best_model: metrics.best_model,
      selection_rationale: metrics.selection_rationale,
      test_sample_count: metrics.test_sample_count,
      models: metrics.models,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to retrieve models data.";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
