import {
  Activity,
  Heart,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  GraduationCap,
} from "lucide-react";
import Disclaimer from "@/components/Disclaimer";

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* Header */}
      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#52796F] mb-1">
          <GraduationCap className="w-4 h-4" />
          Academic AI/ML Project Documentation
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#1F3D2B] tracking-tight">
          About CardioAI Framework
        </h1>
        <p className="text-base text-[#4F6B58] mt-2 leading-relaxed">
          AI &amp; ML Framework for Early Detection and Risk Profiling of Cardiovascular Diseases.
          Designed as an open, reproducible clinical decision-support research prototype.
        </p>
      </div>

      {/* Problem & Solution Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* The Clinical Problem */}
        <div className="bg-white rounded-2xl border border-[#D3E8DA] p-6 sm:p-8 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-700 mb-4">
            <Heart className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-[#1F3D2B]">
            1. The Clinical Problem
          </h2>
          <p className="text-sm text-[#4F6B58] mt-3 leading-relaxed">
            Cardiovascular diseases (CVDs) remain the leading cause of mortality worldwide. A significant challenge in early clinical triaging is that early-stage myocardial ischemia and coronary artery disease frequently present with <strong>atypical or asymptomatic</strong> manifestations.
          </p>
          <p className="text-sm text-[#4F6B58] mt-3 leading-relaxed">
            Conventional risk calculators (such as Framingham or SCORE) often overlook non-linear interactions across exercise-induced depression, scintigraphy defects, and hemodynamic parameters. Furthermore, machine learning models in healthcare are frequently dismissed as <em>&quot;black boxes&quot;</em> that physicians cannot interpret or trust.
          </p>
        </div>

        {/* The Proposed Solution */}
        <div className="bg-white rounded-2xl border border-[#D3E8DA] p-6 sm:p-8 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-[#EAF6EE] flex items-center justify-center text-[#1F3D2B] mb-4">
            <Activity className="w-5 h-5 text-[#52796F]" />
          </div>
          <h2 className="text-xl font-bold text-[#1F3D2B]">
            2. Our Integrated Solution
          </h2>
          <p className="text-sm text-[#4F6B58] mt-3 leading-relaxed">
            CardioAI introduces a <strong>three-tier computational methodology</strong>:
          </p>
          <ul className="text-sm text-[#4F6B58] mt-3 space-y-2">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#8FBF9F] shrink-0 mt-0.5" />
              <span><strong>Supervised Machine Learning:</strong> Benchmarked across 6 architectures with hyper-focused clinical prioritization of Recall (96.4%) and ROC-AUC (0.946) to minimize fatal false negatives.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#8FBF9F] shrink-0 mt-0.5" />
              <span><strong>Unsupervised K-Means Profiling:</strong> Automatically categorizes patients into 3 distinct population clusters (Lower-Risk, Moderate-Risk, Higher-Risk) based on statistical morphology.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#8FBF9F] shrink-0 mt-0.5" />
              <span><strong>Explainable AI via SHAP:</strong> Demystifies algorithmic decisions by decomposing every risk estimate into positive (risk-elevating) and protective clinical factors.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Technical Architecture Stack */}
      <div className="bg-white rounded-2xl border border-[#D3E8DA] p-6 sm:p-8 shadow-sm">
        <h2 className="text-xl font-bold text-[#1F3D2B] mb-4">
          3. Technology Stack &amp; Architecture
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-[#F7FBF8] border border-[#D3E8DA]">
            <span className="text-xs font-semibold text-[#52796F] block">Frontend Architecture</span>
            <span className="font-bold text-sm text-[#1F3D2B] mt-1 block">Next.js 14 App Router</span>
            <p className="text-xs text-[#718E7B] mt-1">
              React, TypeScript, Tailwind CSS, Recharts, Lucide Icons
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#F7FBF8] border border-[#D3E8DA]">
            <span className="text-xs font-semibold text-[#52796F] block">Machine Learning Core</span>
            <span className="font-bold text-sm text-[#1F3D2B] mt-1 block">Python ML Stack</span>
            <p className="text-xs text-[#718E7B] mt-1">
              Scikit-Learn, XGBoost, Pandas, NumPy, Joblib, SHAP TreeExplainer
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#F7FBF8] border border-[#D3E8DA]">
            <span className="text-xs font-semibold text-[#52796F] block">Backend API Layer</span>
            <span className="font-bold text-sm text-[#1F3D2B] mt-1 block">FastAPI &amp; Next.js Routes</span>
            <p className="text-xs text-[#718E7B] mt-1">
              RESTful endpoints with auto-fallback to serverless inference engine
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#F7FBF8] border border-[#D3E8DA]">
            <span className="text-xs font-semibold text-[#52796F] block">Deployment Readiness</span>
            <span className="font-bold text-sm text-[#1F3D2B] mt-1 block">GitHub &amp; Vercel Ready</span>
            <p className="text-xs text-[#718E7B] mt-1">
              Zero-configuration Vercel deployment with reproducible python scripts
            </p>
          </div>
        </div>
      </div>

      {/* Limitations and Future Scope */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Limitations */}
        <div className="bg-white rounded-2xl border border-[#D3E8DA] p-6 sm:p-8 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-700 mb-4">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-[#1F3D2B]">
            4. Current Limitations
          </h2>
          <ul className="text-sm text-[#4F6B58] mt-3 space-y-2.5">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-2 shrink-0" />
              <span><strong>Sample Size:</strong> The UCI Cleveland cohort comprises 303 historical records, which is suitable for algorithmic benchmarking but limited compared to modern multi-hospital registries.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-2 shrink-0" />
              <span><strong>Demographic Representation:</strong> The dataset possesses an 84% male representation, requiring external validation across broader female populations.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-2 shrink-0" />
              <span><strong>Single Timepoint:</strong> Data captures cross-sectional diagnostic tests rather than continuous longitudinal cardiac telemetry.</span>
            </li>
          </ul>
        </div>

        {/* Future Scope */}
        <div className="bg-white rounded-2xl border border-[#D3E8DA] p-6 sm:p-8 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-[#EAF6EE] flex items-center justify-center text-[#1F3D2B] mb-4">
            <Lightbulb className="w-5 h-5 text-[#52796F]" />
          </div>
          <h2 className="text-xl font-bold text-[#1F3D2B]">
            5. Future Scope &amp; Roadmap
          </h2>
          <ul className="text-sm text-[#4F6B58] mt-3 space-y-2.5">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#8FBF9F] shrink-0 mt-0.5" />
              <span><strong>Multi-Center Datasets:</strong> Integration with UK Biobank and MIMIC-IV critical care repositories.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#8FBF9F] shrink-0 mt-0.5" />
              <span><strong>Wearable Telemetry:</strong> Integration of streaming PPG and ECG signals from smartwatches and Holter monitors.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#8FBF9F] shrink-0 mt-0.5" />
              <span><strong>Hospital EHR Integration:</strong> HL7 FHIR compliance for automatic patient record parsing into clinical workflows.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#8FBF9F] shrink-0 mt-0.5" />
              <span><strong>Prospective Validation:</strong> Blinded prospective observational trials alongside board-certified cardiologists.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* College Viva / Presentation Guidance Box */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#EAF6EE] border border-[#8FBF9F] space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#52796F] uppercase tracking-wider">
          <GraduationCap className="w-4 h-4" />
          Academic Viva &amp; Demonstration Guide
        </div>
        <h3 className="text-lg font-bold text-[#1F3D2B]">
          How to Present This Project During Your Viva / Demonstration
        </h3>
        <p className="text-xs sm:text-sm text-[#4F6B58] leading-relaxed">
          1. <strong>Emphasize the Recall Focus:</strong> Point out why XGBoost was chosen with 96.4% recall — false negatives in cardiology mean an untreated cardiac patient goes home.
        </p>
        <p className="text-xs sm:text-sm text-[#4F6B58] leading-relaxed">
          2. <strong>Demonstrate the Hybrid Approach:</strong> Show both Supervised ML (exact risk probability) and Unsupervised K-Means (patient risk archetype profiling) working harmoniously.
        </p>
        <p className="text-xs sm:text-sm text-[#4F6B58] leading-relaxed">
          3. <strong>Showcase SHAP Explainability:</strong> Highlight the horizontal bar chart showing exactly which features drove the model prediction (e.g., Major Vessels, Chest Pain Type, and ST Depression).
        </p>
        <p className="text-xs sm:text-sm text-[#4F6B58] leading-relaxed">
          4. <strong>Highlight Clean Architecture:</strong> Mention the decoupled Python ML pipeline (`scripts/train_all.py`), FastAPI backend (`python_api/`), and resilient Next.js frontend with zero fake numbers.
        </p>
      </div>

      <Disclaimer />
    </div>
  );
}
