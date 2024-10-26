import { collection, getDocs, getFirestore } from "@firebase/firestore";
import { app } from "../../firebase/firebaseConfig";

export  const searchUser = async (setIsLoading,setSearchResults,searchInput,showNotification,setShowSearchResults) => {
  if (!searchInput || !searchInput.trim()) return;
  
    const db = getFirestore(app);
    const usersCollection = collection(db, "users");  
    setIsLoading(true);
    try {
      const querySnapshot = await getDocs(usersCollection);
      const results = querySnapshot.docs
        .map(doc => doc.data())
        .filter(userData => 
          userData.fid?.toLowerCase().includes(searchInput.toLowerCase()) ||
          userData.displayName?.toLowerCase().includes(searchInput.toLowerCase())
        )
        .map(userData => ({
          uid: userData.uid,
          displayName: userData.displayName,
          fid: userData.fid
        }));
      
      setSearchResults(results);
      setShowSearchResults(true);
    } catch (error) {
      console.error("Error searching users:", error);
      showNotification("Error searching users. Please try again.", 'error');
    } finally {
      setIsLoading(false);
    }
  }