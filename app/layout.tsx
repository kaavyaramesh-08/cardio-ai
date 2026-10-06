import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "CardioAI — AI & ML Framework for Early Detection and Risk Profiling of Cardiovascular Diseases",
  description:
    "An academic research framework combining Supervised Machine Learning, K-Means Patient Risk Profiling, and SHAP Explainability for clinical cardiovascular screening.",
  keywords: [
    "Cardiovascular Disease",
    "Machine Learning",
    "SHAP Explainability",
    "K-Means Clustering",
    "Clinical AI",
    "Healthcare Dashboard",
    "Cleveland Heart Disease",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-[#F7FBF8] text-[#1F3D2B] flex flex-col antialiased selection:bg-[#B7DCC4] selection:text-[#1F3D2B]">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
