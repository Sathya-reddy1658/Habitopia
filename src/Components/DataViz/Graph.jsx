import React, { useState, useEffect } from 'react';
import { RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';
import { motion } from 'framer-motion';

const EnhancedCircularProgress = ({ habit, currentDays, totalDays,metric, color }) => {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(Math.round((currentDays / totalDays) * 100));
      return () => clearTimeout(timer);
    }, 500);
  }, [currentDays, totalDays]);

  const data = [
    {
      name: 'Progress',
      value: progress,
      fill: color,
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center p-6 bg-whtie/10 rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 ease-in-out transform hover:-translate-y-2"
    >
      <h3 className="text-3xl font-extrabold text-transparent bg-clip-text bg-cyan-300 mb-6">{habit} Journey</h3>
      <div className="relative flex items-center flex-col">
        <RadialBarChart
          width={250}
          height={250}
          cx="50%"
          cy="50%"
          innerRadius="70%"
          outerRadius="100%"
          barSize={30}
          data={data}
          startAngle={90}
          endAngle={-270}
        >
          <PolarAngleAxis
            type="number"
            domain={[0, 100]}
            angleAxisId={0}
            tick={false}
          />
          <RadialBar
            background
            clockWise
            dataKey="value"
            cornerRadius={15}
            fill={color}
          />
        </RadialBarChart>
        
        <div className='text-center'>
          <div className="text-3xl font-bold text-white">
            {currentDays} / {totalDays}
          </div>
          <div className="text-xl text-gray-300 mt-2">
            {metric}
          </div>
        </div>
      </div>
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ delay: 1, duration: 0.5 }}
        className="mt-6 w-full bg-white/50 rounded-full h-2.5 overflow-hidden"
      >
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ delay: 1.5, duration: 0.5 }}
          className="h-2.5 rounded-full" 
          style={{ backgroundColor: color }}
        ></motion.div>
      </motion.div>
      <div className="mt-4 text-2xl font-semibold text-white">
        {progress}% Complete
      </div>
    </motion.div>
  );
};

const Graph = ({habit, current, total, metric, color}) => {
  return (
    <div className="p-4 md:p-8 w-full max-w-md mx-auto">
      <EnhancedCircularProgress habit={habit} currentDays={current} totalDays={total} metric={metric} color={color} />
    </div>
  );
};

export default Graph;