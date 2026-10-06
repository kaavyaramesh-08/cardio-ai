import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Cpu,
  Network,
  Eye,
  Database,
  BarChart2,
  Layers,
  Sparkles,
} from "lucide-react";
import Disclaimer from "@/components/Disclaimer";

export default function HomePage() {
  return (
    <div className="space-y-16 sm:space-y-24 py-8 sm:py-12">
      {/* 1. Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EAF6EE] border border-[#8FBF9F]/60 text-xs font-semibold text-[#1F3D2B]">
            <Sparkles className="w-3.5 h-3.5 text-[#52796F]" />
            Academic Research Prototype • UCI Cleveland Dataset
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#1F3D2B] leading-tight">
            AI-Powered Cardiovascular{" "}
            <span className="text-[#52796F] underline decoration-[#8FBF9F] decoration-wavy decoration-2">
              Risk Assessment
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[#4F6B58] max-w-2xl mx-auto leading-relaxed">
            “Combining Machine Learning, Patient Profiling and Explainable AI for Early Cardiovascular Risk Assessment.”
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/assessment"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-white bg-[#8FBF9F] hover:bg-[#7CAE8E] transition-all shadow-sm hover:shadow text-base"
            >
              Start Risk Assessment
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-[#1F3D2B] bg-white hover:bg-[#EAF6EE] border border-[#D3E8DA] transition-all shadow-xs text-base"
            >
              Explore Dashboard
              <BarChart2 className="w-4 h-4 text-[#52796F]" />
            </Link>
          </div>

          {/* Disclaimer */}
          <div className="max-w-2xl mx-auto pt-4">
            <Disclaimer customText="Educational/Research Prototype — Not a Medical Diagnosis. Designed for computational benchmarking and educational demonstration of machine learning pipelines." />
          </div>
        </div>
      </section>

      {/* 2. Visual AI/ML Pipeline Architecture */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-[#D3E8DA] p-6 sm:p-10 shadow-sm">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-xs font-semibold text-[#52796F] uppercase tracking-wider">
              End-to-End Computational Pipeline
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1F3D2B] mt-1">
              From Clinical Data to Explainable Inference
            </h2>
            <p className="text-xs sm:text-sm text-[#718E7B] mt-2">
              A transparent, reproducible pipeline integrating statistical learning and clinical explainability
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
            {/* Step 1 */}
            <div className="p-4 rounded-2xl bg-[#F7FBF8] border border-[#D3E8DA] flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-xl bg-[#EAF6EE] flex items-center justify-center text-[#1F3D2B] mb-3">
                <Database className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-[#1F3D2B]">1. Clinical Data</span>
              <p className="text-[11px] text-[#718E7B] mt-1">
                13 physiological metrics (UCI Cleveland)
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-4 rounded-2xl bg-[#F7FBF8] border border-[#D3E8DA] flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-xl bg-[#EAF6EE] flex items-center justify-center text-[#1F3D2B] mb-3">
                <Layers className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-[#1F3D2B]">2. Preprocessing</span>
              <p className="text-[11px] text-[#718E7B] mt-1">
                Imputation, scaling, stratified 80/20 split
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-4 rounded-2xl bg-[#F7FBF8] border border-[#D3E8DA] flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-xl bg-[#EAF6EE] flex items-center justify-center text-[#1F3D2B] mb-3">
                <Cpu className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-[#1F3D2B]">3. Supervised ML</span>
              <p className="text-[11px] text-[#718E7B] mt-1">
                6 models trained, XGBoost selected
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-4 rounded-2xl bg-[#F7FBF8] border border-[#D3E8DA] flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-xl bg-[#EAF6EE] flex items-center justify-center text-[#1F3D2B] mb-3">
                <Network className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-[#1F3D2B]">4. K-Means Profiling</span>
              <p className="text-[11px] text-[#718E7B] mt-1">
                k=3 clinical archetypes discovered
              </p>
            </div>

            {/* Step 5 */}
            <div className="p-4 rounded-2xl bg-[#EAF6EE] border border-[#8FBF9F] flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-xl bg-[#8FBF9F] flex items-center justify-center text-white mb-3">
                <Eye className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-[#1F3D2B]">5. SHAP XAI</span>
              <p className="text-[11px] text-[#52796F] mt-1">
                Local feature attribution explanations
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Three Core Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-semibold text-[#52796F] uppercase tracking-wider">
            Three Core Innovations
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1F3D2B] mt-1">
            Engineered for Clinical Transparency
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pillar 1: Disease Prediction */}
          <div className="bg-white rounded-2xl border border-[#D3E8DA] p-6 shadow-sm hover:border-[#8FBF9F] transition-all group">
            <div className="w-12 h-12 rounded-xl bg-[#EAF6EE] flex items-center justify-center text-[#1F3D2B] mb-5 group-hover:scale-105 transition-transform">
              <Activity className="w-6 h-6 text-[#52796F]" />
            </div>
            <h3 className="text-lg font-bold text-[#1F3D2B]">
              Supervised Disease Prediction
            </h3>
            <p className="text-xs sm:text-sm text-[#4F6B58] mt-2 leading-relaxed">
              Trained across 6 algorithms (Logistic Regression, SVM, Decision Tree, Random Forest, XGBoost, and Deep Neural Network). Benchmarked with strict healthcare emphasis on Recall (96.4%) and ROC-AUC (0.946).
            </p>
            <div className="mt-4 pt-4 border-t border-[#D3E8DA] flex items-center justify-between text-xs text-[#718E7B]">
              <span>Selected: XGBoost</span>
              <Link href="/models" className="font-semibold text-[#52796F] hover:underline">
                Compare models →
              </Link>
            </div>
          </div>

          {/* Pillar 2: Patient Profiling */}
          <div className="bg-white rounded-2xl border border-[#D3E8DA] p-6 shadow-sm hover:border-[#8FBF9F] transition-all group">
            <div className="w-12 h-12 rounded-xl bg-[#EAF6EE] flex items-center justify-center text-[#1F3D2B] mb-5 group-hover:scale-105 transition-transform">
              <Network className="w-6 h-6 text-[#52796F]" />
            </div>
            <h3 className="text-lg font-bold text-[#1F3D2B]">
              K-Means Patient Profiling
            </h3>
            <p className="text-xs sm:text-sm text-[#4F6B58] mt-2 leading-relaxed">
              Unsupervised clustering partitions patient cohorts into 3 statistical archetypes: Lower-Risk, Moderate-Risk, and Higher-Risk patterns. Contextualizes the patient against population clusters.
            </p>
            <div className="mt-4 pt-4 border-t border-[#D3E8DA] flex items-center justify-between text-xs text-[#718E7B]">
              <span>Silhouette Score: 0.133</span>
              <Link href="/profiles" className="font-semibold text-[#52796F] hover:underline">
                View profiles →
              </Link>
            </div>
          </div>

          {/* Pillar 3: Explainable AI */}
          <div className="bg-white rounded-2xl border border-[#D3E8DA] p-6 shadow-sm hover:border-[#8FBF9F] transition-all group">
            <div className="w-12 h-12 rounded-xl bg-[#EAF6EE] flex items-center justify-center text-[#1F3D2B] mb-5 group-hover:scale-105 transition-transform">
              <Eye className="w-6 h-6 text-[#52796F]" />
            </div>
            <h3 className="text-lg font-bold text-[#1F3D2B]">
              Explainable AI via SHAP
            </h3>
            <p className="text-xs sm:text-sm text-[#4F6B58] mt-2 leading-relaxed">
              Provides game-theoretic Shapley additive feature attributions for every individual patient assessment. Highlights exactly which clinical parameters push risk higher or act protectively.
            </p>
            <div className="mt-4 pt-4 border-t border-[#D3E8DA] flex items-center justify-between text-xs text-[#718E7B]">
              <span>TreeExplainer powered</span>
              <Link href="/assessment" className="font-semibold text-[#52796F] hover:underline">
                Test SHAP live →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Quantitative Performance Metrics Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#EAF6EE] border border-[#8FBF9F] p-8 sm:p-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-[#1F3D2B]">
                96.4%
              </div>
              <div className="text-xs sm:text-sm font-semibold text-[#52796F] mt-1">
                Clinical Recall (Sensitivity)
              </div>
              <p className="text-[11px] text-[#718E7B] mt-0.5">
                Minimizes false negatives in screening
              </p>
            </div>

            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-[#1F3D2B]">
                0.946
              </div>
              <div className="text-xs sm:text-sm font-semibold text-[#52796F] mt-1">
                ROC-AUC Discriminability
              </div>
              <p className="text-[11px] text-[#718E7B] mt-0.5">
                High discriminative capacity
              </p>
            </div>

            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-[#1F3D2B]">
                303
              </div>
              <div className="text-xs sm:text-sm font-semibold text-[#52796F] mt-1">
                Clinical Cohort Records
              </div>
              <p className="text-[11px] text-[#718E7B] mt-0.5">
                UCI Cleveland benchmark dataset
              </p>
            </div>

            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-[#1F3D2B]">
                3 Archetypes
              </div>
              <div className="text-xs sm:text-sm font-semibold text-[#52796F] mt-1">
                K-Means Patient Profiles
              </div>
              <p className="text-[11px] text-[#718E7B] mt-0.5">
                Low, Moderate, and High patterns
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Direct Call to Action */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#1F3D2B]">
          Ready to Evaluate a Patient Clinical Profile?
        </h2>
        <p className="text-sm text-[#4F6B58] max-w-xl mx-auto">
          Input standard non-invasive clinical values or select a pre-loaded case to inspect risk probability, cluster classification, and SHAP factor attribution.
        </p>
        <div className="pt-2">
          <Link
            href="/assessment"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-white bg-[#8FBF9F] hover:bg-[#7CAE8E] transition-all shadow-sm text-base"
          >
            Launch Patient Assessment Form
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
