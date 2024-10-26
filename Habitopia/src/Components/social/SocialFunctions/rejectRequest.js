import { get, getDatabase, ref, update } from "firebase/database";
import { app } from "../../firebase/firebaseConfig";

export const rejectRequest = async (requestUid, currentUser, setIncomingRequests, showNotification) => {
    if (!currentUser) return;

    const dbRef = ref(getDatabase(app), `users/${currentUser.uid}`);
    const friendRef = ref(getDatabase(app), `users/${requestUid}`);

    try {
        const snapshot = await get(dbRef);
        const updatedIncomingReq = snapshot.val()?.incoming_req?.filter(req => req !== requestUid) || [];
        await update(dbRef, { incoming_req: updatedIncomingReq });

        const friendSnapshot = await get(friendRef);
        const updatedFriendOutgoingReq = friendSnapshot.val()?.outgoing_req?.filter(req => req !== currentUser.uid) || [];
        await update(friendRef, { outgoing_req: updatedFriendOutgoingReq });

        setIncomingRequests(updatedIncomingReq);
        showNotification("Friend request rejected!", 'info');
    } catch (error) {
        console.error("Error rejecting friend request:", error);
        showNotification("Failed to reject friend request. Please try again.", 'error');
    }
};
