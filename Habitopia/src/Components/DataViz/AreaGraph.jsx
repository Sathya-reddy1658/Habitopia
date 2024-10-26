import React, {useState, useEffect} from 'react'
import { motion } from 'framer-motion';
import Reply from '../Groq/Reply'
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer
} from 'recharts';

const AreaGraph = ({habit, progData, target}) => {
    const data = progData.slice(0,7);
    const prompt = `I am building a habit to learn about/perform ${habit}.  give me suggestions to improve in this particular habit based on my progress. My maximum target per day is ${target}. Remove any sort of text formatting. Give me plain text, NO POINTS or BOLDS. Here is the data regarding my progress the past few days: ${JSON.stringify(data)}. Limit your response to 70 words`;
  return (
    <div className="p-4 md:p-8 w-full max-w-md mx-auto">
        <motion.div 
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center p-6 bg-white/10 rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 ease-in-out transform hover:-translate-y-2"
        >
    <h3 className="text-3xl font-extrabold text-transparent bg-clip-text bg-cyan-300 mb-6">{habit} Journey</h3>

        <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="progress" stroke="#8884d8" fill="#22D3EE" fillOpacity={0.7} />
            </AreaChart>
        </ResponsiveContainer>
        <div className="mt-4 text-2xl font-semibold text-white">
            Past few days
        </div>
        <div className="mt-4 text-md font-semibold text-white">
            <Reply prompt={prompt}/>
        </div>
        </motion.div>
    </div>
  )
}

export default AreaGraph