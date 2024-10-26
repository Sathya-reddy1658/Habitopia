import React, { useState} from 'react';
import { getFirestore } from "firebase/firestore";

import WeeklyCalendarComponent from './WeeklyCalendarComponent';
import HabitsComponent from './HabitsComponent';

const db = getFirestore();

const HabitTrackerComponent = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  return (
    <div>
      <WeeklyCalendarComponent onDateSelect={handleDateSelect} selectedDate={selectedDate} />
      <HabitsComponent selectedDate={selectedDate} />
    </div>
  );
};

export default HabitTrackerComponent;