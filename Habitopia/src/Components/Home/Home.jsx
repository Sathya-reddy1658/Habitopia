import React, { useEffect, useState } from "react";
import NotificationButton from "./NotificationButton";
import FooterAndNavbar from "../FooterAndNavbar/FooterAndNavbar";
import { useAuth } from "../contexts/AuthContext";
import HabitTrackerComponent from "./HabitTrackerComponent";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getDatabase, onValue, ref } from "firebase/database";
import { app } from "../firebase/firebaseConfig";
import { motion } from "framer-motion";
import { Trophy } from "lucide-react";

const Home = () => {
  const { currentUser } = useAuth();
  const [totalScore, setTotalScore] = useState(0);
  const db = getFirestore();
  const [notificationCount, setNotificationCount] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!currentUser) return;

    const invitesRef = ref(
      getDatabase(app),
      `users/${currentUser.uid}/groupHabitInvites`
    );
    const unsubscribe = onValue(invitesRef, (snapshot) => {
      const invitesData = snapshot.val();
      setNotificationCount(invitesData ? Object.keys(invitesData).length : 0);
      setIsLoaded(true);
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
        }
      }
    };

    fetchUserScore();
  }, [currentUser, db]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 selection:bg-indigo-200">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header */}
        <header className="mb-8 sm:mb-12">
          <div className="flex justify-between items-start space-x-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex-1"
            >
              <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
                Hi, {currentUser?.displayName} 👋
              </h1>
              <p className="mt-2 text-lg text-gray-600">Let's make habits together!</p>
              
              <div className="mt-4 flex items-center bg-white rounded-2xl p-4 shadow-sm border border-gray-100 transition-all hover:shadow-md">
                <div className="p-2 bg-indigo-50 rounded-xl mr-4">
                  <Trophy className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Your Score</p>
                  <p className="text-2xl font-bold text-indigo-600">
                    {totalScore.toLocaleString()}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <NotificationButton notificationCount={notificationCount} />
            </motion.div>
          </div>
        </header>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8"
        >
          <HabitTrackerComponent />
        </motion.div>
      </div>

      {/* Footer with blur effect */}
      <div className="fixed bottom-0 inset-x-0 bg-white/80 backdrop-blur-lg border-t border-gray-200">
        <div className="max-w-2xl mx-auto">
          <FooterAndNavbar />
        </div>
      </div>
    </div>
  );
};

export default Home;