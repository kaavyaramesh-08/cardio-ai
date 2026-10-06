import { CheckCircle2, AlertTriangle, AlertOctagon } from "lucide-react";

interface RiskCardProps {
  probability: number; // 0 to 1
  probabilityPct: number; // 0 to 100
  riskLevel: "Low" | "Moderate" | "High";
  predictionLabel: string;
  selectedModel: string;
}

export default function RiskCard({
  probability,
  probabilityPct,
  riskLevel,
  predictionLabel,
  selectedModel,
}: RiskCardProps) {
  const getRiskStyles = () => {
    switch (riskLevel) {
      case "Low":
        return {
          bg: "bg-[#EAF6EE]",
          border: "border-[#8FBF9F]/50",
          text: "text-[#1F3D2B]",
          badgeBg: "bg-[#8FBF9F]/20 text-[#1F3D2B]",
          barColor: "bg-[#8FBF9F]",
          icon: <CheckCircle2 className="w-7 h-7 text-[#52796F]" />,
          title: "Lower Cardiovascular Disease Risk",
        };
      case "Moderate":
        return {
          bg: "bg-amber-50/70",
          border: "border-amber-200",
          text: "text-amber-950",
          badgeBg: "bg-amber-100 text-amber-900",
          barColor: "bg-amber-500",
          icon: <AlertTriangle className="w-7 h-7 text-amber-600" />,
          title: "Moderate Cardiovascular Disease Risk",
        };
      case "High":
        return {
          bg: "bg-rose-50/70",
          border: "border-rose-200",
          text: "text-rose-950",
          badgeBg: "bg-rose-100 text-rose-900",
          barColor: "bg-rose-500",
          icon: <AlertOctagon className="w-7 h-7 text-rose-600" />,
          title: "Higher Cardiovascular Disease Risk",
        };
    }
  };

  const styles = getRiskStyles();

  return (
    <div
      className={`rounded-2xl border ${styles.border} ${styles.bg} p-6 shadow-sm transition-all`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-white shadow-xs">
            {styles.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${styles.badgeBg}`}
              >
                {riskLevel} Risk Category
              </span>
              <span className="text-xs text-[#718E7B]">
                via {selectedModel}
              </span>
            </div>
            <h3 className={`text-xl font-bold ${styles.text} mt-1`}>
              {styles.title}
            </h3>
          </div>
        </div>

        {/* Probability display */}
        <div className="text-left sm:text-right bg-white/70 px-4 py-2.5 rounded-xl border border-white/60">
          <div className="text-xs text-[#52796F] font-medium">Model Probability</div>
          <div className="text-3xl font-extrabold tracking-tight text-[#1F3D2B]">
            {probabilityPct}%
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-5 space-y-1.5">
        <div className="flex justify-between text-xs font-medium text-[#4F6B58]">
          <span>Risk Index: {probability.toFixed(3)}</span>
          <span>Decision Threshold: 0.50</span>
        </div>
        <div className="w-full h-3 rounded-full bg-white/80 overflow-hidden border border-[#D3E8DA]">
          <div
            className={`h-full transition-all duration-700 ease-out ${styles.barColor}`}
            style={{ width: `${Math.min(100, Math.max(3, probabilityPct))}%` }}
          />
        </div>
        <div className="flex justify-between text-[11px] text-[#718E7B] pt-0.5">
          <span>0.0 (Minimal Risk)</span>
          <span>0.5 (Clinical Threshold)</span>
          <span>1.0 (Maximum Risk)</span>
        </div>
      </div>

      <p className="mt-4 text-xs text-[#52796F] border-t border-black/5 pt-3 leading-relaxed">
        <strong>Model Prediction:</strong> {predictionLabel}. Note: This probability score indicates algorithmic confidence derived from the UCI Cleveland Heart Disease cohort, not an absolute medical diagnosis.
      </p>
    </div>
  );
}
