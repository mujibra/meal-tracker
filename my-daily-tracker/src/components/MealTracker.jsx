// src/components/MealTracker.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { db, doc, getDoc, setDoc, onSnapshot } from '../firebase';
import LoadingSpinner from './LoadingSpinner';

const mealDataDefinition = [  /* ... (Keep your existing mealDataDefinition) ... */  
    { id: "event-wakeup", time: "6:00 AM", event: "Wake Up", type: "event", icon: "☀️" },
    { id: "meal-snack1", time: "6:30 AM - 7:00 AM", name: "Snack 1 (Morning Snack)", note: "Gap until school is 1 hour.", type: "meal", icon: "🥛" },
    { id: "event-school", time: "8:00 AM", event: "Go to School", type: "event", icon: "🎒" },
    { id: "meal-snack2", time: "9:00 AM - 9:30 AM", name: "Snack 2 (School Snack)", note: "Gap until Main Course 1 is 1 hour 30 minutes.", type: "meal", icon: "🍎" },
    { id: "meal-main1", time: "11:00 AM - 11:30 AM", name: "Main Course 1 (Brunch/Early Lunch)", note: "", type: "meal", icon: "🥪" },
    { id: "event-sparetime", time: "11:30 AM - 12:00 PM", event: "Spare time before nap", type: "event", icon: "🧸" },
    { id: "event-nap", time: "12:00 PM - 1:30 PM", event: "Nap Time", type: "event", icon: "😴" },
    { id: "meal-main2", time: "2:00 PM - 2:30 PM", name: "Main Course 2 (Lunch after nap)", note: "Nap ends at 1:30 PM. Meal 30 mins after. Gap to Snack 3 is 2 hours.", type: "meal", icon: "🍝" },
    { id: "meal-snack3", time: "4:30 PM - 5:00 PM", name: "Snack 3 (Afternoon Snack)", note: "Gap to Main Course 3 is 1 hour 30 minutes.", type: "meal", icon: "🍪" },
    { id: "meal-main3", time: "6:30 PM - 7:00 PM", name: "Main Course 3 (Dinner/Last Meal)", note: "", type: "meal", icon: "🍚" },
    { id: "event-bedtime", time: "8:00 PM", event: "Bedtime", type: "event", icon: "🌙" }
];

const MealTracker = ({ user, onNavigate, customAppId }) => {
  const [mealStatuses, setMealStatuses] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const mealStatusDocRef = useMemo(() => {
    if (!user || !user.uid || !customAppId) return null;
    return doc(db, `artifacts/${customAppId}/users/${user.uid}/mealTrackerData`, "dailyMealStatus");
  }, [user?.uid, customAppId]);

  useEffect(() => {
    if (!mealStatusDocRef) {
      setIsLoading(false);
      if (!user) setError("User not authenticated.");
      setMealStatuses({});
      return;
    }
    setIsLoading(true); setError(null);
    const unsubscribe = onSnapshot(mealStatusDocRef, async (docSnap) => {
      if (docSnap.exists()) {
        setMealStatuses(docSnap.data().statuses || {});
      } else {
        const initialStatuses = {};
        mealDataDefinition.filter(item => item.type === 'meal').forEach(meal => { initialStatuses[meal.id] = false; });
        try { await setDoc(mealStatusDocRef, { statuses: initialStatuses }); setMealStatuses(initialStatuses); }
        catch (e) { console.error("Error setting initial meal doc:", e); setError("Could not initialize meal data."); }
      }
      setIsLoading(false);
    }, (err) => { console.error("Error onSnapshot meal data:", err); setError("Failed to load meal data."); setIsLoading(false); });
    return () => unsubscribe();
  }, [mealStatusDocRef]);

  const handleMealCheckChange = async (mealId, isChecked) => {
    if (!user || !mealStatusDocRef) return;
    const newStatuses = { ...mealStatuses, [mealId]: isChecked };
    setMealStatuses(newStatuses); 
    try { await setDoc(mealStatusDocRef, { statuses: newStatuses }, { merge: true }); }
    catch (err) { console.error("Error saving meal check:", err); setError("Failed to save. Reverting."); setMealStatuses(prev => ({ ...prev, [mealId]: !isChecked })); }
  };

  if (isLoading) return <LoadingSpinner message="Loading Meals... 🍓" />;
  if (error && !user) return <div className="text-center p-4 text-red-500 bg-red-100 rounded-lg">User not authenticated. Please refresh or try signing in again.</div>;
  if (error) return <div className="text-center p-4 text-red-500 bg-red-100 rounded-lg">{error}</div>;

  return (
    <div className="relative">
      <button 
        onClick={() => onNavigate('initialChoice')}
        className="absolute top-0 left-[-0.5rem] sm:left-0 bg-white/80 backdrop-blur-sm text-gray-700 py-2 px-3 rounded-lg shadow hover:bg-white transition-colors text-sm font-semibold z-10"
      >
        ❮ Menu
      </button>
      <header className="text-center mb-8 mt-12">
        <div className="text-5xl text-meal-header-text">🍓</div> 
        <h1 className="text-4xl font-bold text-meal-header-text">My Daily Meals</h1>
        <p className="text-gray-500 mt-2 font-['Inter']">Let's track our yummy food today!</p>
      </header>
      <main>
        {mealDataDefinition.map((item) => {
          if (item.type === 'meal') {
            const isChecked = mealStatuses[item.id] || false;
            return (
              <div 
                key={item.id} 
                className={`p-6 mb-6 rounded-3xl border border-gray-200 transition-all
                ${isChecked 
                    ? 'bg-pink-300 opacity-90 shadow-custom-meal' // Eaten card uses custom shadow if working
                    : 'bg-pink-50 shadow-lg hover:shadow-xl hover:-translate-y-1' // Default card uses standard shadow-lg + subtle border
                }`}
              > {/* Using custom shadow, opacity-90 for eaten, border-transparent might help rendering engine? */}
                <div className="flex justify-between items-start">
                  <div className='shadow-custom-meal'>
                    <p className="text-sm text-meal-time-text font-semibold">{item.time} {item.icon}</p>
                    <h3 className="text-2xl font-bold text-meal-name-text mt-1 mb-2">{item.name}</h3>
                  </div>
                  <label htmlFor={`checkbox-meal-${item.id}`} className="flex items-center cursor-pointer">
                    <div className={`w-7 h-7 border-2 rounded-md flex items-center justify-center transition-all mr-2
                                     ${isChecked ? 'bg-pink-600 border-meal-checkbox-checked-bg' : 'border-meal-checkbox-border'}`}>
                      {isChecked && <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>}
                    </div>
                    <input 
                      type="checkbox" 
                      id={`checkbox-meal-${item.id}`}
                      className="hidden"
                      checked={isChecked}
                      onChange={(e) => handleMealCheckChange(item.id, e.target.checked)}
                    />
                  </label>
                </div>
                {item.note && <p className="text-xs text-meal-note-text mt-3 font-['Inter']">{item.note}</p>}
              </div>
            );
          } else { // Event type
            return (
              <div key={item.id} className="p-6 mb-6 rounded-3xl shadow-custom-event bg-pink-100 border-l-4 border-meal-time-text"> {/* Using text color for border to ensure it's visible */}
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{item.icon}</span>
                  <div>
                    <p className="text-sm text-meal-time-text font-semibold">{item.time}</p>
                    <h3 className="text-lg font-semibold text-meal-time-text">{item.event}</h3>
                  </div>
                </div>
              </div>
            );
          }
        })}
      </main>
    </div>
  );
};

export default MealTracker;