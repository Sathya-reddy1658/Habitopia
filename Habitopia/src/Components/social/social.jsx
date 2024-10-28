import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { getDatabase, ref, get, update, onValue } from 'firebase/database';
import { app } from '../firebase/firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import FooterAndNavbar from '../FooterAndNavbar/FooterAndNavbar';
import NavigationTabs from './NavigationTabs';
import SocialHeader from './SocialHeader';
import SearchSection from './SearchSection';
import FriendRequests from './FriendRequests';
import FriendsList from './FriendsList';
import { fetchIncomingRequests } from './SocialFunctions/fetchIncomingRequests';
import { fetchFriends } from './SocialFunctions/fetchFriends';
import { acceptRequest } from './SocialFunctions/acceptRequest';
import { rejectRequest } from './SocialFunctions/rejectRequest';
import { sendRequest } from './SocialFunctions/sendRequest';
import { removeFriend } from './SocialFunctions/removeFriend';
import { searchUser } from './SocialFunctions/searchUser';

function Social() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [notificationCount, setNotificationCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('friends');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [userData, setUserData] = useState(null);


  const db = getFirestore(app);
  const usersCollection = collection(db, "users");

  useEffect(() => {
    async function fetchUserData() {
      try {
        const user_Ref = doc(db, "users", currentUser.uid);
        console.log("Fetching data for user:", currentUser.uid);
        const userSnapshot = await getDoc(user_Ref);
        if (userSnapshot.exists()) {
          setUserData(userSnapshot.data());
          console.log("User data:", userSnapshot.data());
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching user data: ", error);
      }
    }
    if (currentUser) {
      fetchUserData();
    }
  }, [currentUser, db]);

  useEffect(() => {
    if (!currentUser) return;

    const invitesRef = ref(getDatabase(app), `users/${currentUser.uid}/groupHabitInvites`);
    const unsubscribe = onValue(invitesRef, (snapshot) => {
      const invitesData = snapshot.val();
      setNotificationCount(invitesData ? Object.keys(invitesData).length : 0);
    });


    return () => unsubscribe();
  }, [currentUser]);

  const dbRef = ref(getDatabase(app), `users/${currentUser.uid}`);
  useEffect(() => {
    if (!currentUser) return;

    const dbRef = ref(getDatabase(app), `users/${currentUser.uid}`);

    Promise.all([
      fetchIncomingRequests(dbRef, setIncomingRequests),
      fetchFriends(dbRef, setFriends)
    ])
      .then(() => setIsLoading(false))
      .catch(error => {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      });
  }, [currentUser]);

  const viewProfile = (friendUid) => {
    navigate('/friend-dataviz', { state: { friendUid } });
  };

  const showNotification = (message, type = 'info') => {
    alert(message);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-indigo-50 flex items-center justify-center">
        Loading....
        <FooterAndNavbar />
      </div>
    );
  }

  return (
    <div className="bg-indigo-50 pb-40">
      <FooterAndNavbar />
      <div className="max-w-6xl mx-auto px-4">
        <SocialHeader notificationCount={notificationCount} fid={userData.fid} />

        <NavigationTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          incomingRequestsCount={incomingRequests.length}
        />

        <SearchSection
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          searchUser={() => searchUser(
            setIsLoading, setSearchResults, searchInput, showNotification, setShowSearchResults
          )}
          searchResults={searchResults}
          showSearchResults={showSearchResults}
          sendRequest={(friendId) => {
            const target = searchResults.find(user => user.uid === friendId);
            const displayName = target ? target.displayName : "User";
            sendRequest(friendId, currentUser, setShowSearchResults, displayName, showNotification);
          }}
        />



        <div className="space-y-6">
          {activeTab === 'requests' && incomingRequests.length > 0 && (
            <FriendRequests
              requests={incomingRequests}
              onAccept={(requestId) => acceptRequest(requestId, currentUser, setIncomingRequests, showNotification, setFriends)}
              onReject={(requestId) => rejectRequest(requestId, currentUser, setIncomingRequests, showNotification)}
            />


          )}

          {activeTab === 'friends' && (
            <FriendsList
              friends={friends}
              onViewProfile={(friendId) => viewProfile(friendId, navigate)}
              onRemoveFriend={(friendId) => removeFriend(friendId, currentUser, showNotification, setFriends)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Social;