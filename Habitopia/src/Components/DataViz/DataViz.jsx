import React from 'react'
import { getFirestore, collection, getDocs, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import Graph from './Graph';
import AreaChart from './AreaGraph';

const db = getFirestore();
function DataViz({habit, todayProgress, setTodayProgress, streak, setStreak, totalProgress, setTotalProgress, progressPerDay, setProgressPerDay, bestStreak, setBestStreak}) {
  
  const { currentUser } = useAuth();
  setBestStreak(habit.bestStreak);
  console.log(habit)
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
        const today = new Date().toISOString().split('T')[0]; 
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

  const fetchStreak = async (habit)=>{
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
            if(i!=0){
              const d1 = new Date(arr[i].date);
              const d2 = new Date(arr[i-1].date);
              const timeDiff = Math.abs(d2.getTime() - d1.getTime());
              const dayDiff = timeDiff / (1000 * 60 * 60 * 24);
              if(dayDiff>1){
                break;
              }
            }
            if(arr[i].completed == false){
              break;
            }
            cnt++;
          }
          setStreak(cnt);
          console.log("streak ", streak);
          const bestStreak = parseInt(habit.bestStreak) || 0; 
          if (cnt > bestStreak) {
              updateBestStreak(cnt);
          } else {
              console.log("No update needed for best streak.");
          }
      } catch (error) {
          console.error("Error fetching daily progress:", error);
      }
    }
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
    fetchStreak(habit);

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
    <div>
      {habit && 
        <>
        {habit.hasMetric=="yes" && 
        <div className='flex flex-wrap'>
        <Graph habit={habit.habitName} current={todayProgress}  total={tar} metric={habit.metricUnit} color="#22C55E"/>
        <Graph habit={habit.habitName} current={streak} total={21} metric="Days" color="#FACC15"/>
        <AreaChart habit={habit.habitName} progData={progressPerDay} target={habit.target}/>
        </div>
        }
        </>
      }
    </div>
  )
}

export default DataViz