"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function RiskMeter({ score = 0, riskLevel = "Medium" }) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score);
    }, 100);
    return () => clearTimeout(timer);
  }, [score]);

  const getColorConfig = () => {
    if (animatedScore < 33) {
      return {
        primary: "#10b981",
        secondary: "#34d399",
        gradient: "from-green-500 to-emerald-400",
        glow: "shadow-green-500/50",
        text: "text-green-400"
      };
    }
    if (animatedScore < 66) {
      return {
        primary: "#f59e0b",
        secondary: "#fbbf24",
        gradient: "from-yellow-500 to-amber-400",
        glow: "shadow-yellow-500/50",
        text: "text-yellow-400"
      };
    }
    return {
      primary: "#ef4444",
      secondary: "#f87171",
      gradient: "from-red-500 to-rose-400",
      glow: "shadow-red-500/50",
      text: "text-red-400"
    };
  };

  const config = getColorConfig();
  const rotation = (animatedScore / 100) * 180 - 90;

  return (
    <div className="relative w-full max-w-sm mx-auto">
      {/* Gauge container */}
      <div className="relative aspect-[2/1] w-full">
        {/* Background glow */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-t ${config.gradient} opacity-20 blur-3xl`}
          animate={{
            opacity: [0.1, 0.3, 0.1],
            scale: [0.8, 1, 0.8]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* SVG Gauge */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 100" preserveAspectRatio="xMidYMid meet">
          {/* Background arc */}
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
            
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Background track */}
          <path
            d="M 20 80 A 60 60 0 0 1 180 80"
            fill="none"
            stroke="#1f2937"
            strokeWidth="12"
            strokeLinecap="round"
          />

          {/* Colored progress arc */}
          <motion.path
            d="M 20 80 A 60 60 0 0 1 180 80"
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth="12"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: animatedScore / 100 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            filter="url(#glow)"
          />

          {/* Tick marks */}
          {[0, 25, 50, 75, 100].map((tick) => {
            const angle = ((tick / 100) * 180 - 90) * (Math.PI / 180);
            const x1 = 100 + 55 * Math.cos(angle);
            const y1 = 80 + 55 * Math.sin(angle);
            const x2 = 100 + 65 * Math.cos(angle);
            const y2 = 80 + 65 * Math.sin(angle);
            
            return (
              <line
                key={tick}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#4b5563"
                strokeWidth="2"
                strokeLinecap="round"
              />
            );
          })}

          {/* Labels */}
          <text x="20" y="95" fill="#6b7280" fontSize="8" textAnchor="middle">Low</text>
          <text x="100" y="20" fill="#6b7280" fontSize="8" textAnchor="middle">Medium</text>
          <text x="180" y="95" fill="#6b7280" fontSize="8" textAnchor="middle">High</text>
        </svg>

        {/* Needle */}
        <div className="absolute inset-0 flex items-end justify-center">
          <motion.div
            className="relative w-1 h-24 origin-bottom"
            initial={{ rotate: -90 }}
            animate={{ rotate: rotation }}
            transition={{ 
              duration: 2, 
              ease: "easeInOut",
              type: "spring",
              bounce: 0.3
            }}
          >
            {/* Needle shadow */}
            <div className="absolute inset-0 bg-black/30 blur-sm translate-x-1 translate-y-1" />
            
            {/* Needle */}
            <div className={`absolute inset-0 bg-gradient-to-t ${config.gradient} rounded-full ${config.glow} shadow-2xl`}>
              {/* Needle tip */}
              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white rounded-full shadow-lg" />
            </div>
          </motion.div>
        </div>

        {/* Center hub */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className={`w-8 h-8 rounded-full bg-gradient-to-br ${config.gradient} shadow-2xl ${config.glow} border-4 border-gray-900`}
          />
        </div>
      </div>

      {/* Score display */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.5, type: "spring", stiffness: 200 }}
        className="text-center mt-8"
      >
        <div className="relative inline-block">
          {/* Glow background */}
          <motion.div
            className={`absolute inset-0 bg-gradient-to-br ${config.gradient} blur-2xl opacity-40`}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Score number */}
          <motion.div
            key={animatedScore}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`relative text-7xl font-black bg-gradient-to-br ${config.gradient} bg-clip-text text-transparent`}
          >
            {Math.round(animatedScore)}
          </motion.div>
        </div>

        {/* Risk level badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
          className={`inline-block mt-4 px-6 py-2 rounded-full bg-gradient-to-r ${config.gradient}/20 border-2 border-current ${config.text} font-bold text-sm backdrop-blur-sm`}
        >
          {riskLevel} Risk
        </motion.div>

        {/* Risk description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2 }}
          className="mt-3 text-gray-400 text-sm max-w-xs mx-auto leading-relaxed"
        >
          {animatedScore < 33 && "This contract shows favorable terms with minimal risk factors."}
          {animatedScore >= 33 && animatedScore < 66 && "Review recommended. Some clauses require attention."}
          {animatedScore >= 66 && "High risk detected. Professional legal review strongly recommended."}
        </motion.p>
      </motion.div>

      {/* Percentage rings */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        {[
          { label: 'Critical', value: animatedScore > 66 ? 100 : 0, color: 'text-red-400' },
          { label: 'Warning', value: animatedScore > 33 && animatedScore <= 66 ? 100 : 0, color: 'text-yellow-400' },
          { label: 'Safe', value: animatedScore <= 33 ? 100 : 0, color: 'text-green-400' }
        ].map((item, index) => (
          item.value > 0 && (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 2.5 + index * 0.1 }}
              className="flex items-center gap-2 text-xs"
            >
              <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
              <span className={`font-semibold ${item.color}`}>{item.label}</span>
            </motion.div>
          )
        ))}
      </div>
    </div>
  );
}