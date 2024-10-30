import React, {useEffect, useState} from 'react'
import { getFirestore, collection, getDocs, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import Graph from './Graph';
import AreaChart from './AreaGraph';
import {useLocation} from 'react-router-dom'
import FooterAndNavbar from '../FooterAndNavbar/FooterAndNavbar';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Activity, TrendingUp, Award } from 'lucide-react';


const db = getFirestore();
function IndividualDataViz() {
const location = useLocation();
  const { habit } = location.state || {};  
  const { currentUser } = useAuth();
  const [todayProgress, setTodayProgress] = useState(0);
  const [streak, setStreak] = useState(0);
  const [totalProgress, setTotalProgress] = useState(0);
  const [progressPerDay, setProgressPerDay] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bestStreak, setBestStreak] = useState(habit.bestStreak);
   
  // console.log(habit)
    //but this does not - const target = habit.target;
    let  tar = 0;
    if (habit && habit.target) {
       tar = habit.target;
      console.log(tar);
    } else {
      console.log("Habit or habit target is not defined");
    }

    console.log("outside :" + tar);
      const fetchTodayProgress = async (habit)=>{
        const date = new Date();
        date.setHours(date.getHours() + 5);
        date.setMinutes(date.getMinutes() + 30);
        const today = date.toISOString().split('T')[0]; 
        const progressRef = doc(db, "users", currentUser.uid, "habits", habit.id, "dailyProgress", today); 
        try {
          const progressDoc = await getDoc(progressRef);
    
          if (progressDoc.exists()) {
            const progressData = progressDoc.data();
            setTodayProgress(progressData.progress || 0); 
          } else {
            setTodayProgress(0);
          }
          console.log("today prog: ", todayProgress);
        } catch (error) {
          console.error("Error fetching or creating daily progress:", error);
        }
      }
    fetchTodayProgress(habit)

    const fetchStreak = async (habit) => {
      const dailyProgRef = collection(db, "users", currentUser.uid, "habits", habit.id, "dailyProgress");
      try {
          const dailyProgSnapshot = await getDocs(dailyProgRef);
          if (dailyProgSnapshot.empty) {
              console.log("No daily progress documents found!");
              return;
          }
  
          let arr = [];
          dailyProgSnapshot.forEach(doc => {
              arr.unshift({ date: doc.id, completed: doc.data().completed });
          });
  
          let cnt = 0;
  
          for (let i = 0; i < arr.length; i++) {
              if (i !== 0) {
                  const d1 = new Date(arr[i].date);
                  const d2 = new Date(arr[i - 1].date);
                  const timeDiff = Math.abs(d2.getTime() - d1.getTime());
                  const dayDiff = timeDiff / (1000 * 60 * 60 * 24);
                  if (dayDiff > 1) {
                      break;
                  }
              }
              if (arr[i].completed === false) {
                  break;
              }
              cnt++;
          }
  
          setStreak(cnt);
          console.log("streak:", cnt); 
          const bestStreak = parseInt(habit.bestStreak) || 0; 
          if (cnt > bestStreak) {
              updateBestStreak(cnt);
          } else {
              console.log("No update needed for best streak.");
          }
      } catch (error) {
          console.error("Error fetching daily progress:", error);
      }
    };
    fetchStreak(habit);

    const updateBestStreak = async (cnt) => {
      console.log('Updating best streak');
      setBestStreak(cnt);
      const habitRef = doc(db, "users", currentUser.uid, "habits", habit.id);
      try {
          const habitDoc = await getDoc(habitRef);
          if (habitDoc.exists()) {
              await updateDoc(habitRef, { bestStreak: cnt });
              console.log("Best streak updated to:", cnt);
          }
      } catch (error) {
          console.error("Error updating best streak:", error);
      }
    }

    const fetchTotalProgress = async (habit)=>{
      const dailyProgRef = collection(db, "users", currentUser.uid, "habits", habit.id, "dailyProgress");
        try {
            const dailyProgSnapshot = await getDocs(dailyProgRef);
            if (dailyProgSnapshot.empty) {
                console.log("No daily progress documents found!");
                return;
            }
            let arr = [];
            dailyProgSnapshot.forEach(doc => {
              arr.unshift({date: doc.id, completed: doc.data().completed});
              //console.log(doc.id, " => ", doc.data());
            });
            let cnt = 0;
            for(let i=0; i<arr.length; i++){
              if(arr[i].completed == true){
                cnt++;
              }
            }
            setTotalProgress(cnt);
            console.log("total prog", totalProgress);
        } catch (error) {
            console.error("Error fetching daily progress:", error);
        }
      }
    fetchTotalProgress(habit);
    
    const fetchProgressPerDay = async (habit)=>{
      const dailyProgRef = collection(db, "users", currentUser.uid, "habits", habit.id, "dailyProgress");
        try {
            const dailyProgSnapshot = await getDocs(dailyProgRef);
            if (dailyProgSnapshot.empty) {
                console.log("No daily progress documents found!");
                return;
            }
            let arr = [];
            dailyProgSnapshot.forEach(doc => {
              arr.push({date: doc.id, progress: doc.data().progress});
              //console.log(doc.id, " => ", doc.data());
            });
            setProgressPerDay(arr);
            console.log("Progress per day: ", progressPerDay);
            
        } catch (error) {
            console.error("Error fetching daily progress:", error);
        }
    }
    fetchProgressPerDay(habit);
  return (
    <div className='bg-indigo-600 min-h-screen flex flex-col items-center justify-start p-4 md:p-20'>
      {habit && 
        <>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-6xl bg-indigo-600 rounded-xl shadow-2xl overflow-hidden border-2 border-indigo-400"
        >
          <div className="p-6">
            <h2 className="text-3xl font-semibold text-white mb-6">{habit.habitName}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <StatCard icon={<Activity className="text-cyan-400" size={24} />} title="Streak" value={streak+" days"} />
              <StatCard icon={<TrendingUp className="text-green-400" size={24} />} title="Completion Rate" value={(totalProgress*100/21).toFixed(2) + "%"} />
              <StatCard icon={<Award className="text-yellow-400" size={24} />} title="Best Streak" value={bestStreak+" days"} />
            </div>
        <div className='flex flex-wrap'> 
        <Graph habit={habit.habitName} current={todayProgress}  total={tar} metric={habit.metricUnit} color="#22C55E"/>
        <Graph habit={habit.habitName} current={streak} total={21} metric="Days" color="#FACC15"/>
        </div>
        <AreaChart habit={habit.habitName} progData={progressPerDay} target={habit.target}/>
        </div>
        </motion.div>
        <FooterAndNavbar/>
        </>
      }
    </div>
  )
}

const StatCard = ({ icon, title, value }) => (
  <div className="bg-white/20 rounded-lg p-4 flex items-center space-x-4 border border-indigo-600 shadow-md hover:bg-indigo-700 transition-colors duration-300">
    <div className="bg-indigo-700 p-3 rounded-full">{icon}</div>
    <div>
      <p className="text-sm  font-bold text-white">{title}</p>
      <p className="text-xl font-semibold text-white">{value}</p>
    </div>
  </div>
);

export default IndividualDataViz