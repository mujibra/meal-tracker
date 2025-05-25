// src/App.jsx
import React, { useState, useEffect, useMemo } from 'react'; // Added useMemo just in case, though not strictly needed for this fix
import { auth, db, onAuthStateChanged, signInAnonymously, signInWithCustomToken, doc, getDoc, setDoc, onSnapshot, customAppId } from './firebase'; // ensure 'doc' and 'db' are imported
import InitialChoice from './components/InitialChoice';
import MealTracker from './components/MealTracker';
import TodoList from './components/TodoList';
import LoadingSpinner from './components/LoadingSpinner';

const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;
const WATER_GOAL = 7;

function App() {
  const [currentView, setCurrentView] = useState('initialChoice');
  const [user, setUser] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [userIdForDisplay, setUserIdForDisplay] = useState('');
  const [waterCount, setWaterCount] = useState(0);
  const [waterDocRef, setWaterDocRef] = useState(null);
  const [isWaterLoading, setIsWaterLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setUserIdForDisplay(currentUser.uid);
        
        // Corrected path for water document reference:
        // "artifacts" (collection)
        // customAppId (document)
        // "users" (collection)
        // currentUser.uid (document)
        // "userDailyData" (collection) <-- NEW subcollection name
        // "waterStatus" (document ID) <-- Document to store waterIntake
        const newWaterDocRef = doc(db, "artifacts", customAppId, "users", currentUser.uid, "userDailyData", "waterStatus");
        setWaterDocRef(newWaterDocRef);
        setIsAuthReady(true);
      } else {
        setIsAuthReady(false);
        setUser(null);
        setWaterDocRef(null);
        setUserIdForDisplay('');
        try {
          if (initialAuthToken) await signInWithCustomToken(auth, initialAuthToken);
          else await signInAnonymously(auth);
        } catch (error) {
          console.error("Error during sign-in:", error);
          setIsAuthReady(true); 
        }
      }
    });
    return () => unsubscribeAuth();
  }, []); // customAppId should be stable, so not needed in deps if defined globally like it is

  // Effect for loading and listening to water data
  useEffect(() => {
    if (!waterDocRef) {
      setWaterCount(0);
      setIsWaterLoading(false);
      return;
    }
    setIsWaterLoading(true);
    const unsubscribeWater = onSnapshot(waterDocRef, async (docSnap) => {
      if (docSnap.exists()) {
        setWaterCount(docSnap.data().waterIntake || 0);
      } else {
        console.log("App: No waterStatus doc. Creating with initial waterIntake.");
        try {
          await setDoc(waterDocRef, { waterIntake: 0 }); // This document will store { waterIntake: number }
          setWaterCount(0);
        } catch (e) {
          console.error("App: Failed to set initial waterStatus doc:", e);
        }
      }
      setIsWaterLoading(false);
    }, (error) => {
      console.error("App: Error listening to waterIntake status:", error);
      setIsWaterLoading(false);
    });
    return () => unsubscribeWater();
  }, [waterDocRef]); // Re-run if waterDocRef changes (e.g., on user login/logout)

  const handleWaterGlassClick = async (glassIndex) => {
    if (!user || !waterDocRef) return;
    let newWaterCount = glassIndex + 1;
    if (newWaterCount === waterCount && waterCount > 0) { // Allow deselecting the last glass
        newWaterCount = waterCount - 1;
    } else if (newWaterCount === waterCount && waterCount === 0 && glassIndex === 0){ // if count is 0 and first glass is clicked
        newWaterCount = 1;
    }


    setWaterCount(newWaterCount); 
    try {
      // The document now only stores waterIntake directly
      await setDoc(waterDocRef, { waterIntake: newWaterCount }, { merge: true }); // Use merge:true if other fields might exist
    } catch (err) {
      console.error("App: Error updating water intake in Firestore:", err);
      // Consider reverting optimistic update here if needed
    }
  };

  useEffect(() => {
    document.body.className = ''; 
    if (currentView === 'mealTracker') {
      document.body.style.backgroundColor = '#FFF0F5'; 
    } else if (currentView === 'todoList') {
      document.body.style.backgroundColor = '#EDE7F6'; 
    } else { 
      document.body.style.backgroundColor = '#bbb1fa'; 
    }
  }, [currentView]);

  if (!isAuthReady && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-initial-bg-dark" style={{backgroundColor: '#bbb1fa'}}>
        <LoadingSpinner message="Initializing App..." />
      </div>
    );
  }

  const navigateTo = (view) => setCurrentView(view);

  const renderView = () => {
    switch (currentView) {
      case 'mealTracker':
        return <MealTracker user={user} onNavigate={navigateTo} customAppId={customAppId} />;
      case 'todoList':
        return <TodoList user={user} onNavigate={navigateTo} customAppId={customAppId} />;
      case 'initialChoice':
      default:
        return (
          <InitialChoice 
            onNavigate={navigateTo} 
            waterCount={waterCount}
            waterGoal={WATER_GOAL}
            onWaterGlassClick={handleWaterGlassClick}
            isWaterLoading={isWaterLoading}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 sm:p-6 w-full">
      {userIdForDisplay && (
        <div id="userIdDisplay" className="fixed bottom-2.5 left-2.5 bg-gray-700/50 backdrop-blur-sm text-white p-1.5 px-2.5 rounded-lg text-xs shadow-md z-50 font-mono">
          User ID: <span className="font-semibold">{userIdForDisplay.substring(0,8)}...</span>
        </div>
      )}
      <div className="w-full max-w-2xl">
        {renderView()}
        {currentView === 'initialChoice' && (
           <footer className="text-center mt-10 mb-16 text-initial-text-dim text-sm">
             &copy; {new Date().getFullYear()} Fun Times Tracker
           </footer>
        )}
        {currentView !== 'initialChoice' && (
           <footer className="text-center mt-10 mb-6 text-sm text-gray-500">
             &copy; {new Date().getFullYear()} Fun Times Tracker
           </footer>
        )}
      </div>
    </div>
  );
}
export default App;