import { get, getDatabase, ref, update } from "firebase/database";
import { app } from "../../firebase/firebaseConfig";

export const sendRequest = async (targetUid,currentUser,setShowSearchResults, targetName,showNotification) => {
  if (!currentUser || !currentUser.uid || !targetUid) {
    console.error("Invalid user ID(s):", currentUser, targetUid);
    return;
  }
  
    const dbRef = ref(getDatabase(app), `users/${currentUser.uid}`);
    const friendRef = ref(getDatabase(app), `users/${targetUid}`);
  
    try {
      const snapshot = await get(dbRef);
      const outgoingRequests = snapshot.val()?.outgoing_req || [];
      const userCurrentFriends = snapshot.val()?.friends || [];
  
      if (outgoingRequests.includes(targetUid) || userCurrentFriends.includes(targetUid)) {
        showNotification(userCurrentFriends.includes(targetUid) 
          ? "Already Friends!" 
          : "Friend request already sent!", 'info');
        return;
      }
  
      await update(dbRef, { outgoing_req: [...outgoingRequests, targetUid] });
  
      const friendSnapshot = await get(friendRef);
      const incomingRequests = friendSnapshot.val()?.incoming_req || [];
      await update(friendRef, { incoming_req: [...incomingRequests, currentUser.uid] });
  
      setShowSearchResults(false);
      showNotification(`Friend request sent to ${targetName}!`, 'success');
    } catch (error) {
      console.error("Error sending friend request:", error);
      showNotification("Failed to send friend request. Please try again.", 'error');
    }
  };