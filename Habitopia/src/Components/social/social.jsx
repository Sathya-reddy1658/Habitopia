import React, { useState, useEffect } from 'react';
import { getFirestore, doc, onSnapshot, getDoc } from 'firebase/firestore';
import { getDatabase, ref, onValue } from 'firebase/database';
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
  const [friendsData, setFriendsData] = useState({});
  const [searchInput, setSearchInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('friends');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (!friends.length) return;

    const firestore = getFirestore(app);
    const fetchFriendData = async () => {
      const friendProfiles = {};
      
      for (const friendId of friends) {
        try {
          const friendDoc = await getDoc(doc(firestore, "users", friendId));
          if (friendDoc.exists()) {
            friendProfiles[friendId] = friendDoc.data();
          }
        } catch (error) {
          console.error(`Error fetching data for friend ${friendId}:`, error);
        }
      }
      
      setFriendsData(friendProfiles);
    };

    fetchFriendData();
  }, [friends]);

  useEffect(() => {
    if (!currentUser) return;

    const db = getDatabase(app);
    const userRef = ref(db, `users/${currentUser.uid}`);

    const unsubscribe = onValue(userRef, (snapshot) => {
      const userData = snapshot.val();

      if (userData && userData.incoming_req) {
        const requests = Array.isArray(userData.incoming_req) 
          ? userData.incoming_req 
          : Object.keys(userData.incoming_req);
        
        const requestObjects = requests.map(uid => ({
          id: uid,
          uid: uid
        }));
        
        setIncomingRequests(requestObjects);
      } else {
        setIncomingRequests([]);
      }
      
      if (userData && userData.friends) {
        const friendsList = Array.isArray(userData.friends)
          ? userData.friends
          : Object.keys(userData.friends);
        setFriends(friendsList);
      }
      
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) return;

    const firestore = getFirestore(app);
    const userDocRef = doc(firestore, "users", currentUser.uid);

    const unsubscribe = onSnapshot(userDocRef, (doc) => {
      if (doc.exists()) {
        setUserData(doc.data());
      }
    });

    return () => unsubscribe();
  }, [currentUser]);

  const showNotification = (message, type = 'info') => {
    alert(message);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-indigo-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
        <FooterAndNavbar />
      </div>
    );
  }

  const friendsWithData = friends.map(friendId => ({
    uid: friendId,
    displayName: friendsData[friendId]?.displayName || 'Loading...',
    photoURL: friendsData[friendId]?.photoURL,
    email: friendsData[friendId]?.email,
  }));

  return (
    <div className="bg-indigo-50 pb-40">
      <FooterAndNavbar />
      <div className="max-w-6xl mx-auto px-4">
        <SocialHeader 
          notificationCount={incomingRequests.length} 
          fid={userData?.fid} 
        />

        <NavigationTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          incomingRequestsCount={incomingRequests.length}
        />

        <SearchSection
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          searchUser={() => searchUser(
            setIsLoading,
            setSearchResults,
            searchInput,
            showNotification,
            setShowSearchResults
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
              friends={friendsWithData} 
              onViewProfile={(friendId) => navigate('/friend-dataviz', { state: { friendUid: friendId } })}
              onRemoveFriend={(friendId) => removeFriend(friendId, currentUser, showNotification, setFriends)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Social;