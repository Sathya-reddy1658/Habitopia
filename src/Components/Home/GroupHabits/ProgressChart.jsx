import React from 'react';
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { format } from "date-fns";
import { Users, TrendingUp } from "lucide-react";

const ProgressChart = ({ memberDetails, progressData, selectedMember, groupData }) => {
  const xAxisConfig = {
    dataKey: "date",
    tickFormatter: (date) => format(new Date(date), "MMM d"),
    stroke: "#6B7280",
    height: 60,
    tickSize: 8,
    tickMargin: 8
  };

  const yAxisConfig = {
    stroke: "#6B7280",
    width: 60,
    tickSize: 8,
    tickMargin: 8
  };

  return (
    <div className="lg:col-span-2 bg-white/10 rounded-lg shadow-xl p-6 sm:p-8 border border-white/20">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
        <TrendingUp className="text-blue-500" size={24} />
        Progress Tracking
      </h2>
      
      {selectedMember ? (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h3 className="text-lg font-semibold text-gray-700">
              {memberDetails[selectedMember]?.displayName}'s Progress
            </h3>
            <div className="bg-white/20 px-4 py-2 rounded-full text-gray-700 font-medium">
              Last 7 Days
            </div>
          </div>
          
          <div className="h-[300px] sm:h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart 
                data={progressData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="progressColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="#E5E7EB" 
                  vertical={false}
                />
                
                <XAxis {...xAxisConfig} />
                <YAxis {...yAxisConfig} />
                
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    border: "none",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                  labelFormatter={(date) => format(new Date(date), "MMMM d, yyyy")}
                  formatter={(value) => [
                    `${value} ${groupData?.metricUnit || 'units'}`,
                    "Progress"
                  ]}
                />
                
                <Legend 
                  wrapperStyle={{
                    paddingTop: "20px"
                  }}
                />
                
                <Area
                  type="monotone"
                  dataKey="progress"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  fill="url(#progressColor)"
                  name="Progress"
                  activeDot={{ r: 6 }}
                />
                
                <Line
                  type="monotone"
                  dataKey="target"
                  stroke="#9CA3AF"
                  strokeDasharray="5 5"
                  strokeWidth={2}
                  dot={false}
                  name="Target"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="h-[300px] sm:h-[400px] flex flex-col items-center justify-center text-gray-500 space-y-4">
          <Users size={48} className="text-blue-300" />
          <p>Select a member to view their progress</p>
        </div>
      )}
    </div>
  );
};

export default ProgressChart;