"use client";

import { useState, useEffect } from "react";
import { setDocumentAnalysis } from '../lib/documentContext';
import { motion, AnimatePresence } from "framer-motion";
import RiskMeter from "./features/RiskMeter";
import ClauseSeverityCards from "./features/ClauseSeverityCards";
import ObligationsTimeline from "./features/ObligationsTimeline";
import DocumentHeatmap from "./features/DocumentHeatmap";
import ComparativeCharts from "./features/ComparativeCharts";
import RiskRadarChart from "./features/RiskRadarChart";
import PositiveClausesCarousel from "./features/PositiveClausesCarousel";
import ActionItems from "./features/ActionItems";
import FinalVerdictBar from "./features/FinalVerdictBar";

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -60 },
  transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

export default function AnalysisResults({ analysisResult, onExportAnalysis, onAnalyzeAnother, uploadSectionRef }) {
  const [expandedClauses, setExpandedClauses] = useState({});
  const [showChatbotHint, setShowChatbotHint] = useState(true);

  const analysis = analysisResult;
  
  useEffect(() => {
    if (analysis && analysis.metadata) {
      setDocumentAnalysis(analysis, analysis.metadata.fileName);
      console.log('Analysis stored in context:', analysis);
    }
  }, [analysis]);
  
  if (!analysis) return null;

  // Calculate metrics for Quick Metrics
  const criticalCount = analysis.flaggedClauses?.filter(c => c.severity === 'critical').length || 0;
  const warningCount = analysis.flaggedClauses?.filter(c => c.severity === 'warning').length || 0;
  const positiveCount = analysis.positiveProvisions?.length || 0;
  const actionCount = analysis.actionItems?.length || 0;

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
      className="relative w-full min-h-screen px-4 sm:px-6 lg:px-8 py-16 lg:py-24 overflow-x-hidden"
      data-results-section
    >
      {/* Enhanced Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"
          animate={{
            x: [-100, 100, -100],
            y: [-50, 50, -50],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Sticky Export Button */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="sticky top-4 z-50 flex justify-end mb-6"
        >
          <motion.button
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 10px 40px rgba(168, 85, 247, 0.4)"
            }}
            whileTap={{ scale: 0.98 }}
            onClick={onExportAnalysis}
            className="group relative px-6 py-3 bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 rounded-xl font-semibold text-white shadow-2xl overflow-hidden"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
            <span className="relative flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export Report
            </span>
          </motion.button>
        </motion.div>

        {/* Hero Header */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          className="text-center mb-16 relative"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-blue-600/10 blur-3xl"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-block mb-4"
          >
            <span className="text-5xl">📊</span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-6 leading-tight">
            Analysis Complete
          </h2>
          <motion.div 
            className="flex flex-wrap items-center justify-center gap-4 text-base text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <span className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-full backdrop-blur-sm">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              {analysis.documentType}
            </span>
            <span className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-full backdrop-blur-sm">
              📄 {analysis.metadata?.wordCount || 'N/A'} words
            </span>
            <span className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-full backdrop-blur-sm">
              ⏱️ {analysis.metadata?.estimatedReadTime || 'N/A'}
            </span>
          </motion.div>
        </motion.div>

        {/* AI Chatbot Hint */}
        <AnimatePresence>
          {showChatbotHint && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
              className="mb-8 relative"
            >
              <div className="bg-gradient-to-r from-purple-900/40 via-indigo-900/40 to-blue-900/40 border border-purple-500/30 rounded-2xl p-6 backdrop-blur-md shadow-2xl">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    <motion.div
                      animate={{
                        rotate: [0, 10, -10, 10, 0],
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="text-3xl"
                    >
                      💬
                    </motion.div>
                    <div className="flex-1">
                      <h4 className="text-base font-semibold text-white mb-1">Ask AI About This Analysis</h4>
                      <p className="text-gray-300 text-sm">
                        Click the chat button below or in the bottom-right corner for detailed explanations
                      </p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowChatbotHint(false)}
                    className="text-gray-400 hover:text-white transition-colors p-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <motion.div 
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="space-y-8"
        >
          {/* Risk Overview - Two Column Layout */}
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Risk Meter Card */}
            <motion.div
              variants={fadeInUp}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-50" />
              <div className="relative bg-gray-900/80 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-8 shadow-2xl hover:shadow-purple-500/10 transition-all duration-500">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">Risk Assessment</h3>
                  <motion.span 
                    className="text-2xl"
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    🎯
                  </motion.span>
                </div>
                <RiskMeter score={analysis.overallRiskScore} riskLevel={analysis.riskLevel} />
                <motion.div 
                  className="mt-6 p-4 bg-black/30 rounded-xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {analysis.riskLevel === 'High' && '⚠️ This contract requires immediate attention and legal review.'}
                    {analysis.riskLevel === 'Medium' && '📋 Review carefully and consider negotiating key terms.'}
                    {analysis.riskLevel === 'Low' && '✅ This contract appears generally favorable.'}
                  </p>
                </motion.div>
              </div>
            </motion.div>

            {/* Summary Card */}
            <motion.div
              variants={fadeInUp}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-cyan-600/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-50" />
              <div className="relative bg-gray-900/80 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-8 shadow-2xl hover:shadow-blue-500/10 transition-all duration-500">
                <div className="flex items-center gap-3 mb-6">
                  <motion.span 
                    className="text-2xl"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    📋
                  </motion.span>
                  <h3 className="text-xl font-bold text-white">Executive Summary</h3>
                </div>
                <p className="text-gray-300 leading-relaxed mb-6 text-sm">
                  {analysis.summary}
                </p>
                <div className="space-y-3">
                  {[
                    { icon: '👥', label: 'Parties', value: analysis.parties?.join(' & ') || 'Not specified' },
                    { icon: '📅', label: 'Effective Date', value: analysis.effectiveDate || 'Not specified' },
                    { icon: '⏰', label: 'Expiration', value: analysis.expirationDate || 'Not specified' }
                  ].map((item, index) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      whileHover={{ x: 5 }}
                      className="flex items-start gap-3 p-3 rounded-xl transition-all duration-300 hover:bg-black/30"
                    >
                      <span className="text-xl">{item.icon}</span>
                                            <div className="flex-1">
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{item.label}</p>
                        <p className="text-gray-200 font-medium text-sm">{item.value}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Final Verdict with Quick Metrics - Full Width Row */}
          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Final Verdict - Takes 2 columns */}
            <motion.div variants={fadeInUp} className="lg:col-span-2 relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-blue-600/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500" />
              <div className="relative bg-gray-900/80 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-8 shadow-2xl">
                <FinalVerdictBar finalVerdict={analysis.finalVerdict} flaggedClauses={analysis.flaggedClauses} />
              </div>
            </motion.div>

            {/* Quick Metrics - Takes 1 column */}
            <motion.div 
              variants={fadeInUp}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 to-teal-600/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-50" />
              <div className="relative bg-gray-900/80 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-8 shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500 h-full">
                <h3 className="text-lg font-bold text-white mb-6">Quick Metrics</h3>
                <div className="space-y-4">
                  {[
                    { 
                      label: 'Critical Issues', 
                      value: criticalCount,
                      icon: '🚨',
                      color: 'text-red-400',
                      bgColor: 'bg-red-500/10',
                      borderColor: 'border-red-500/30'
                    },
                    { 
                      label: 'Warnings', 
                      value: warningCount,
                      icon: '⚠️',
                      color: 'text-yellow-400',
                      bgColor: 'bg-yellow-500/10',
                      borderColor: 'border-yellow-500/30'
                    },
                    { 
                      label: 'Positive Clauses', 
                      value: positiveCount,
                      icon: '✅',
                      color: 'text-green-400',
                      bgColor: 'bg-green-500/10',
                      borderColor: 'border-green-500/30'
                    },
                    { 
                      label: 'Action Items', 
                      value: actionCount,
                      icon: '📋',
                      color: 'text-blue-400',
                      bgColor: 'bg-blue-500/10',
                      borderColor: 'border-blue-500/30'
                    }
                  ].map((metric, index) => (
                    <motion.div
                      key={metric.label}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                      whileHover={{ scale: 1.05, x: 5 }}
                      className={`flex items-center justify-between p-4 ${metric.bgColor} rounded-xl border ${metric.borderColor} hover:border-opacity-50 transition-all duration-300`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{metric.icon}</span>
                        <span className="text-gray-300 font-medium text-sm">{metric.label}</span>
                      </div>
                      <motion.span 
                        className={`text-2xl font-bold ${metric.color}`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.8 + index * 0.1, type: "spring" }}
                      >
                        {metric.value}
                      </motion.span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Risk Radar Chart - Full Width */}
          <motion.div 
            variants={fadeInUp}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-50" />
            <div className="relative bg-gray-900/80 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-8 shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500">
              <div className="flex items-center gap-3 mb-6">
                <motion.span 
                  className="text-2xl"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                >
                  📡
                </motion.span>
                <h3 className="text-xl font-bold text-white">Risk Distribution Analysis</h3>
              </div>
              <RiskRadarChart riskCategories={analysis.riskCategories} />
            </div>
          </motion.div>

          {/* Document Heatmap - Full Width */}
          <motion.div variants={fadeInUp} className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600/10 to-red-600/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500" />
            <div className="relative bg-gray-900/80 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <motion.span 
                  className="text-2xl"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  🗺️
                </motion.span>
                <h3 className="text-xl font-bold text-white">Document Risk Heatmap</h3>
              </div>
              <DocumentHeatmap 
                clauses={analysis.flaggedClauses} 
                totalPages={analysis.metadata?.pageCount || 10} 
              />
            </div>
          </motion.div>

          {/* Flagged Clauses Section */}
          <motion.div variants={fadeInUp} className="relative">
            <div className="flex items-center gap-3 mb-6">
              <motion.span 
                className="text-3xl"
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.2, 1]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ⚡
              </motion.span>
              <h3 className="text-2xl font-bold text-white">Flagged Clauses</h3>
            </div>
            <ClauseSeverityCards clauses={analysis.flaggedClauses} />
          </motion.div>

          {/* Timeline & Comparison Section */}
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Timeline */}
            <motion.div variants={fadeInUp} className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-50" />
              <div className="relative bg-gray-900/80 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-8 shadow-2xl hover:shadow-violet-500/10 transition-all duration-500">
                <div className="flex items-center gap-3 mb-6">
                  <motion.span 
                    className="text-2xl"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    📅
                  </motion.span>
                  <h3 className="text-xl font-bold text-white">Timeline & Obligations</h3>
                </div>
                <ObligationsTimeline 
                  obligations={analysis.obligations} 
                  keyDates={analysis.keyDates} 
                />
              </div>
            </motion.div>

            {/* Industry Comparison */}
            <motion.div variants={fadeInUp} className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-sky-600/20 to-blue-600/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-50" />
              <div className="relative bg-gray-900/80 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-8 shadow-2xl hover:shadow-sky-500/10 transition-all duration-500">
                <div className="flex items-center gap-3 mb-6">
                  <motion.span 
                    className="text-2xl"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    📊
                  </motion.span>
                  <h3 className="text-xl font-bold text-white">Industry Benchmark</h3>
                </div>
                <ComparativeCharts 
                  industryComparison={analysis.industryComparison} 
                  metadata={analysis.metadata} 
                />
              </div>
            </motion.div>
          </div>

          {/* Positive Provisions Section */}
          <motion.div variants={fadeInUp} className="relative">
            <div className="flex items-center gap-3 mb-6">
              <motion.span 
                className="text-3xl"
                animate={{ 
                  rotate: [0, -10, 10, 0],
                  scale: [1, 1.15, 1]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                🛡️
              </motion.span>
              <h3 className="text-2xl font-bold text-white">Protective Provisions</h3>
            </div>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-emerald-600/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500" />
              <div className="relative bg-gray-900/80 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-8 shadow-2xl">
                <PositiveClausesCarousel positiveProvisions={analysis.positiveProvisions} />
              </div>
            </div>
          </motion.div>

          {/* Action Items Section */}
          <motion.div variants={fadeInUp} className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-600/10 to-orange-600/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500" />
            <div className="relative bg-gray-900/80 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <motion.span 
                  className="text-2xl"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                >
                  🎯
                </motion.span>
                <h3 className="text-xl font-bold text-white">Recommended Actions</h3>
              </div>
              <ActionItems 
                actionItems={analysis.actionItems} 
                negotiationPoints={analysis.negotiationPoints} 
              />
            </div>
          </motion.div>

          {/* Missing Clauses Alert */}
          {analysis.missingClauses && analysis.missingClauses.length > 0 && (
            <motion.div
              variants={fadeInUp}
              className="relative group"
            >
              <motion.div
                className="absolute inset-0 bg-red-600/20 rounded-3xl blur-xl"
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                  scale: [1, 1.05, 1]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <div className="relative bg-gradient-to-br from-red-900/40 to-orange-900/40 backdrop-blur-xl border border-red-500/30 rounded-3xl p-8 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <motion.span 
                    className="text-3xl"
                    animate={{ 
                      scale: [1, 1.3, 1],
                      rotate: [0, 10, -10, 0]
                    }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    ⚠️
                  </motion.span>
                  <h3 className="text-xl font-bold text-white">Missing Critical Clauses</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {analysis.missingClauses.map((missing, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02, x: 5 }}
                      className="bg-black/40 backdrop-blur-sm rounded-xl p-5 border border-red-500/20 hover:border-red-500/40 transition-all duration-300"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <span className="text-xl">🚫</span>
                        <h4 className="font-semibold text-red-400 flex-1 text-sm">{missing.clause}</h4>
                      </div>
                      <p className="text-gray-400 text-xs mb-3 pl-8">{missing.importance}</p>
                      <div className="bg-red-500/10 rounded-lg p-3 pl-8">
                        <p className="text-gray-300 text-xs flex items-start gap-2">
                          <span className="text-yellow-400 mt-0.5">💡</span>
                          <span>{missing.suggestion}</span>
                        </p>
                      </div>
                    </motion.div>                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Legal Disclaimer */}
          <motion.div
            variants={fadeInUp}
            className="relative"
          >
            <div className="bg-gradient-to-r from-gray-900/60 to-gray-800/60 backdrop-blur-md border border-gray-700/50 rounded-2xl p-6 text-center">
              <div className="flex items-center justify-center gap-3 mb-2">
                <motion.span 
                  className="text-xl"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ⚖️
                </motion.span>
                <p className="text-gray-400 text-sm font-medium">
                  AI-Powered Analysis • Professional Review Recommended
                </p>
              </div>
              <p className="text-gray-500 text-xs">
                This analysis is provided for informational purposes only and does not constitute legal advice.
                Always consult with a qualified legal professional for important documents.
              </p>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8"
          >
            <motion.button
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 60px rgba(168, 85, 247, 0.4)"
              }}
              whileTap={{ scale: 0.98 }}
              onClick={onExportAnalysis}
              className="group relative w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 rounded-2xl font-bold text-white shadow-2xl overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.5 }}
                style={{ opacity: 0.3 }}
              />
              <span className="relative flex items-center justify-center gap-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download Full Report
              </span>
            </motion.button>

            <motion.button
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 60px rgba(139, 92, 246, 0.4)"
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                document.body.classList.add("show-chatbot");
                setShowChatbotHint(false);
              }}
              className="group relative w-full sm:w-auto px-8 py-4 bg-gray-900/80 backdrop-blur-xl border-2 border-purple-500/50 rounded-2xl font-bold text-white shadow-2xl overflow-hidden hover:border-purple-400 transition-all duration-300"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20"
                initial={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
              <span className="relative flex items-center justify-center gap-3">
                <motion.svg 
                  className="w-5 h-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </motion.svg>
                Ask AI Questions
              </span>
            </motion.button>

            <motion.button
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 60px rgba(75, 85, 99, 0.4)"
              }}
              whileTap={{ scale: 0.98 }}
              onClick={onAnalyzeAnother}
              className="group relative w-full sm:w-auto px-8 py-4 bg-gray-900/80 backdrop-blur-xl border-2 border-gray-600/50 rounded-2xl font-bold text-gray-300 shadow-2xl overflow-hidden hover:text-white hover:border-gray-500 transition-all duration-300"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-gray-700/20 to-gray-600/20"
                initial={{ y: '100%' }}
                whileHover={{ y: '0%' }}
                transition={{ duration: 0.3 }}
              />
              <span className="relative flex items-center justify-center gap-3">
                <motion.svg 
                  className="w-5 h-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  whileHover={{ rotate: 180 }}
                  transition={{ duration: 0.3 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </motion.svg>
                Analyze Another Document
              </span>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      {/* Enhanced Global Styles */}
      <style jsx global>{`
        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }
        
        @keyframes gradient-shift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        
        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(168, 85, 247, 0.3);
          }
          50% {
            box-shadow: 0 0 40px rgba(168, 85, 247, 0.6);
          }
        }
        
        .shimmer-effect {
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.1) 50%,
            transparent 100%
          );
          background-size: 1000px 100%;
          animation: shimmer 3s infinite;
        }
        
        .hover-card {
          position: relative;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .hover-card::before {
          content: '';
          position: absolute;
          inset: -1px;
          border-radius: inherit;
          padding: 1px;
          background: linear-gradient(
            135deg, 
            rgba(139, 92, 246, 0.5), 
            rgba(236, 72, 153, 0.5),
            rgba(59, 130, 246, 0.5)
          );
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: 0;
          transition: opacity 0.5s ease;
          background-size: 200% 200%;
          animation: gradient-shift 3s ease infinite;
        }
        
        .hover-card:hover::before {
          opacity: 1;
        }

        .hover-card:hover {
          transform: translateY(-2px);
        }

        /* Hide scrollbar but keep functionality */
        body::-webkit-scrollbar {
          display: none;
        }
        
        body {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }

        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </motion.section>
  );
}