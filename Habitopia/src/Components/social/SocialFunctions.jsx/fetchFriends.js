import { collection, getDocs, getFirestore } from "@firebase/firestore";
import { get } from "firebase/database";
import { app } from "../../firebase/firebaseConfig";

export const fetchFriends = async (dbRef,setFriends) => {
  
  const db = getFirestore(app);
  const usersCollection = collection(db, "users");
    try {
      const snapshot = await get(dbRef);
      const friendsList = snapshot.val()?.friends || [];
      
      const snapshots = await getDocs(usersCollection);
      const userData = snapshots.docs.map(doc => doc.data());
  
      const friendsWithDetails = friendsList.map((friendUid) => {
        const friendData = userData.find((user) => user.uid === friendUid);
        return friendData ? {
          uid: friendData.uid,
          displayName: friendData.displayName,
          lastActive: friendData.lastActive || 'Unknown',
          habitCount: friendData.habits?.length || 0,
          streak: friendData.currentStreak || 0
        } : null;
      }).filter(friend => friend !== null);
  
      setFriends(friendsWithDetails);
      return friendsWithDetails;
    } catch (error) {
      console.error("Error fetching friends:", error);
      return [];
    }
  };