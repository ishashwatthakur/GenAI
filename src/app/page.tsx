"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import UploadForm from "@/components/UploadForm";
import AnalysisResults from "@/components/AnalysisResults";
import type { AnalysisResult } from "@/types/analysis";
import { StarsCanvas } from "@/components/StarsCanvas";

export default function Home(): JSX.Element {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const uploadSectionRef = useRef<HTMLElement>(null);

  const handleDocumentUpload = async (file: File): Promise<void> => {
    setLoading(true);
    setError(null);
    setAnalysis(null);
    setUploadProgress(0);
    setAnalyzing(false);

    // Simulate a quick upload for a better user experience
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 95) { // Stop just before 100%
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 10;
      });
    }, 50);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/document-process", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);
      setAnalyzing(true);

      if (!response.ok) {
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();

      if (result.success) {
        setAnalysis(result.analysis);
      } else {
        setError(result.error || "An unknown error occurred during analysis.");
      }

    } catch (e: unknown) {
      clearInterval(progressInterval); // Ensure interval is cleared on error
      setError(e instanceof Error ? e.message : "An unexpected error occurred.");
    } finally {
      setLoading(false);
      setAnalyzing(false); // This ensures 'analyzing' is always reset correctly
    }
  };

  const handleAnalyzeAnother = (): void => {
    setAnalysis(null);
    setError(null);
    setLoading(false);
    setUploadProgress(0);
  };

  const handleExportAnalysis = () => {
    // Add your export logic here
    console.log("Exporting analysis...");
  };

  return (
    <main ref={uploadSectionRef} className="flex min-h-screen flex-col items-center justify-center p-8 bg-gray-900 text-white relative overflow-hidden">
      <StarsCanvas />
      
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="z-10 w-full max-w-4xl"
      >
        {!analysis && (
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4">Legal Document Analyzer</h1>
            <p className="text-xl text-gray-300">
              Upload your legal documents to get instant insights and risk analysis.
            </p>
          </div>
        )}

        {analysis ? (
          <AnalysisResults
            analysisResult={analysis}
            onAnalyzeAnother={handleAnalyzeAnother}
            onExportAnalysis={handleExportAnalysis}
            uploadSectionRef={uploadSectionRef}
          />
        ) : (
          <UploadForm
            onDocumentUpload={handleDocumentUpload}
            loading={loading}
            uploadProgress={uploadProgress}
            analyzing={analyzing}
          />
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6 text-center text-red-400 bg-red-900/20 p-4 rounded-lg"
          >
            <p className="font-semibold">Analysis Failed</p>
            <p>{error}</p>
          </motion.div>
        )}
      </motion.div>
    </main>
  );
}