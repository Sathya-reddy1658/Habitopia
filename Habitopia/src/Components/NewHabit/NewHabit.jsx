import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { PlusCircle } from 'lucide-react';
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import { v4 as uuidv4 } from 'uuid';
import FooterAndNavbar from '../FooterAndNavbar/FooterAndNavbar'; 
import { SelectField } from './SelectField';
import { InputField } from './InputField';
import { TextareaField } from './TextareaField';

const db = getFirestore();

function NewHabit() {
  const { currentUser } = useAuth();
  const { control, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      habitName: "",
      desc: "",
      purpose: "",
      freq: "Daily",
      hasMetric: "yes",
      metricType: "Time",
      metricUnit: "Minutes",
      target: "",
      emoji: "🏃",
      bestStreak: "0"
    }
  });
  const [successMessage, setSuccessMessage] = useState("");

  const hasMetric = watch("hasMetric");
  const metricType = watch("metricType");

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

  const popularHabitEmojis = ["🏃", "💧", "📚", "🧘", "🥗", "💤", "🚭", "💪", "🎨", "🎵"];

  const onSubmit = async (data) => {
    if (!currentUser) {
      console.error("No user is logged in!");
      return;
    }
  
    const id = uuidv4();
    const habitData = {
      id,
      ...data,
      createdAt: new Date(),
      score: 0,
    };
  
    try {
      const habitRef = doc(db, "users", currentUser.uid, "habits", id);
      await setDoc(habitRef, habitData, { merge: true });
      console.log("Habit added successfully:", habitData);
      setSuccessMessage("Habit added successfully!"); 
      reset(); 
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error adding habit:", error);
    }
  };

  return (
    <div className="select-none pb-40 bg-indigo-600  flex items-start justify-center sm:items-center p-6">
      <div className="w-full max-w-md bg-white/10 rounded-lg overflow-hidden">
        <div className="bg-indigo-600 p-4 sm:p-2">
          <h1 className="text-3xl font-bold text-white text-center">New Habit</h1>
        </div>
        {successMessage && (
          <div className="p-4 bg-green-500 text-white text-center rounded">
            {successMessage}
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="p-4 sm:p-6 rounded-sm space-y-4 sm:space-y-3">
          <div className="flex items-center space-x-2">
            <SelectField
              label="Emoji"
              name="emoji"
              control={control}
              options={popularHabitEmojis}
              className="w-20"
            />
            <InputField
              label="Habit Name"
              name="habitName"
              control={control}
              rules={{ required: "Habit name is required" }}
              placeholder="Enter habit name"
              className="flex-grow"
            />
          </div>
          <TextareaField
            label="Description"
            name="desc"
            control={control}
            placeholder="Describe your habit"
          />
          <TextareaField
            label="Purpose"
            name="purpose"
            control={control}
            rules={{ required: "Purpose is required" }}
            placeholder="Why is this habit important to you?"
          />
          <p className="text-sm text-white italic">The purpose is vital for maintaining your habit. It will remind you why you started this journey.</p>
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
                rules={{ required: "Target is required" }}
                placeholder={`e.g., 30 ${unitsByType[metricType][0]}`}
              />
            </>
          )}
          <button
            type="submit"
            className="w-full  flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-300"
          >
            <PlusCircle className="mr-2" size={20} />
            Add Habit
          </button>
        </form>
      </div>
      <FooterAndNavbar />
    </div>
  );
}





export default NewHabit;
