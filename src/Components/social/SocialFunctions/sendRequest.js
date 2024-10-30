import { get, getDatabase, ref, update } from "firebase/database";
import { app } from "../../firebase/firebaseConfig";

export const sendRequest = async (
  targetUid,
  currentUser,
  setShowSearchResults,
  targetName,
  showNotification
) => {
  if (!currentUser || !currentUser.uid || !targetUid) {
    console.error("Invalid user ID(s):", currentUser, targetUid);
    return;
  }

  const db = getDatabase(app);
  const userRef = ref(db, `users/${currentUser.uid}`);
  const friendRef = ref(db, `users/${targetUid}`);

  try {
    const userSnapshot = await get(userRef);
    const friendSnapshot = await get(friendRef);

    if (!userSnapshot.exists() || !friendSnapshot.exists()) {
      showNotification("User not found.", 'error');
      return;
    }

    const userData = userSnapshot.val();
    const friendData = friendSnapshot.val();

    const outgoingRequests = userData.outgoing_req || [];
    const userCurrentFriends = userData.friends || [];
    const incomingRequests = friendData.incoming_req || [];

    if (userCurrentFriends.includes(targetUid)) {
      showNotification("Already Friends!", 'info');
      return;
    }

    if (outgoingRequests.includes(targetUid)) {
      showNotification("Friend request already sent!", 'info');
      return;
    }

    if (incomingRequests.includes(currentUser.uid)) {
      showNotification(`You have already sent a request to ${targetName}.`, 'info');
      return;
    }

    const updates = {};
    updates[`users/${currentUser.uid}/outgoing_req`] = [...outgoingRequests, targetUid];
    updates[`users/${targetUid}/incoming_req`] = [...incomingRequests, currentUser.uid];

    await update(ref(db), updates);

    setShowSearchResults(false);
    showNotification(`Friend request sent to ${targetName}!`, 'success');
  } catch (error) {
    console.error("Error sending friend request:", error);
    showNotification("Failed to send friend request. Please try again.", 'error');
  }
};