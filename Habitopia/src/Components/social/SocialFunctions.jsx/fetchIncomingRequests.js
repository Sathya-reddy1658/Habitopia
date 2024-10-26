import { get } from "firebase/database";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app } from "../../firebase/firebaseConfig";

export const fetchIncomingRequests = async (dbRef, setIncomingRequests) => {
  try {
    const snapshot = await get(dbRef);
    const incomingReqIds = snapshot.val()?.incoming_req || [];
    
    if (incomingReqIds.length === 0) {
      setIncomingRequests([]);
      return [];
    }
    const db = getFirestore(app);
    const incomingReqDetails = await Promise.all(incomingReqIds.map(async (uid) => {
      const userRef = doc(db, "users", uid);
      const userSnapshot = await getDoc(userRef);
      return {
        uid,
        displayName: userSnapshot.exists() ? userSnapshot.data().displayName : "Unknown User",
      };
    }));

    setIncomingRequests(incomingReqDetails);
    return incomingReqDetails;
  } catch (error) {
    console.error("Error fetching incoming requests:", error);
    return [];
  }
};
