"use client";

import Link from "next/link";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  CartesianGrid,
} from "recharts";
import {
  Activity,
  Users,
  Award,
  Cpu,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import mlBundle from "@/lib/ml-data/ml_bundle.json";
import Disclaimer from "@/components/Disclaimer";
import { ModelMetric, ClusterProfile } from "@/lib/types";

const CLUSTER_COLORS = ["#8FBF9F", "#E9D8A6", "#EE9B00"];
const PREDICTION_PIE_COLORS = ["#8FBF9F", "#F87171"];

export default function DashboardPage() {
  const metrics = mlBundle.metrics;
  const clustering = mlBundle.clustering;
  const datasetMeta = mlBundle.dataset_meta;
  const shapSummary = mlBundle.shap_summary;

  // 1. Model Performance Data
  const modelPerfData = (metrics.models as ModelMetric[]).map((m) => ({
    name: m.model_name.replace("Regression", "Reg.").replace("Machine", "SVM").replace("Neural Network", "DNN"),
    Recall: Number((m.recall * 100).toFixed(1)),
    "ROC-AUC": Number((m.roc_auc * 100).toFixed(1)),
    Accuracy: Number((m.accuracy * 100).toFixed(1)),
  }));

  // 2. Cluster Distribution Data
  const clusterDistData = (clustering.profiles as ClusterProfile[]).map((p) => ({
    name: p.short_name,
    fullName: p.name,
    value: p.size,
    pct: p.percentage,
    diseaseRate: p.disease_rate_pct,
  }));

  // 3. Feature Importance Data (Global SHAP)
  const featureImpData = (shapSummary.global_importance as { feature: string; label: string; importance: number }[])
    .slice(0, 8)
    .map((f) => ({
      name: f.label,
      importance: f.importance,
    }))
    .reverse();

  // 4. Target Distribution Data
  const targetDistData = [
    { name: "Absence of CVD (0)", value: datasetMeta.class_distribution.no_disease },
    { name: "Presence of CVD (1)", value: datasetMeta.class_distribution.disease },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D3E8DA]">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#52796F] mb-1">
            <Activity className="w-4 h-4" />
            Clinical AI &amp; Machine Learning Operations
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F3D2B]">
            Cardiovascular AI Research Dashboard
          </h1>
        </div>

        <Link
          href="/assessment"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-[#8FBF9F] text-white hover:bg-[#7CAE8E] transition-all shadow-xs self-start sm:self-auto"
        >
          New Patient Assessment
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1 */}
        <div className="bg-white rounded-2xl p-5 border border-[#D3E8DA] shadow-xs">
          <div className="flex items-center justify-between text-[#718E7B] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Total Cohort Records
            </span>
            <Users className="w-4 h-4 text-[#8FBF9F]" />
          </div>
          <div className="text-3xl font-bold text-[#1F3D2B]">
            {datasetMeta.num_samples}
          </div>
          <p className="text-xs text-[#52796F] mt-1">
            UCI Cleveland Heart Disease dataset
          </p>
        </div>

        {/* Stat 2 */}
        <div className="bg-white rounded-2xl p-5 border border-[#D3E8DA] shadow-xs">
          <div className="flex items-center justify-between text-[#718E7B] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Peak Model Recall
            </span>
            <TrendingUp className="w-4 h-4 text-[#8FBF9F]" />
          </div>
          <div className="text-3xl font-bold text-[#1F3D2B]">
            96.4%
          </div>
          <p className="text-xs text-[#52796F] mt-1">
            Minimizes undetected false negatives
          </p>
        </div>

        {/* Stat 3 */}
        <div className="bg-white rounded-2xl p-5 border border-[#D3E8DA] shadow-xs">
          <div className="flex items-center justify-between text-[#718E7B] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Primary Selected Model
            </span>
            <Award className="w-4 h-4 text-[#8FBF9F]" />
          </div>
          <div className="text-3xl font-bold text-[#1F3D2B]">
            {metrics.best_model}
          </div>
          <p className="text-xs text-[#52796F] mt-1">
            ROC-AUC: 0.946 • Test Acc: 88.5%
          </p>
        </div>

        {/* Stat 4 */}
        <div className="bg-white rounded-2xl p-5 border border-[#D3E8DA] shadow-xs">
          <div className="flex items-center justify-between text-[#718E7B] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Patient Risk Profiles
            </span>
            <Cpu className="w-4 h-4 text-[#8FBF9F]" />
          </div>
          <div className="text-3xl font-bold text-[#1F3D2B]">
            3 Clusters
          </div>
          <p className="text-xs text-[#52796F] mt-1">
            K-Means unsupervised discovery
          </p>
        </div>
      </div>

      {/* Row 1: Charts (Model Performance & Patient Cluster Distribution) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart 1: Model Performance (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#D3E8DA] p-6 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-[#D3E8DA]">
            <div>
              <h3 className="text-base font-bold text-[#1F3D2B]">
                Supervised Model Benchmarks
              </h3>
              <p className="text-xs text-[#52796F]">
                Comparison across all 6 evaluated architectures on holdout test set
              </p>
            </div>
            <Link
              href="/models"
              className="text-xs font-semibold text-[#52796F] hover:underline"
            >
              Full analysis →
            </Link>
          </div>

          <div className="h-72 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={modelPerfData}
                margin={{ top: 15, right: 15, left: -10, bottom: 10 }}
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
                      return (
                        <div className="bg-white p-3 rounded-xl border border-[#D3E8DA] shadow-md text-xs space-y-1">
                          <p className="font-bold text-[#1F3D2B]">{label}</p>
                          {payload.map((p: any) => (
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
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                <Bar dataKey="Recall" fill="#8FBF9F" radius={[4, 4, 0, 0]} />
                <Bar dataKey="ROC-AUC" fill="#52796F" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Accuracy" fill="#B7DCC4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Cluster Distribution Donut (1 col) */}
        <div className="bg-white rounded-2xl border border-[#D3E8DA] p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#D3E8DA]">
              <div>
                <h3 className="text-base font-bold text-[#1F3D2B]">
                  Patient Cluster Distribution
                </h3>
                <p className="text-xs text-[#52796F]">
                  K-Means population grouping (k=3)
                </p>
              </div>
              <Link
                href="/profiles"
                className="text-xs font-semibold text-[#52796F] hover:underline"
              >
                Profiles →
              </Link>
            </div>

            <div className="h-56 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={clusterDistData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {clusterDistData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={CLUSTER_COLORS[index % CLUSTER_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-2.5 rounded-xl border border-[#D3E8DA] shadow-md text-xs">
                            <p className="font-bold text-[#1F3D2B]">{data.fullName}</p>
                            <p className="text-[#4F6B58] mt-1">
                              Patients: <span className="font-semibold">{data.value} ({data.pct}%)</span>
                            </p>
                            <p className="text-[#4F6B58]">
                              CVD Disease Rate: <span className="font-semibold">{data.diseaseRate}%</span>
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-[#D3E8DA] text-xs">
            {clusterDistData.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-[#4F6B58]">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: CLUSTER_COLORS[i] }}
                  />
                  <span>{item.name}</span>
                </div>
                <span className="font-semibold text-[#1F3D2B]">
                  {item.value} ({item.pct}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Charts (Feature Importance & Dataset Distribution) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart 3: Global Feature Importance (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#D3E8DA] p-6 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-[#D3E8DA]">
            <div>
              <h3 className="text-base font-bold text-[#1F3D2B]">
                Global Clinical Feature Importance (SHAP)
              </h3>
              <p className="text-xs text-[#52796F]">
                Mean absolute SHAP value impact computed via TreeExplainer on XGBoost
              </p>
            </div>
          </div>

          <div className="h-72 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={featureImpData}
                margin={{ top: 10, right: 30, left: 110, bottom: 10 }}
              >
                <XAxis
                  type="number"
                  tick={{ fontSize: 11, fill: "#4F6B58" }}
                  tickLine={false}
                  axisLine={{ stroke: "#D3E8DA" }}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 11, fill: "#1F3D2B" }}
                  tickLine={false}
                  axisLine={false}
                  width={110}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-2.5 rounded-xl border border-[#D3E8DA] shadow-md text-xs">
                          <p className="font-bold text-[#1F3D2B]">{data.name}</p>
                          <p className="text-[#52796F] mt-1">
                            Mean |SHAP| Impact: <span className="font-semibold text-[#1F3D2B]">{data.importance}</span>
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="importance" fill="#8FBF9F" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Target Class Distribution (1 col) */}
        <div className="bg-white rounded-2xl border border-[#D3E8DA] p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#D3E8DA]">
              <div>
                <h3 className="text-base font-bold text-[#1F3D2B]">
                  Dataset Target Balance
                </h3>
                <p className="text-xs text-[#52796F]">
                  Cleveland cohort diagnostic status
                </p>
              </div>
            </div>

            <div className="h-56 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={targetDistData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {targetDistData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={PREDICTION_PIE_COLORS[index]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="bg-white p-2.5 rounded-xl border border-[#D3E8DA] shadow-md text-xs">
                            <p className="font-bold text-[#1F3D2B]">{d.name}</p>
                            <p className="text-[#4F6B58] mt-1">
                              Count: <span className="font-semibold">{d.value}</span>
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-[#D3E8DA] text-xs">
            <div className="flex items-center justify-between text-[#4F6B58]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#8FBF9F]" />
                <span>Absence (&lt;50% stenosis)</span>
              </div>
              <span className="font-semibold text-[#1F3D2B]">
                {datasetMeta.class_distribution.no_disease} (54.5%)
              </span>
            </div>
            <div className="flex items-center justify-between text-[#4F6B58]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F87171]" />
                <span>Presence (&gt;50% stenosis)</span>
              </div>
              <span className="font-semibold text-[#1F3D2B]">
                {datasetMeta.class_distribution.disease} (45.5%)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Disclaimer */}
      <Disclaimer />
    </div>
  );
}
