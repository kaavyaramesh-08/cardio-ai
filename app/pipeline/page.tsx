import Link from "next/link";
import {
  Database,
  Layers,
  Cpu,
  Network,
  Eye,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import mlBundle from "@/lib/ml-data/ml_bundle.json";
import Disclaimer from "@/components/Disclaimer";

export default function PipelinePage() {
  const dataset = mlBundle.dataset_meta;

  const PIPELINE_STEPS = [
    {
      num: "01",
      name: "Data Collection",
      desc: "Retrieved the 303 patient records from the UCI Cleveland Heart Disease repository across 13 clinical biomarkers.",
      icon: <Database className="w-5 h-5 text-[#52796F]" />,
      stats: "303 records, 14 raw columns",
    },
    {
      num: "02",
      name: "Data Cleaning & Imputation",
      desc: "Imputed 6 missing values (median for numerical, mode for categorical ca/thal). Converted multi-class target to binary presence (0 vs 1).",
      icon: <Layers className="w-5 h-5 text-[#52796F]" />,
      stats: "Zero missing values remaining",
    },
    {
      num: "03",
      name: "Stratified Train/Test Split",
      desc: "Split into 80% training (242 samples) and 20% hold-out test set (61 samples) with random_state=42 and target stratification.",
      icon: <Layers className="w-5 h-5 text-[#52796F]" />,
      stats: "242 train / 61 test",
    },
    {
      num: "04",
      name: "StandardScaler Normalization",
      desc: "Standardized all 13 features to zero mean and unit variance based strictly on the training set to prevent data leakage.",
      icon: <Layers className="w-5 h-5 text-[#52796F]" />,
      stats: "Mean: 0.0, Std: 1.0",
    },
    {
      num: "05",
      name: "K-Means Patient Profiling",
      desc: "Trained unsupervised K-Means (k=3) based on Silhouette analysis. Discovered 3 distinct clinical risk archetypes.",
      icon: <Network className="w-5 h-5 text-[#52796F]" />,
      stats: "k=3, Silhouette: 0.133",
    },
    {
      num: "06",
      name: "Supervised Model Training",
      desc: "Trained 6 diverse classification algorithms: Logistic Regression, SVM, Decision Tree, Random Forest, XGBoost, and Deep Neural Network.",
      icon: <Cpu className="w-5 h-5 text-[#52796F]" />,
      stats: "6 models trained & saved",
    },
    {
      num: "07",
      name: "Model Evaluation & Selection",
      desc: "Evaluated holdout test set with clinical emphasis on Recall and ROC-AUC. Selected XGBoost (96.4% Recall, 0.946 ROC-AUC).",
      icon: <CheckCircle2 className="w-5 h-5 text-[#52796F]" />,
      stats: "XGBoost chosen as champion",
    },
    {
      num: "08",
      name: "SHAP Explainability Engine",
      desc: "Integrated TreeExplainer to compute exact game-theoretic Shapley additive feature attributions for every individual patient.",
      icon: <Eye className="w-5 h-5 text-[#52796F]" />,
      stats: "Local & Global attribution",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D3E8DA]">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#52796F] mb-1">
            <Layers className="w-4 h-4" />
            Machine Learning Pipeline Architecture
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F3D2B]">
            Dataset &amp; ML Workflow Pipeline
          </h1>
          <p className="text-sm text-[#4F6B58] mt-1 max-w-2xl">
            A fully transparent, reproducible pipeline from raw UCI Cleveland clinical records to explainable inference.
          </p>
        </div>

        <Link
          href="/assessment"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-[#8FBF9F] text-white hover:bg-[#7CAE8E] transition-all shadow-xs self-start sm:self-auto"
        >
          Run Pipeline
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Dataset Summary Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-[#D3E8DA]">
          <span className="text-xs text-[#718E7B] font-medium block">Dataset Source</span>
          <span className="text-base font-bold text-[#1F3D2B] mt-0.5 block">UCI Cleveland</span>
          <span className="text-[11px] text-[#52796F]">Gold standard clinical benchmark</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#D3E8DA]">
          <span className="text-xs text-[#718E7B] font-medium block">Total Cohort Size</span>
          <span className="text-base font-bold text-[#1F3D2B] mt-0.5 block">{dataset.num_samples} Samples</span>
          <span className="text-[11px] text-[#52796F]">13 clinical features + target</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#D3E8DA]">
          <span className="text-xs text-[#718E7B] font-medium block">Train / Test Partition</span>
          <span className="text-base font-bold text-[#1F3D2B] mt-0.5 block">80% / 20%</span>
          <span className="text-[11px] text-[#52796F]">242 train / 61 test (stratified)</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#D3E8DA]">
          <span className="text-xs text-[#718E7B] font-medium block">Missing Values Fixed</span>
          <span className="text-base font-bold text-[#1F3D2B] mt-0.5 block">{dataset.missing_values_handled} Imputed</span>
          <span className="text-[11px] text-[#52796F]">Median / mode imputation</span>
        </div>
      </div>

      {/* Step by Step Pipeline Grid */}
      <div className="bg-white rounded-2xl border border-[#D3E8DA] p-6 sm:p-8 shadow-sm">
        <h3 className="text-lg font-bold text-[#1F3D2B] mb-1">
          End-to-End Pipeline Steps
        </h3>
        <p className="text-xs text-[#52796F] mb-6">
          Sequential execution flow reproducible via <code>python scripts/train_all.py</code>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {PIPELINE_STEPS.map((step) => (
            <div
              key={step.num}
              className="p-4 rounded-xl bg-[#F7FBF8] border border-[#D3E8DA] flex flex-col justify-between hover:border-[#8FBF9F] transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-bold text-[#8FBF9F]">
                    {step.num}
                  </span>
                  <div className="p-1.5 rounded-lg bg-[#EAF6EE]">
                    {step.icon}
                  </div>
                </div>
                <h4 className="font-bold text-sm text-[#1F3D2B]">{step.name}</h4>
                <p className="text-xs text-[#4F6B58] mt-1.5 leading-relaxed">
                  {step.desc}
                </p>
              </div>
              <div className="mt-4 pt-2 border-t border-[#D3E8DA] text-[11px] font-semibold text-[#52796F]">
                {step.stats}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Schema Table */}
      <div className="bg-white rounded-2xl border border-[#D3E8DA] overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-[#D3E8DA] bg-[#F7FBF8]">
          <h3 className="text-base font-bold text-[#1F3D2B]">
            Clinical Features Dictionary &amp; Schema
          </h3>
          <p className="text-xs text-[#52796F]">
            The 13 clinical biomarkers utilized across unsupervised clustering and supervised modeling
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#EAF6EE]/50 text-xs font-semibold text-[#1F3D2B] uppercase tracking-wider border-b border-[#D3E8DA]">
              <tr>
                <th className="py-3 px-4">Feature Code</th>
                <th className="py-3 px-4">Clinical Description</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Values / Units</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D3E8DA]">
              <tr>
                <td className="py-2.5 px-4 font-mono font-semibold text-[#1F3D2B]">age</td>
                <td className="py-2.5 px-4 text-[#4F6B58]">Patient age in years</td>
                <td className="py-2.5 px-4">Numerical</td>
                <td className="py-2.5 px-4 text-[#718E7B]">29 - 77 years (mean: 54.4)</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-mono font-semibold text-[#1F3D2B]">sex</td>
                <td className="py-2.5 px-4 text-[#4F6B58]">Biological sex</td>
                <td className="py-2.5 px-4">Categorical</td>
                <td className="py-2.5 px-4 text-[#718E7B]">1 = Male, 0 = Female</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-mono font-semibold text-[#1F3D2B]">cp</td>
                <td className="py-2.5 px-4 text-[#4F6B58]">Chest pain type</td>
                <td className="py-2.5 px-4">Categorical</td>
                <td className="py-2.5 px-4 text-[#718E7B]">1: Typical, 2: Atypical, 3: Non-anginal, 4: Asymptomatic</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-mono font-semibold text-[#1F3D2B]">trestbps</td>
                <td className="py-2.5 px-4 text-[#4F6B58]">Resting systolic blood pressure</td>
                <td className="py-2.5 px-4">Numerical</td>
                <td className="py-2.5 px-4 text-[#718E7B]">94 - 200 mm Hg on hospital admission</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-mono font-semibold text-[#1F3D2B]">chol</td>
                <td className="py-2.5 px-4 text-[#4F6B58]">Serum cholesterol</td>
                <td className="py-2.5 px-4">Numerical</td>
                <td className="py-2.5 px-4 text-[#718E7B]">126 - 564 mg/dl</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-mono font-semibold text-[#1F3D2B]">fbs</td>
                <td className="py-2.5 px-4 text-[#4F6B58]">Fasting blood sugar &gt; 120 mg/dl</td>
                <td className="py-2.5 px-4">Categorical</td>
                <td className="py-2.5 px-4 text-[#718E7B]">1 = True, 0 = False</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-mono font-semibold text-[#1F3D2B]">restecg</td>
                <td className="py-2.5 px-4 text-[#4F6B58]">Resting electrocardiographic results</td>
                <td className="py-2.5 px-4">Categorical</td>
                <td className="py-2.5 px-4 text-[#718E7B]">0: Normal, 1: ST-T wave, 2: LVH</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-mono font-semibold text-[#1F3D2B]">thalach</td>
                <td className="py-2.5 px-4 text-[#4F6B58]">Maximum heart rate achieved</td>
                <td className="py-2.5 px-4">Numerical</td>
                <td className="py-2.5 px-4 text-[#718E7B]">71 - 202 bpm during stress testing</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-mono font-semibold text-[#1F3D2B]">exang</td>
                <td className="py-2.5 px-4 text-[#4F6B58]">Exercise-induced angina</td>
                <td className="py-2.5 px-4">Categorical</td>
                <td className="py-2.5 px-4 text-[#718E7B]">1 = Yes, 0 = No</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-mono font-semibold text-[#1F3D2B]">oldpeak</td>
                <td className="py-2.5 px-4 text-[#4F6B58]">ST depression induced by exercise</td>
                <td className="py-2.5 px-4">Numerical</td>
                <td className="py-2.5 px-4 text-[#718E7B]">0.0 - 6.2 mm</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-mono font-semibold text-[#1F3D2B]">slope</td>
                <td className="py-2.5 px-4 text-[#4F6B58]">Slope of peak exercise ST segment</td>
                <td className="py-2.5 px-4">Categorical</td>
                <td className="py-2.5 px-4 text-[#718E7B]">1: Upsloping, 2: Flat, 3: Downsloping</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-mono font-semibold text-[#1F3D2B]">ca</td>
                <td className="py-2.5 px-4 text-[#4F6B58]">Major vessels colored by fluoroscopy</td>
                <td className="py-2.5 px-4">Numerical</td>
                <td className="py-2.5 px-4 text-[#718E7B]">0 - 3 major vessels</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-mono font-semibold text-[#1F3D2B]">thal</td>
                <td className="py-2.5 px-4 text-[#4F6B58]">Thalassemia scintigraphy</td>
                <td className="py-2.5 px-4">Categorical</td>
                <td className="py-2.5 px-4 text-[#718E7B]">3 = Normal, 6 = Fixed, 7 = Reversible</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <Disclaimer />
    </div>
  );
}
