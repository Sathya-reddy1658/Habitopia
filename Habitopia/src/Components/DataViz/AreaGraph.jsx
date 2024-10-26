import React from 'react';
import { motion } from 'framer-motion';
import Reply from '../Groq/Reply';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-indigo-600 border border-indigo-400/20 p-3 rounded-lg shadow-lg">
        <p className="text-indigo-100 text-sm font-medium">{`Date: ${label}`}</p>
        <p className="text-white text-sm">{`Progress: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

const AreaGraph = ({ habit, progData, target }) => {
    const data = progData.slice(0, 7);
    const prompt = `I am building a habit to learn about/perform ${habit}. give me suggestions to improve in this particular habit based on my progress. My maximum target per day is ${target}. Remove any sort of text formatting. Give me plain text, NO POINTS or BOLDS. Here is the data regarding my progress the past few days: ${JSON.stringify(data)}. Limit your response to 70 words`;

    return (
        <div className="w-full mb-6">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative bg-indigo-600 rounded-xl border border-indigo-400/20 overflow-hidden"
            >
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-indigo-300/5 to-transparent" />
                
                <div className="relative p-4">
                    {/* Header */}
                    <div className="mb-6 text-center">
                        <h3 className="text-2xl font-bold text-white">
                            {habit} Progress
                        </h3>
                        <p className="text-indigo-100/80 text-sm mt-1">
                            Last 7 Days Performance
                        </p>
                    </div>

                    {/* Chart */}
                    <div className="bg-indigo-500/20 rounded-lg p-4 border border-indigo-400/20">
                        <ResponsiveContainer width="100%" height={280}>
                            <AreaChart 
                                data={data} 
                                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                            >
                                <defs>
                                    <linearGradient id="colorProgress" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#E0E7FF" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#E0E7FF" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid 
                                    strokeDasharray="3 3" 
                                    stroke="#E0E7FF" 
                                    opacity={0.1}
                                    vertical={false}
                                />
                                <XAxis 
                                    dataKey="date" 
                                    stroke="#EEF2FF" 
                                    fontSize={12}
                                    tickLine={false}
                                />
                                <YAxis 
                                    stroke="#EEF2FF" 
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Area 
                                    type="monotone" 
                                    dataKey="progress" 
                                    stroke="#E0E7FF" 
                                    strokeWidth={2}
                                    fill="url(#colorProgress)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Analysis Section */}
                    <div className="mt-6 bg-indigo-100/20 rounded-lg p-4 border border-indigo-400/20">
                        <h4 className="text-white text-sm font-medium mb-2">
                            Personalized Insights
                        </h4>
                        <div className="text-indigo-100 text-sm leading-relaxed">
                            <Reply prompt={prompt} />
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default AreaGraph;