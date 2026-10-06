"use client";

import { useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  ReferenceLine,
} from "recharts";
import { SHAPExplanation } from "@/lib/types";
import { TrendingUp, TrendingDown, Info } from "lucide-react";

interface SHAPChartProps {
  explanation: SHAPExplanation;
}

export default function SHAPChart({ explanation }: SHAPChartProps) {
  const [activeTab, setActiveTab] = useState<"all" | "risk_increasing" | "protective">("all");

  const top10 = explanation.top_features.slice(0, 10);
  
  const filteredFeatures = top10.filter((item) => {
    if (activeTab === "risk_increasing") return item.shap_value > 0;
    if (activeTab === "protective") return item.shap_value < 0;
    return true;
  });

  const chartData = filteredFeatures.map((item) => ({
    name: item.label,
    shap_value: item.shap_value,
    abs_shap: item.abs_shap,
    raw_value: item.raw_value,
    impact: item.impact,
    isPositive: item.shap_value > 0,
  })).reverse(); // Reverse for top-to-bottom in horizontal bar chart

  return (
    <div className="bg-white rounded-2xl border border-[#D3E8DA] p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#D3E8DA]">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-[#1F3D2B]">
              SHAP Explainability Analysis
            </h3>
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-[#EAF6EE] text-[#1F3D2B]">
              Local Attribution
            </span>
          </div>
          <p className="text-xs text-[#52796F] mt-0.5">
            Feature contributions quantified via SHAP (SHapley Additive exPlanations)
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-[#F7FBF8] p-1 rounded-xl border border-[#D3E8DA]">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
              activeTab === "all"
                ? "bg-white text-[#1F3D2B] shadow-xs"
                : "text-[#52796F] hover:text-[#1F3D2B]"
            }`}
          >
            All Top Factors
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("risk_increasing")}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-all flex items-center gap-1 ${
              activeTab === "risk_increasing"
                ? "bg-rose-50 text-rose-800 shadow-xs"
                : "text-[#52796F] hover:text-[#1F3D2B]"
            }`}
          >
            <TrendingUp className="w-3 h-3 text-rose-500" />
            Increases Risk
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("protective")}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-all flex items-center gap-1 ${
              activeTab === "protective"
                ? "bg-[#EAF6EE] text-[#1F3D2B] shadow-xs"
                : "text-[#52796F] hover:text-[#1F3D2B]"
            }`}
          >
            <TrendingDown className="w-3 h-3 text-[#52796F]" />
            Protective / Lowers Risk
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-80 w-full mt-4">
        {chartData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-sm text-[#718E7B]">
            No factors found in this category.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={chartData}
              margin={{ top: 10, right: 30, left: 110, bottom: 10 }}
            >
              <XAxis
                type="number"
                domain={["auto", "auto"]}
                tick={{ fontSize: 11, fill: "#4F6B58" }}
                tickLine={false}
                axisLine={{ stroke: "#D3E8DA" }}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 12, fill: "#1F3D2B", fontWeight: 500 }}
                tickLine={false}
                axisLine={false}
                width={120}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-3 rounded-xl border border-[#D3E8DA] shadow-md text-xs">
                        <p className="font-bold text-[#1F3D2B]">{data.name}</p>
                        <p className="text-[#52796F] mt-1">
                          Patient Value: <span className="font-semibold text-[#1F3D2B]">{data.raw_value}</span>
                        </p>
                        <p className="text-[#52796F]">
                          SHAP Impact:{" "}
                          <span
                            className={`font-semibold ${
                              data.isPositive ? "text-rose-600" : "text-emerald-700"
                            }`}
                          >
                            {data.shap_value > 0 ? "+" : ""}
                            {data.shap_value}
                          </span>
                        </p>
                        <p className="text-[11px] text-[#718E7B] mt-1 italic">
                          {data.isPositive
                            ? "Elevated patient risk contribution"
                            : "Protective patient contribution"}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <ReferenceLine x={0} stroke="#4F6B58" strokeDasharray="3 3" opacity={0.6} />
              <Bar dataKey="shap_value" radius={[4, 4, 4, 4]}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.isPositive ? "#F87171" : "#8FBF9F"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Legend & Guide */}
      <div className="mt-4 pt-4 border-t border-[#D3E8DA] flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-rose-400 shrink-0" />
            <span className="text-[#4F6B58]">Positive SHAP: Pushes prediction toward higher risk</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-[#8FBF9F] shrink-0" />
            <span className="text-[#4F6B58]">Negative SHAP: Pushes prediction toward lower risk</span>
          </div>
        </div>
      </div>

      {/* Explainability Disclaimer */}
      <div className="mt-4 p-3 rounded-xl bg-[#F7FBF8] border border-[#D3E8DA] text-xs text-[#4F6B58] flex items-start gap-2">
        <Info className="w-4 h-4 text-[#52796F] shrink-0 mt-0.5" />
        <p>
          {explanation.disclaimer ||
            "SHAP shows how individual features contributed to this model prediction. It explains model behavior and should not be interpreted as a medical diagnosis."}
        </p>
      </div>
    </div>
  );
}
