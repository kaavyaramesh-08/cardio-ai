import { Activity, Target, Network, Cpu } from "lucide-react";
import { PredictionResponse } from "@/lib/types";

interface PredictionCardProps {
  result: PredictionResponse;
}

export default function PredictionCard({ result }: PredictionCardProps) {
  const isHigh = result.prediction === 1;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card 1: Prediction */}
      <div className="bg-white rounded-2xl p-5 border border-[#D3E8DA] shadow-xs">
        <div className="flex items-center justify-between text-[#718E7B] mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">
            Model Prediction
          </span>
          <Target className="w-4 h-4 text-[#8FBF9F]" />
        </div>
        <div className="text-xl font-bold text-[#1F3D2B]">
          {isHigh ? "Higher Likelihood" : "Lower Likelihood"}
        </div>
        <p className="text-xs text-[#52796F] mt-1">
          {isHigh ? "CVD indicators detected" : "Minimal CVD signs detected"}
        </p>
      </div>

      {/* Card 2: Probability */}
      <div className="bg-white rounded-2xl p-5 border border-[#D3E8DA] shadow-xs">
        <div className="flex items-center justify-between text-[#718E7B] mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">
            Risk Probability
          </span>
          <Activity className="w-4 h-4 text-[#8FBF9F]" />
        </div>
        <div className="text-xl font-bold text-[#1F3D2B]">
          {result.probability_pct}%
        </div>
        <p className="text-xs text-[#52796F] mt-1">
          Category: <span className="font-semibold">{result.risk_level} Risk</span>
        </p>
      </div>

      {/* Card 3: Patient Cluster */}
      <div className="bg-white rounded-2xl p-5 border border-[#D3E8DA] shadow-xs">
        <div className="flex items-center justify-between text-[#718E7B] mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">
            Patient Cluster
          </span>
          <Network className="w-4 h-4 text-[#8FBF9F]" />
        </div>
        <div className="text-xl font-bold text-[#1F3D2B]">
          {result.cluster.short_name}
        </div>
        <p className="text-xs text-[#52796F] mt-1 truncate">
          Pattern: {result.cluster.name.split("—")[1] || result.cluster.name}
        </p>
      </div>

      {/* Card 4: Selected Model */}
      <div className="bg-white rounded-2xl p-5 border border-[#D3E8DA] shadow-xs">
        <div className="flex items-center justify-between text-[#718E7B] mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">
            Selected Model
          </span>
          <Cpu className="w-4 h-4 text-[#8FBF9F]" />
        </div>
        <div className="text-xl font-bold text-[#1F3D2B]">
          {result.selected_model}
        </div>
        <p className="text-xs text-[#52796F] mt-1">
          96.4% Recall on UCI Test Set
        </p>
      </div>
    </div>
  );
}
