"use client";

import { useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { ModelEvaluationData } from "@/lib/types";
import { CheckCircle2, Award, Info } from "lucide-react";

interface ModelComparisonProps {
  metricsData: ModelEvaluationData;
}

export default function ModelComparison({ metricsData }: ModelComparisonProps) {
  const [activeMetricTab, setActiveMetricTab] = useState<"all" | "recall_roc" | "accuracy">("recall_roc");

  const models = metricsData.models;

  const chartData = models.map((m) => ({
    name: m.model_name.replace("Regression", "Reg.").replace("Machine", "SVM").replace("Neural Network", "NN"),
    fullName: m.model_name,
    Accuracy: Number((m.accuracy * 100).toFixed(1)),
    Recall: Number((m.recall * 100).toFixed(1)),
    "ROC-AUC": Number((m.roc_auc * 100).toFixed(1)),
    F1: Number((m.f1_score * 100).toFixed(1)),
    Precision: Number((m.precision * 100).toFixed(1)),
    isBest: m.model_name === metricsData.best_model,
  }));

  return (
    <div className="space-y-6">
      {/* Best Model Highlight Banner */}
      <div className="bg-gradient-to-r from-[#EAF6EE] to-[#F7FBF8] rounded-2xl border border-[#8FBF9F] p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-[#8FBF9F] text-white shadow-xs">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-semibold text-[#52796F] uppercase tracking-wider">
                Primary Selected Model
              </div>
              <h3 className="text-2xl font-bold text-[#1F3D2B] mt-0.5">
                {metricsData.best_model}
              </h3>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-white/80 px-4 py-2 rounded-xl border border-[#D3E8DA]">
            <div>
              <div className="text-[11px] text-[#718E7B]">Clinical Recall</div>
              <div className="text-lg font-bold text-[#1F3D2B]">96.4%</div>
            </div>
            <div className="w-px h-8 bg-[#D3E8DA]" />
            <div>
              <div className="text-[11px] text-[#718E7B]">ROC-AUC</div>
              <div className="text-lg font-bold text-[#1F3D2B]">0.946</div>
            </div>
            <div className="w-px h-8 bg-[#D3E8DA]" />
            <div>
              <div className="text-[11px] text-[#718E7B]">Test Accuracy</div>
              <div className="text-lg font-bold text-[#1F3D2B]">88.5%</div>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-[#D3E8DA] text-xs text-[#4F6B58] leading-relaxed flex items-start gap-2">
          <Info className="w-4 h-4 text-[#52796F] shrink-0 mt-0.5" />
          <p>{metricsData.selection_rationale}</p>
        </div>
      </div>

      {/* Model Performance Comparison Chart */}
      <div className="bg-white rounded-2xl border border-[#D3E8DA] p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#D3E8DA]">
          <div>
            <h3 className="text-lg font-bold text-[#1F3D2B]">
              Benchmark Metrics Comparison
            </h3>
            <p className="text-xs text-[#52796F] mt-0.5">
              Evaluated on 20% hold-out test set (n={metricsData.test_sample_count}) from UCI Cleveland
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-[#F7FBF8] p-1 rounded-xl border border-[#D3E8DA]">
            <button
              type="button"
              onClick={() => setActiveMetricTab("recall_roc")}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                activeMetricTab === "recall_roc"
                  ? "bg-white text-[#1F3D2B] shadow-xs"
                  : "text-[#52796F] hover:text-[#1F3D2B]"
              }`}
            >
              Recall &amp; ROC-AUC (Clinical)
            </button>
            <button
              type="button"
              onClick={() => setActiveMetricTab("all")}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                activeMetricTab === "all"
                  ? "bg-white text-[#1F3D2B] shadow-xs"
                  : "text-[#52796F] hover:text-[#1F3D2B]"
              }`}
            >
              All Metrics
            </button>
          </div>
        </div>

        <div className="h-80 w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F5F2" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: "#1F3D2B" }}
                tickLine={false}
                axisLine={{ stroke: "#D3E8DA" }}
              />
              <YAxis
                domain={[60, 100]}
                tick={{ fontSize: 11, fill: "#4F6B58" }}
                tickLine={false}
                axisLine={{ stroke: "#D3E8DA" }}
                unit="%"
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const row = chartData.find((d) => d.name === label);
                    return (
                      <div className="bg-white p-3 rounded-xl border border-[#D3E8DA] shadow-md text-xs space-y-1">
                        <p className="font-bold text-[#1F3D2B]">{row?.fullName || label}</p>
                        {payload.map((p) => (
                          <p key={p.name} style={{ color: p.color }}>
                            {p.name}: <span className="font-semibold">{p.value}%</span>
                          </p>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: 12, paddingTop: 10 }}
              />
              <Bar dataKey="Recall" fill="#8FBF9F" radius={[4, 4, 0, 0]} />
              <Bar dataKey="ROC-AUC" fill="#52796F" radius={[4, 4, 0, 0]} />
              {activeMetricTab === "all" && (
                <>
                  <Bar dataKey="Accuracy" fill="#B7DCC4" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="F1" fill="#718E7B" radius={[4, 4, 0, 0]} />
                </>
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Model Performance Comparison Table */}
      <div className="bg-white rounded-2xl border border-[#D3E8DA] overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-[#D3E8DA] bg-[#F7FBF8]">
          <h3 className="text-base font-bold text-[#1F3D2B]">
            Comprehensive Model Evaluation Table
          </h3>
          <p className="text-xs text-[#52796F]">
            Benchmarking all 6 supervised classifiers on the test partition
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#EAF6EE]/50 text-xs font-semibold text-[#1F3D2B] uppercase tracking-wider border-b border-[#D3E8DA]">
              <tr>
                <th className="py-3 px-4">Model Architecture</th>
                <th className="py-3 px-4 text-center">Recall (Sensitivity)</th>
                <th className="py-3 px-4 text-center">ROC-AUC</th>
                <th className="py-3 px-4 text-center">F1 Score</th>
                <th className="py-3 px-4 text-center">Accuracy</th>
                <th className="py-3 px-4 text-center">Precision</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D3E8DA]">
              {models.map((model) => {
                const isBest = model.model_name === metricsData.best_model;
                return (
                  <tr
                    key={model.model_name}
                    className={`transition-colors hover:bg-[#F7FBF8] ${
                      isBest ? "bg-[#EAF6EE]/30 font-medium" : ""
                    }`}
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        {isBest && (
                          <span className="w-2 h-2 rounded-full bg-[#8FBF9F]" />
                        )}
                        <span className="text-[#1F3D2B] font-semibold">
                          {model.model_name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-[#1F3D2B]">
                      {(model.recall * 100).toFixed(1)}%
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-[#52796F]">
                      {model.roc_auc.toFixed(3)}
                    </td>
                    <td className="py-3.5 px-4 text-center text-[#4F6B58]">
                      {model.f1_score.toFixed(3)}
                    </td>
                    <td className="py-3.5 px-4 text-center text-[#4F6B58]">
                      {(model.accuracy * 100).toFixed(1)}%
                    </td>
                    <td className="py-3.5 px-4 text-center text-[#4F6B58]">
                      {(model.precision * 100).toFixed(1)}%
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {isBest ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#8FBF9F] text-white">
                          <CheckCircle2 className="w-3 h-3" />
                          Selected
                        </span>
                      ) : (
                        <span className="text-xs text-[#718E7B]">Benchmarked</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
