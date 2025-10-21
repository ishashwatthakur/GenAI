"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function ObligationsTimeline({ obligations = [], keyDates = [] }) {
  const [isVisible, setIsVisible] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all', 'obligations', 'dates'

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const allEvents = [
    ...obligations.map(o => ({
      ...o,
      type: 'obligation',
      displayDate: o.dueDate === 'Ongoing' ? 'Ongoing' : o.dueDate,
      sortDate: o.dueDate === 'Ongoing' ? new Date('2099-12-31') : new Date(o.dueDate)
    })),
    ...keyDates.map(k => ({
      ...k,
      type: 'keyDate',
      displayDate: k.date,
      sortDate: new Date(k.date)
    }))
  ].sort((a, b) => a.sortDate - b.sortDate);

  const filteredEvents = allEvents.filter(event => {
    if (filter === 'all') return true;
    if (filter === 'obligations') return event.type === 'obligation';
    if (filter === 'dates') return event.type === 'keyDate';
    return true;
  });

  const getEventConfig = (event) => {
    if (event.type === 'obligation') {
      switch (event.frequency) {
        case 'Monthly': 
          return {
            icon: '🔄',
            color: 'bg-blue-500',
            gradient: 'from-blue-600 to-blue-500',
            border: 'border-blue-500/50',
            glow: 'shadow-blue-500/30',
            label: 'Monthly'
          };
        case 'Annual': 
          return {
            icon: '📅',
            color: 'bg-purple-500',
            gradient: 'from-purple-600 to-purple-500',
            border: 'border-purple-500/50',
            glow: 'shadow-purple-500/30',
            label: 'Annual'
          };
        case 'One-time': 
          return {
            icon: '📌',
            color: 'bg-indigo-500',
            gradient: 'from-indigo-600 to-indigo-500',
            border: 'border-indigo-500/50',
            glow: 'shadow-indigo-500/30',
            label: 'One-time'
          };
        default: 
          return {
            icon: '📋',
            color: 'bg-cyan-500',
            gradient: 'from-cyan-600 to-cyan-500',
            border: 'border-cyan-500/50',
            glow: 'shadow-cyan-500/30',
            label: 'Ongoing'
          };
      }
    } else {
      switch (event.type) {
        case 'Deadline': 
          return {
            icon: '⏰',
            color: 'bg-red-500',
            gradient: 'from-red-600 to-red-500',
            border: 'border-red-500/50',
            glow: 'shadow-red-500/30',
            label: 'Deadline'
          };
        case 'Renewal': 
          return {
            icon: '🔄',
            color: 'bg-green-500',
            gradient: 'from-green-600 to-green-500',
            border: 'border-green-500/50',
            glow: 'shadow-green-500/30',
            label: 'Renewal'
          };
        case 'Payment': 
          return {
            icon: '💰',
            color: 'bg-yellow-500',
            gradient: 'from-yellow-600 to-yellow-500',
            border: 'border-yellow-500/50',
            glow: 'shadow-yellow-500/30',
            label: 'Payment'
          };
        default: 
          return {
            icon: '📅',
            color: 'bg-gray-500',
            gradient: 'from-gray-600 to-gray-500',
            border: 'border-gray-500/50',
            glow: 'shadow-gray-500/30',
            label: 'Event'
          };
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Filter */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h4 className="text-xl font-bold text-white mb-1">Timeline Overview</h4>
          <p className="text-sm text-gray-400">
            {filteredEvents.length} item{filteredEvents.length !== 1 ? 's' : ''} to track
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-2 bg-gray-800/50 rounded-xl p-1 border border-gray-700/50">
          {[
            { value: 'all', label: 'All', icon: '📊' },
            { value: 'obligations', label: 'Obligations', icon: '📋' },
            { value: 'dates', label: 'Key Dates', icon: '📅' }
          ].map(item => (
            <motion.button
              key={item.value}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(item.value)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-300 flex items-center gap-2 ${
                filter === item.value 
                  ? 'bg-purple-600 text-white shadow-lg' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <span>{item.icon}</span>
              <span className="hidden sm:inline">{item.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="relative pl-8 md:pl-12">
        {/* Timeline line */}
        <motion.div
          className="absolute left-4 md:left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 via-pink-500 to-blue-500 rounded-full"
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: isVisible ? 1 : 0, opacity: isVisible ? 1 : 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{ transformOrigin: "top" }}
        >
          {/* Animated pulse */}
          <motion.div
            className="absolute top-0 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-purple-400 rounded-full"
            animate={{
              y: ['0%', '100%'],
              opacity: [1, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </motion.div>

        {/* Events */}
        <div className="space-y-8">
          {filteredEvents.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12 bg-gray-900/30 rounded-xl border border-gray-700/50"
            >
              <span className="text-6xl mb-4 block">📭</span>
              <p className="text-gray-400">No items to display</p>
            </motion.div>
          ) : (
            filteredEvents.map((event, index) => {
              const config = getEventConfig(event);
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: isVisible ? 1 : 0, x: 0 }}
                  transition={{ 
                    delay: index * 0.1, 
                    type: "spring",
                    stiffness: 100
                  }}
                  className="relative flex items-start gap-4 md:gap-6 group"
                >
                  {/* Event marker */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: isVisible ? 1 : 0 }}
                    transition={{ 
                      delay: index * 0.1 + 0.2, 
                      type: "spring",
                      stiffness: 200
                    }}
                    className="relative z-10 flex-shrink-0"
                  >
                    <motion.div
                      whileHover={{ scale: 1.2, rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br ${config.gradient} flex items-center justify-center text-3xl md:text-4xl ${config.glow} shadow-2xl border-4 border-gray-900 cursor-pointer`}
                    >
                      {config.icon}
                      
                      {/* Pulse rings */}
                      <motion.div
                        className={`absolute inset-0 rounded-2xl ${config.color} opacity-75`}
                        animate={{ scale: [1, 1.3, 1], opacity: [0.7, 0, 0.7] }}
                        transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                      />
                    </motion.div>
                  </motion.div>

                  {/* Event details */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isVisible ? 1 : 0 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                    className="flex-1 min-w-0"
                  >
                    <div className="relative group">
                      <div className={`absolute inset-0 bg-gradient-to-r ${config.gradient.replace('from-', 'from-').replace('to-', 'to-')}/10 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300`} />
                      
                      <div className="relative bg-gray-900/80 backdrop-blur-sm rounded-2xl p-5 md:p-6 border border-gray-800 hover:border-gray-700 transition-all duration-300 shadow-xl">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <span className={`px-3 py-1 rounded-full text-xs font-bold ${config.color} text-white border ${config.border}`}>
                                {config.label}
                              </span>
                              {event.priority && (
                                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/50">
                                  High Priority
                                </span>
                              )}
                            </div>
                            
                            <h5 className="text-lg md:text-xl font-bold text-white mb-2 leading-snug">
                              {event.type === 'obligation' ? event.obligation : event.event}
                            </h5>
                          </div>
                          
                          <div className="text-right flex-shrink-0">
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: index * 0.1 + 0.4, type: "spring" }}
                              className="px-4 py-2 bg-purple-500/20 rounded-xl border border-purple-500/30"
                            >
                              <p className="text-xs text-purple-400 font-semibold mb-1">
                                {event.displayDate === 'Ongoing' ? 'Status' : 'Due Date'}
                              </p>
                              <p className="text-sm font-bold text-white whitespace-nowrap">
                                {event.displayDate}
                              </p>
                            </motion.div>
                          </div>
                        </div>

                        {/* Details */}
                        <div className="space-y-3">
                          {event.party && (
                            <div className="flex items-center gap-2 text-sm">
                              <svg className="w-4 h-4 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              <span className="text-gray-400">Responsible:</span>
                              <span className="text-gray-200 font-medium">{event.party}</span>
                            </div>
                          )}
                          
                          {event.frequency && (
                            <div className="flex items-center gap-2 text-sm">
                              <svg className="w-4 h-4 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span className="text-gray-400">Frequency:</span>
                              <span className="text-gray-200 font-medium">{event.frequency}</span>
                            </div>
                          )}

                          {event.description && (
                                                        <p className="text-sm text-gray-400 leading-relaxed pt-2 border-t border-gray-700/50">
                              {event.description}
                            </p>
                          )}
                        </div>

                        {/* Action button */}
                        <motion.button
                          whileHover={{ scale: 1.02, x: 5 }}
                          whileTap={{ scale: 0.98 }}
                          className={`mt-4 flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${config.gradient}/20 text-white rounded-lg text-sm font-semibold border ${config.border} hover:shadow-lg transition-all duration-300`}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          <span>Add to Calendar</span>
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>

      {/* Summary Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {[
          { 
            label: 'Total Items', 
            value: allEvents.length, 
            icon: '📊',
            color: 'from-purple-600 to-purple-500'
          },
          { 
            label: 'Obligations', 
            value: obligations.length, 
            icon: '📋',
            color: 'from-blue-600 to-blue-500'
          },
          { 
            label: 'Key Dates', 
            value: keyDates.length, 
            icon: '📅',
            color: 'from-pink-600 to-pink-500'
          },
          { 
            label: 'Urgent', 
            value: allEvents.filter(e => e.priority === 'high' || e.displayDate !== 'Ongoing').length, 
            icon: '⚡',
            color: 'from-red-600 to-orange-500'
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9 + index * 0.1 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className="group relative"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.color}/20 rounded-xl blur-md group-hover:blur-lg transition-all duration-300`} />
            
            <div className="relative bg-gray-900/80 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{stat.icon}</span>
                <motion.span 
                  className="text-3xl font-black text-white"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1 + index * 0.1, type: "spring" }}
                >
                  {stat.value}
                </motion.span>
              </div>
              <p className="text-xs text-gray-400 font-medium">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}