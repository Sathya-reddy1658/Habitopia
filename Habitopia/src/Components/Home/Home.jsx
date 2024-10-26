import React, { useEffect, useState } from "react";
import NotificationButton from "./NotificationButton";
import ChallengesComponent from "./ChallengesComponent";
import FooterAndNavbar from "../FooterAndNavbar/FooterAndNavbar";
import { useAuth } from "../contexts/AuthContext";
import HabitTrackerComponent from "./HabitTrackerComponent";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getDatabase, onValue, ref } from "firebase/database";
import { app } from "../firebase/firebaseConfig";

const Home = () => {
  const { currentUser } = useAuth();
  const [totalScore, setTotalScore] = useState(0);
  const db = getFirestore();
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    if (!currentUser) return;

    const invitesRef = ref(
      getDatabase(app),
      `users/${currentUser.uid}/groupHabitInvites`
    );
    const unsubscribe = onValue(invitesRef, (snapshot) => {
      const invitesData = snapshot.val();
      setNotificationCount(invitesData ? Object.keys(invitesData).length : 0);
    });

    return () => unsubscribe();
  }, [currentUser]);


  useEffect(() => {
    const fetchUserScore = async () => {
      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          setTotalScore(userDoc.data().totalScore || 0);
        } else {
          console.error("No such user document!");
        }
      }
    };

    fetchUserScore();
  }, [currentUser, db]);

  return (
    <div className="min-h-[120vh] sm:min-h-screen bg-indigo-600 select-none text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <NotificationButton notificationCount={notificationCount} />
        <header className="sm:pt-10 mb-8">
          <h1 className="text-3xl font-bold">
            Hi, {currentUser.displayName} 👋
          </h1>
          <p className="text-indigo-200">Let's make habits together!</p>
          <p className="text-indigo-200 mt-2">
            Your Score: <span className="font-bold">{totalScore}</span>
          </p>
        </header>
        <div className="md:flex justify-center md:space-x-4">
            <HabitTrackerComponent />
        </div>
      </div>
      <FooterAndNavbar />
    </div>
  );
};

export default Home;
