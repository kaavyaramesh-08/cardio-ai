import { NextRequest, NextResponse } from "next/server";
import { runLocalInference } from "@/lib/ml-engine";
import { PatientInput } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as PatientInput;

    // Validation
    if (body.age === undefined || isNaN(Number(body.age))) {
      return NextResponse.json(
        { error: "Invalid clinical input: Age is required." },
        { status: 400 }
      );
    }

    const pythonApiUrl =
      process.env.PYTHON_API_URL || process.env.NEXT_PUBLIC_API_URL;

    // If external Python microservice is configured, try calling it
    if (pythonApiUrl && pythonApiUrl.startsWith("http")) {
      try {
        const pyRes = await fetch(`${pythonApiUrl.replace(/\/$/, "")}/api/predict`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
          signal: AbortSignal.timeout(3000), // 3-second timeout for quick fallback
        });

        if (pyRes.ok) {
          const pyData = await pyRes.json();
          return NextResponse.json({
            ...pyData,
            source: "python_microservice",
          });
        }
      } catch (pyErr) {
        console.warn(
          "External Python API unavailable, executing built-in serverless ML inference:",
          pyErr
        );
      }
    }

    // Direct exact trained ML inference engine
    const inferenceResult = runLocalInference(body, body.model_name);

    return NextResponse.json({
      ...inferenceResult,
      source: "serverless_ml_engine",
    });
  } catch (error: unknown) {
    console.error("Prediction API error:", error);
    return NextResponse.json(
      { error: "Prediction processing failed. Please check clinical inputs." },
      { status: 500 }
    );
  }
}
