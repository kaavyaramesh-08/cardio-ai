"use client";

import Link from "next/link";
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
import {
  Network,
  ArrowRight,
} from "lucide-react";
import mlBundle from "@/lib/ml-data/ml_bundle.json";
import Disclaimer from "@/components/Disclaimer";
import { ClusterProfile } from "@/lib/types";

export default function ProfilesPage() {
  const clustering = mlBundle.clustering;
  const profiles = clustering.profiles as ClusterProfile[];
  const evalMetrics = clustering.evaluation_metrics as { k: number; inertia: number; silhouette_score: number }[];

  // Comparison data across the 3 profiles
  const comparisonData = [
    {
      metric: "Mean Age (yrs)",
      "Profile 1 (Low)": profiles[0].characteristics.age,
      "Profile 2 (Mod)": profiles[1].characteristics.age,
      "Profile 3 (High)": profiles[2].characteristics.age,
    },
    {
      metric: "Resting BP (mm Hg)",
      "Profile 1 (Low)": profiles[0].characteristics.trestbps,
      "Profile 2 (Mod)": profiles[1].characteristics.trestbps,
      "Profile 3 (High)": profiles[2].characteristics.trestbps,
    },
    {
      metric: "Max Heart Rate (bpm)",
      "Profile 1 (Low)": profiles[0].characteristics.thalach,
      "Profile 2 (Mod)": profiles[1].characteristics.thalach,
      "Profile 3 (High)": profiles[2].characteristics.thalach,
    },
    {
      metric: "CVD Prevalence (%)",
      "Profile 1 (Low)": profiles[0].characteristics.disease_rate_pct,
      "Profile 2 (Mod)": profiles[1].characteristics.disease_rate_pct,
      "Profile 3 (High)": profiles[2].characteristics.disease_rate_pct,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D3E8DA]">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#52796F] mb-1">
            <Network className="w-4 h-4" />
            Unsupervised Machine Learning
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F3D2B]">
            K-Means Patient Risk Profiling
          </h1>
          <p className="text-sm text-[#4F6B58] mt-1 max-w-2xl">
            Clustering partitions the clinical cohort into three statistical archetypes based on 13 physiological parameters.
          </p>
        </div>

        <Link
          href="/assessment"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-[#8FBF9F] text-white hover:bg-[#7CAE8E] transition-all shadow-xs self-start sm:self-auto"
        >
          Evaluate Patient Profile
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Cluster Disclaimer Banner */}
      <Disclaimer customText="Clusters represent statistical patterns discovered in the dataset and are not medical diagnoses. They reveal empirical patient cohorts but do not define individual clinical outcomes." />

      {/* 3 Profile Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {profiles.map((profile, idx) => {
          const isHigh = idx === 2;
          const isLow = idx === 0;

          return (
            <div
              key={profile.profile_index}
              className={`bg-white rounded-2xl border p-6 shadow-sm transition-all flex flex-col justify-between ${
                isHigh
                  ? "border-rose-200 hover:border-rose-300"
                  : isLow
                  ? "border-[#8FBF9F] hover:border-[#7CAE8E]"
                  : "border-amber-200 hover:border-amber-300"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                      isHigh
                        ? "bg-rose-100 text-rose-800"
                        : isLow
                        ? "bg-[#EAF6EE] text-[#1F3D2B]"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {profile.short_name}
                  </span>
                  <span className="text-xs text-[#718E7B]">
                    {profile.size} patients ({profile.percentage}%)
                  </span>
                </div>

                <h3 className="text-lg font-bold text-[#1F3D2B]">
                  {profile.name}
                </h3>
                <p className="text-xs text-[#4F6B58] mt-2 leading-relaxed">
                  {profile.description}
                </p>

                {/* Quantitative Profile Averages */}
                <div className="mt-5 space-y-2 border-t border-[#D3E8DA] pt-4 text-xs">
                  <div className="flex justify-between py-1 border-b border-[#F0F5F2]">
                    <span className="text-[#718E7B]">Cohort Mean Age:</span>
                    <span className="font-semibold text-[#1F3D2B]">
                      {profile.characteristics.age} years
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#F0F5F2]">
                    <span className="text-[#718E7B]">Mean Resting BP:</span>
                    <span className="font-semibold text-[#1F3D2B]">
                      {profile.characteristics.trestbps} mm Hg
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#F0F5F2]">
                    <span className="text-[#718E7B]">Serum Cholesterol:</span>
                    <span className="font-semibold text-[#1F3D2B]">
                      {profile.characteristics.chol} mg/dl
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#F0F5F2]">
                    <span className="text-[#718E7B]">Max Heart Rate:</span>
                    <span className="font-semibold text-[#1F3D2B]">
                      {profile.characteristics.thalach} bpm
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#F0F5F2]">
                    <span className="text-[#718E7B]">Exertional Angina:</span>
                    <span className="font-semibold text-[#1F3D2B]">
                      {profile.characteristics.exang_pct}%
                    </span>
                  </div>
                  <div className="flex justify-between py-1 pt-2">
                    <span className="font-semibold text-[#1F3D2B]">CVD Disease Rate:</span>
                    <span
                      className={`font-bold ${
                        isHigh ? "text-rose-600" : isLow ? "text-emerald-700" : "text-amber-700"
                      }`}
                    >
                      {profile.disease_rate_pct}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-[#D3E8DA] text-[11px] text-[#718E7B]">
                Centroid vector calculated across 13 standardized clinical features.
              </div>
            </div>
          );
        })}
      </div>

      {/* Row: Cluster Characteristic Comparison Chart */}
      <div className="bg-white rounded-2xl border border-[#D3E8DA] p-6 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-[#D3E8DA]">
          <div>
            <h3 className="text-base font-bold text-[#1F3D2B]">
              Cross-Profile Biomarker Comparison
            </h3>
            <p className="text-xs text-[#52796F]">
              Contrast average biometric indicators across the three patient archetypes
            </p>
          </div>
        </div>

        <div className="h-72 w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={comparisonData}
              margin={{ top: 20, right: 30, left: 10, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F5F2" />
              <XAxis
                dataKey="metric"
                tick={{ fontSize: 11, fill: "#1F3D2B" }}
                tickLine={false}
                axisLine={{ stroke: "#D3E8DA" }}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#4F6B58" }}
                tickLine={false}
                axisLine={{ stroke: "#D3E8DA" }}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white p-3 rounded-xl border border-[#D3E8DA] shadow-md text-xs space-y-1">
                        <p className="font-bold text-[#1F3D2B]">{label}</p>
                        {payload.map((p: any) => (
                          <p key={p.name} style={{ color: p.color }}>
                            {p.name}: <span className="font-semibold">{p.value}</span>
                          </p>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
              <Bar dataKey="Profile 1 (Low)" fill="#8FBF9F" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Profile 2 (Mod)" fill="#E9D8A6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Profile 3 (High)" fill="#EE9B00" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Elbow Method & Silhouette Analysis Table */}
      <div className="bg-white rounded-2xl border border-[#D3E8DA] overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-[#D3E8DA] bg-[#F7FBF8]">
          <h3 className="text-base font-bold text-[#1F3D2B]">
            Cluster Optimization &amp; Model Selection (Elbow Method &amp; Silhouette)
          </h3>
          <p className="text-xs text-[#52796F]">
            Evaluated cluster counts from k=2 to k=6 on scaled Cleveland features
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#EAF6EE]/50 text-xs font-semibold text-[#1F3D2B] uppercase tracking-wider border-b border-[#D3E8DA]">
              <tr>
                <th className="py-3 px-4">Cluster Count (k)</th>
                <th className="py-3 px-4 text-center">Inertia (Within-Cluster Sum of Squares)</th>
                <th className="py-3 px-4 text-center">Silhouette Score</th>
                <th className="py-3 px-4 text-right">Clinical Suitability</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D3E8DA]">
              {evalMetrics.map((row) => {
                const isSelected = row.k === 3;
                return (
                  <tr
                    key={row.k}
                    className={`transition-colors hover:bg-[#F7FBF8] ${
                      isSelected ? "bg-[#EAF6EE]/40 font-medium" : ""
                    }`}
                  >
                    <td className="py-3 px-4 font-bold text-[#1F3D2B]">
                      k = {row.k} {isSelected && "★ (Selected Architecture)"}
                    </td>
                    <td className="py-3 px-4 text-center text-[#4F6B58]">
                      {row.inertia}
                    </td>
                    <td className="py-3 px-4 text-center font-semibold text-[#1F3D2B]">
                      {row.silhouette_score}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {isSelected ? (
                        <span className="text-xs font-semibold text-[#2F855A]">
                          Optimal 3-Tier Clinical Stratification
                        </span>
                      ) : (
                        <span className="text-xs text-[#718E7B]">Tested</span>
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
