import { get, getDatabase, ref, update } from "firebase/database";
import { app } from "../../firebase/firebaseConfig";
import { fetchFriends } from "./fetchFriends";

export const acceptRequest = async (requestUid, currentUser, setIncomingRequests, showNotification, setFriends) => {
    if (!currentUser) return;

    const dbRef = ref(getDatabase(app), `users/${currentUser.uid}`);
    const friendRef = ref(getDatabase(app), `users/${requestUid}`);

    try {
        const snapshot = await get(dbRef);
        const updatedIncomingReq = snapshot.val()?.incoming_req?.filter(req => req !== requestUid) || [];
        const updatedFriends = [...(snapshot.val()?.friends || []), requestUid];

        await update(dbRef, { 
            incoming_req: updatedIncomingReq, 
            friends: updatedFriends 
        });

        const friendSnapshot = await get(friendRef);
        const updatedFriendOutgoingReq = friendSnapshot.val()?.outgoing_req?.filter(req => req !== currentUser.uid) || [];
        const updatedFriendFriends = [...(friendSnapshot.val()?.friends || []), currentUser.uid];

        await update(friendRef, { 
            outgoing_req: updatedFriendOutgoingReq, 
            friends: updatedFriendFriends 
        });

        setIncomingRequests(updatedIncomingReq);
        showNotification("Friend request accepted!", 'success');
        
        await fetchFriends(dbRef, setFriends);
    } catch (error) {
        console.error("Error accepting friend request:", error);
        showNotification("Failed to accept friend request. Please try again.", 'error');
    }
};
