import { get, getDatabase, ref, update } from "firebase/database";
import { app } from "../../firebase/firebaseConfig";

export const removeFriend = async (friendUid, currentUser, showNotification, setFriends) => {
  if (!currentUser) return;

  const dbRef = ref(getDatabase(app), `users/${currentUser.uid}`);
  const friendRef = ref(getDatabase(app), `users/${friendUid}`);

  try {
    const snapshot = await get(dbRef);
    const updatedFriends = snapshot.val()?.friends?.filter(f => f !== friendUid) || [];
    await update(dbRef, { friends: updatedFriends });

    const friendSnapshot = await get(friendRef);
    const updatedFriendFriends = friendSnapshot.val()?.friends?.filter(f => f !== currentUser.uid) || [];
    await update(friendRef, { friends: updatedFriendFriends });

    setFriends(prevFriends => prevFriends.filter(f => f !== friendUid));
    showNotification("Friend removed successfully!", 'success');
  } catch (error) {
    console.error("Error removing friend:", error);
    showNotification("Failed to remove friend. Please try again.", 'error');
  }
};
