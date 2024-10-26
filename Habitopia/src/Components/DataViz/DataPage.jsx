import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import DataViz from './DataViz';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Activity, TrendingUp, Award } from 'lucide-react';
import FooterAndNavbar from '../FooterAndNavbar/FooterAndNavbar';
import Reply from '../Groq/Reply'
import ArticleCard from './ArticleCard';
const db = getFirestore();

const DataPage = () => {
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const [habits, setHabits] = useState([]);
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [todayProgress, setTodayProgress] = useState(0);
  const [streak, setStreak] = useState(0);
  const [totalProgress, setTotalProgress] = useState(0);
  const [progressPerDay, setProgressPerDay] = useState([]);
  const [bestStreak, setBestStreak] = useState(0);


  useEffect(() => {
    const fetchHabits = async () => {
      if (!currentUser) {
        console.error("No user is logged in!");
        setLoading(false);
        return;
      }
      try {
        const habitsRef = collection(db, "users", currentUser.uid, "habits");
        const snapshot = await getDocs(habitsRef);
        const habitsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setHabits(habitsData);
        if (habitsData.length > 0) {
          setSelectedHabit(habitsData[0]);
        }
      } catch (error) {
        console.error("Error fetching habits:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHabits();
  }, [currentUser]);

  function handleSelection(habit) {
    setSelectedHabit(habit);
    setIsOpen(false);
  }

  return (
    <div className='bg-indigo-600 select-none gap-4 min-h-screen flex flex-col items-center justify-start p-4 md:p-8'>
      <motion.header
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl text-center md:py-20 py-10"
      >
        <h1 className='text-4xl md:text-5xl font-bold text-white mb-2'>Habit Insights</h1>
        <p className='text-lg md:text-xl text-pink-200'>Track your progress, celebrate your wins</p>
      </motion.header>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-6xl relative z-20"
      >
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full bg-indigo-600 border-2 border-indigo-500 rounded-lg py-3 px-4 flex items-center justify-between text-left shadow-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all duration-300"
          >
            <span className="block truncate text-lg text-white font-semibold">
              {selectedHabit ? selectedHabit.habitName : "Select a habit"}
            </span>
            <ChevronDown
              className={`ml-2 h-5 w-5 text-pink-300 transition-transform duration-200 ${
                isOpen ? 'transform rotate-180' : ''
              }`}
            />
          </button>

          <AnimatePresence>
            {isOpen && (
              <motion.ul
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute z-30 mt-1 w-full bg-indigo-600 shadow-xl max-h-60 rounded-md py-1 text-base ring-1 ring-indigo-400 overflow-auto focus:outline-none sm:text-sm"
              >
                {habits.map((habit) => (
                  <li
                    key={habit.id}
                    onClick={() => handleSelection(habit)}
                    className="text-indigo-100 cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-indigo-600 transition-colors duration-200"
                  >
                    {habit.habitName}
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {selectedHabit && (
        <motion.div
          key={selectedHabit.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-6xl bg-indigo-600 rounded-xl shadow-2xl overflow-hidden border-2 border-indigo-400"
        >
          <div className="p-6">
            <h2 className="text-3xl font-semibold text-white mb-6">{selectedHabit.habitName}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <StatCard icon={<Activity className="text-cyan-400" size={24} />} title="Streak" value={streak+" days"} />
              <StatCard icon={<TrendingUp className="text-green-400" size={24} />} title="Completion Rate" value={(totalProgress*100/21).toFixed(2) + "%"} />
              <StatCard icon={<Award className="text-yellow-400" size={24} />} title="Best Streak" value={bestStreak+" days"} />
            </div>
            <DataViz habit={selectedHabit} todayProgress={todayProgress} setTodayProgress={setTodayProgress} streak={streak} setStreak={setStreak} totalProgress={totalProgress} setTotalProgress={setTotalProgress}  progressPerDay={progressPerDay} setProgressPerDay={setProgressPerDay} bestStreak={bestStreak} setBestStreak={setBestStreak}/>
            <ArticleCard habit={selectedHabit}/>
          </div>
        </motion.div>
      )}
      <FooterAndNavbar />
    </div>
  );
};

const StatCard = ({ icon, title, value }) => (
  <div className="bg-white/20 rounded-lg p-4 flex items-center space-x-4 border border-indigo-600 shadow-md hover:bg-indigo-700 transition-colors duration-300">
    <div className="bg-indigo-700 p-3 rounded-full">{icon}</div>
    <div>
      <p className="text-sm  font-bold text-white">{title}</p>
      <p className="text-xl font-semibold text-pink-300">{value}</p>
    </div>
  </div>
);

export default DataPage;