import Link from "next/link";
import { Activity, ShieldAlert, Award, Database, Cpu } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#EAF6EE]/70 border-t border-[#D3E8DA] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: About */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#8FBF9F] flex items-center justify-center text-white">
                <Activity className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg text-[#1F3D2B]">
                Cardio<span className="text-[#52796F]">AI</span>
              </span>
            </div>
            <p className="text-sm text-[#4F6B58] max-w-md leading-relaxed">
              AI &amp; ML Framework for Early Detection and Risk Profiling of Cardiovascular Diseases.
              Combining Supervised Classification, Unsupervised K-Means Clustering, and Explainable AI (SHAP)
              for reproducible clinical research and decision-support modeling.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50/80 border border-amber-200 text-xs text-amber-900 font-medium">
              <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Educational/Research Prototype — Not a Medical Diagnosis</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-sm font-semibold text-[#1F3D2B] uppercase tracking-wider mb-3">
              Application Modules
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/assessment" className="text-[#4F6B58] hover:text-[#1F3D2B] transition-colors">
                  Patient Assessment
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-[#4F6B58] hover:text-[#1F3D2B] transition-colors">
                  Clinical Dashboard
                </Link>
              </li>
              <li>
                <Link href="/profiles" className="text-[#4F6B58] hover:text-[#1F3D2B] transition-colors">
                  K-Means Patient Profiles
                </Link>
              </li>
              <li>
                <Link href="/models" className="text-[#4F6B58] hover:text-[#1F3D2B] transition-colors">
                  Model Comparison
                </Link>
              </li>
              <li>
                <Link href="/pipeline" className="text-[#4F6B58] hover:text-[#1F3D2B] transition-colors">
                  Dataset &amp; ML Pipeline
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Technical Details */}
          <div>
            <h4 className="text-sm font-semibold text-[#1F3D2B] uppercase tracking-wider mb-3">
              Machine Learning Specs
            </h4>
            <ul className="space-y-2 text-sm text-[#4F6B58]">
              <li className="flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-[#8FBF9F]" />
                UCI Cleveland Heart Dataset
              </li>
              <li className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-[#8FBF9F]" />
                6 Supervised Models (XGBoost 96.4% Recall)
              </li>
              <li className="flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-[#8FBF9F]" />
                K-Means (k=3 Clinical Profiles)
              </li>
              <li className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-[#8FBF9F]" />
                TreeExplainer SHAP Attribution
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-[#D3E8DA] flex flex-col sm:flex-row items-center justify-between text-xs text-[#718E7B] gap-4">
          <p>© {new Date().getFullYear()} CardioAI — Academic Research &amp; Decision-Support Prototype.</p>
          <p>Designed for academic demonstration and clinical decision-support evaluation.</p>
        </div>
      </div>
    </footer>
  );
}
