import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { PlusCircle, Users } from 'lucide-react';
import { SelectField } from './SelectField';
import { InputField } from './InputField';
import { TextareaField } from './TextareaField';
import { getFirestore, collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { getDatabase, ref, get, update, push } from 'firebase/database';
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from 'react-router-dom';

const NewGroupHabit = () => {
  const { currentUser } = useAuth();
  const [friends, setFriends] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  
  const db = getFirestore();
  const realtimeDb = getDatabase();

  const { control, handleSubmit, watch, reset } = useForm({
    defaultValues: {
      habitName: "",
      desc: "",
      purpose: "",
      freq: "Daily",
      hasMetric: "yes",
      metricType: "Time",
      metricUnit: "Minutes",
      target: "",
      emoji: "👥",
      groupName: "",
      bestStreak: "0",
      completedDays: "0",
      progress: "0",
      score: "0"
    }
  });

  // Fetch friends list when component mounts
  useEffect(() => {
    const fetchFriends = async () => {
      if (!currentUser) return;

      try {
        // Get friends list from realtime database
        const friendsRef = ref(realtimeDb, `users/${currentUser.uid}/friends`);
        const friendsSnapshot = await get(friendsRef);
        const friendsList = friendsSnapshot.val() || [];

        // Get user details from Firestore
        const usersSnapshot = await getDocs(collection(db, "users"));
        const usersData = {};
        usersSnapshot.forEach(doc => {
          const userData = doc.data();
          usersData[userData.uid] = userData;
        });

        // Combine friend UIDs with their details
        const friendsWithDetails = friendsList.map(friendUid => ({
          id: friendUid,
          name: usersData[friendUid]?.displayName || 'Unknown User',
          email: usersData[friendUid]?.email || 'No email'
        })).filter(friend => friend.name !== 'Unknown User');

        setFriends(friendsWithDetails);
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    };

    fetchFriends();
  }, [currentUser]);

  const hasMetric = watch("hasMetric");
  const metricType = watch("metricType");

  // Your existing metric types and units...
  const metricTypes = ["Time", "Distance", "Count", "Weight", "Percentage", "Pages", "Calories", "Money", "Other"];
  const unitsByType = {
    Time: ["Minutes", "Hours", "Days"],
    Distance: ["Meters", "Kilometers", "Miles", "Steps"],
    Count: ["Repetitions", "Sets", "Items"],
    Weight: ["Kilograms", "Pounds", "Grams"],
    Percentage: ["%"],
    Pages: ["Pages"],
    Calories: ["Calories"],
    Money: ["USD", "EUR", "GBP", "JPY"],
    Other: ["Custom"]
  };

  const groupHabitEmojis = ["👥", "🤝", "🎯", "⭐", "🌟", "🏆", "🎉", "💪", "🏃‍♂️", "🧘‍♀️"];

  const handleUserSelect = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  // Function to send invites to selected friends
  const sendGroupHabitInvites = async (habitData) => {
    try {
      const creatorSnapshot = await getDocs(collection(db, "users"));
      const creatorData = creatorSnapshot.docs.find(doc => doc.data().uid === currentUser.uid)?.data();

      for (const friendId of selectedUsers) {
        // Create invite in realtime database under the friend's node
        const newInviteRef = push(ref(realtimeDb, `users/${friendId}/groupHabitInvites`));
        
        await update(newInviteRef, {
          habitId: habitData.id,
          from: currentUser.uid,
          fromName: creatorData?.displayName || 'Unknown User',
          habitName: habitData.habitName,
          groupName: habitData.groupName,
          status: 'pending',
          createdAt: new Date().toISOString(),
          habitDetails: {
            ...habitData,
            creatorName: creatorData?.displayName || 'Unknown User'
          }
        });
      }
    } catch (error) {
      console.error("Error sending invites:", error);
      throw error;
    }
  };

  // Function to create the group habit in Realtime DB
  const createGroupHabitInRealtimeDB = async (habitData) => {
    try {
      const groupHabitRef = ref(realtimeDb, `groupHabits/${habitData.id}`);
      await update(groupHabitRef, {
        ...habitData,
        members: { [currentUser.uid]: { status: 'accepted', joinedAt: new Date().toISOString() } },
        pendingInvites: selectedUsers.reduce((acc, userId) => {
          acc[userId] = { status: 'pending', invitedAt: new Date().toISOString() };
          return acc;
        }, {}),
        createdAt: new Date().toISOString(),
        status: 'active'
      });
    } catch (error) {
      console.error("Error creating group habit in Realtime DB:", error);
      throw error;
    }
  };

  const createHabitForCreator = async (habitData) => {
    try {
      const habitRef = doc(collection(db, "users", currentUser.uid, "habits"));
      await setDoc(habitRef, {
        ...habitData,
        createdAt: new Date(),
        isGroupHabit: true,
        groupId: habitData.id,
        creator: currentUser.uid,
        participants: [currentUser.uid],
        pendingParticipants: selectedUsers
      });
    } catch (error) {
      console.error("Error creating habit for creator:", error);
      throw error;
    }
  };

  const onSubmit = async (data) => {
    if (selectedUsers.length === 0) {
      setSuccessMessage("Please select at least one friend to create a group habit!");
      return;
    }

    try {
      const habitData = {
        ...data,
        id: `group_${Date.now()}`,
        creatorId: currentUser.uid,
        participants: [currentUser.uid],
        pendingParticipants: selectedUsers,
        createdAt: new Date().toISOString()
      };

      await createGroupHabitInRealtimeDB(habitData);

      await createHabitForCreator(habitData);

      await sendGroupHabitInvites(habitData);

      setSuccessMessage("Group Habit created and invitations sent!");
      reset();
      setSelectedUsers([]);

      setTimeout(() => {
        navigate('/home');
      }, 2000);

    } catch (error) {
      console.error("Error creating group habit:", error);
      setSuccessMessage("Error creating group habit. Please try again.");
    }
  };

  return (
    <div className="pb-40 select-none bg-indigo-600 sm:pt-16  flex items-start justify-center sm:items-center p-4">
      <div className="w-full max-w-md bg-white/10 rounded-lg overflow-hidden">
        <div className="bg-indigo-600 p-4 sm:p-2">
          <h1 className="text-3xl font-bold text-white text-center">New Group Habit</h1>
        </div>
        
        {successMessage && (
          <div className="p-4 bg-green-500 text-white text-center">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="p-4 sm:p-6 rounded-sm space-y-4 sm:space-y-3">
          <div className="flex items-center space-x-2">
            <SelectField
              label="Emoji"
              name="emoji"
              control={control}
              options={groupHabitEmojis}
              className="w-20"
            />
            <InputField
              label="Habit Name"
              name="habitName"
              control={control}
              rules={{ required: "Habit name is required" }}
              placeholder="Enter group habit name"
              className="flex-grow"
            />
          </div>

          <InputField
            label="Group Name"
            name="groupName"
            control={control}
            rules={{ required: "Group name is required" }}
            placeholder="Enter group name"
          />

          <TextareaField
            label="Description"
            name="desc"
            control={control}
            placeholder="Describe your group habit"
          />

          <TextareaField
            label="Purpose"
            name="purpose"
            control={control}
            rules={{ required: "Purpose is required" }}
            placeholder="What's the group's purpose for this habit?"
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-white">Invite Friends</label>
            <div className="grid grid-cols-1 gap-2">
              {friends.map(friend => (
                <div
                  key={friend.id}
                  className={`p-2 rounded-md cursor-pointer transition-colors duration-200 flex items-center justify-between ${
                    selectedUsers.includes(friend.id)
                      ? 'bg-indigo-500 text-white'
                      : 'bg-white/10 text-white'
                  }`}
                  onClick={() => handleUserSelect(friend.id)}
                >
                  <div>
                    <p className="font-medium">{friend.name}</p>
                    <p className="text-sm opacity-75">{friend.email}</p>
                  </div>
                  <Users size={20} />
                </div>
              ))}
            </div>
          </div>

          <SelectField
            label="Frequency"
            name="freq"
            control={control}
            options={["Daily", "Weekly", "Bi-Weekly", "Monthly", "Quarterly", "Yearly"]}
          />

          <SelectField
            label="Does this habit have a measurable metric?"
            name="hasMetric"
            control={control}
            options={["yes", "no"]}
          />

          {hasMetric === "yes" && (
            <>
              <SelectField
                label="Metric Type"
                name="metricType"
                control={control}
                options={metricTypes}
              />

              <SelectField
                label="Metric Unit"
                name="metricUnit"
                control={control}
                options={unitsByType[metricType]}
              />

              <InputField
                label="Target"
                name="target"
                control={control}
                rules={{ required: hasMetric === "yes" }}
                placeholder={`Group target (e.g., 30 ${unitsByType[metricType][0]})`}
              />
            </>
          )}

          <button
            type="submit"
            className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-300"
          >
            <PlusCircle className="mr-2" size={20} />
            Create Group Habit
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewGroupHabit;