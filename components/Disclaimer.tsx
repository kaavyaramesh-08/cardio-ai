import { ShieldAlert } from "lucide-react";

interface DisclaimerProps {
  customText?: string;
  className?: string;
}

export default function Disclaimer({
  customText,
  className = "",
}: DisclaimerProps) {
  return (
    <div
      className={`rounded-xl border border-amber-200/90 bg-amber-50/70 p-4 text-amber-900 ${className}`}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-semibold text-amber-950">
            Educational &amp; Research Prototype — Not a Medical Diagnosis
          </p>
          <p className="mt-1 text-amber-800 leading-relaxed text-xs sm:text-sm">
            {customText ||
              "This platform is designed solely for scientific research, academic demonstration, and algorithmic benchmarking. It does not replace professional clinical diagnosis, laboratory testing, or cardiologist evaluation. Never alter medications or healthcare plans based on these machine learning estimates."}
          </p>
        </div>
      </div>
    </div>
  );
}
