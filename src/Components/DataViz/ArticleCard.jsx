import React, { useState } from 'react';
import Reply from '../Groq/Reply';
import { BookOpen, ChevronDown, Target } from 'lucide-react';

const ArticleCard = ({ habit }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="relative bg-indigo-600 rounded-xl overflow-hidden border border-indigo-400/30 mb-6">
      <div className="absolute inset-0 bg-indigo-400/5" />
      
      <div className="relative border-b border-indigo-400/20 p-4 bg-gradient-to-b from-indigo-500 to-indigo-600">
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-4 h-4 text-indigo-200" />
              <h2 className="text-indigo-200 text-sm font-medium tracking-wide">
                How will you build this habit?
              </h2>
            </div>
            <p className="text-indigo-50 text-base">
              {habit.desc}
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-indigo-200" />
              <h2 className="text-indigo-200 text-sm font-medium tracking-wide">
                Why is this important to you?
              </h2>
            </div>
            <p className="text-indigo-50 text-base">
              {habit.purpose}
            </p>
          </div>
        </div>
      </div>

      <div className="relative p-4 mb-20 bg-indigo-600">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 mb-3 px-3 py-1.5 text-sm font-medium 
            bg-indigo-500/80 rounded-md
            border border-indigo-400/30 
            text-indigo-50 hover:text-indigo-200
            transition-all duration-200
            hover:border-indigo-300/50 hover:bg-indigo-500"
        >
          <ChevronDown 
            className={`w-4 h-4 transition-transform duration-200 
              ${isExpanded ? 'rotate-180' : ''}`} 
          />
          {isExpanded ? 'Hide Personalized Guide' : 'View Personalized Guide'}
        </button>
        
        <div 
          className={`transition-all duration-300  ease-in-out overflow-hidden
            ${isExpanded ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'}`}
        >
          <div className="bg-indigo-100/2 rounded-lg">
            <div className="relative  max-w-none overflow-y-auto max-h-[250px] pr-4 ">
              <div className="text-indigo-50 text-base">
                <Reply
                  prompt={
                    "this is my habit: " +
                    habit.habitName +
                    ". This is the description of my habit:" +
                    habit.desc +
                    ". This is the purpose of my habit: " +
                    habit.purpose +
                    ". Give me a comprehensive yet conversational article on how I should start and maintain this habit, covering the benefits, implementation strategies, and consistency tips. Focus on motivation and practical advice. Make it personal and encouraging. DO NOT USE ANY FORMATTING OR BULLET POINTS. WRITE AS A FLOWING CONVERSATION."
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;