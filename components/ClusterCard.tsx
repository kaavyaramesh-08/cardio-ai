import { ClusterProfile } from "@/lib/types";
import { Network, Info } from "lucide-react";

interface ClusterCardProps {
  cluster: ClusterProfile;
}

export default function ClusterCard({ cluster }: ClusterCardProps) {
  const chars = cluster.characteristics;

  const getProfileTheme = (idx: number) => {
    switch (idx) {
      case 0:
        return {
          badge: "bg-[#EAF6EE] text-[#1F3D2B] border-[#8FBF9F]/50",
          accent: "text-[#52796F]",
        };
      case 1:
        return {
          badge: "bg-amber-50 text-amber-900 border-amber-200",
          accent: "text-amber-700",
        };
      case 2:
      default:
        return {
          badge: "bg-rose-50 text-rose-900 border-rose-200",
          accent: "text-rose-700",
        };
    }
  };

  const theme = getProfileTheme(cluster.profile_index);

  return (
    <div className="bg-white rounded-2xl border border-[#D3E8DA] p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#D3E8DA]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#EAF6EE] text-[#1F3D2B]">
            <Network className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${theme.badge}`}
              >
                {cluster.short_name}
              </span>
              {cluster.distance_to_center !== undefined && (
                <span className="text-xs text-[#718E7B]">
                  Centroid Distance: {cluster.distance_to_center}
                </span>
              )}
            </div>
            <h3 className="text-lg font-bold text-[#1F3D2B] mt-1">
              {cluster.name}
            </h3>
          </div>
        </div>

        <div className="text-left sm:text-right bg-[#F7FBF8] px-3.5 py-2 rounded-xl border border-[#D3E8DA]">
          <div className="text-[11px] text-[#718E7B]">Cluster Cohort Size</div>
          <div className="text-sm font-bold text-[#1F3D2B]">
            {cluster.size} Patients ({cluster.percentage}%)
          </div>
        </div>
      </div>

      <p className="mt-4 text-xs text-[#4F6B58] leading-relaxed">
        {cluster.description}
      </p>

      {/* Characteristic Stats Grid */}
      <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl bg-[#F7FBF8] border border-[#D3E8DA]">
          <div className="text-[11px] text-[#718E7B]">Cohort Mean Age</div>
          <div className="text-base font-bold text-[#1F3D2B] mt-0.5">
            {chars.age} yrs
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[#F7FBF8] border border-[#D3E8DA]">
          <div className="text-[11px] text-[#718E7B]">Mean Resting BP</div>
          <div className="text-base font-bold text-[#1F3D2B] mt-0.5">
            {chars.trestbps} mm Hg
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[#F7FBF8] border border-[#D3E8DA]">
          <div className="text-[11px] text-[#718E7B]">Serum Cholesterol</div>
          <div className="text-base font-bold text-[#1F3D2B] mt-0.5">
            {chars.chol} mg/dl
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[#F7FBF8] border border-[#D3E8DA]">
          <div className="text-[11px] text-[#718E7B]">Historical CVD Rate</div>
          <div className="text-base font-bold text-[#1F3D2B] mt-0.5">
            {chars.disease_rate_pct}%
          </div>
        </div>
      </div>

      {/* Cluster Disclaimer */}
      <div className="mt-4 p-3 rounded-xl bg-[#EAF6EE]/50 border border-[#D3E8DA] text-xs text-[#4F6B58] flex items-start gap-2">
        <Info className="w-4 h-4 text-[#52796F] shrink-0 mt-0.5" />
        <p>
          {cluster.disclaimer ||
            "Clusters represent statistical patterns discovered in the dataset and are not medical diagnoses."}
        </p>
      </div>
    </div>
  );
}
