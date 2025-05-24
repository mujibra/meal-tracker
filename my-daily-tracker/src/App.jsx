// src/App.jsx
import React, { useState, useEffect } from 'react';
import { auth, onAuthStateChanged, signInAnonymously, signInWithCustomToken, customAppId } from './firebase';
import InitialChoice from './components/InitialChoice';
import MealTracker from './components/MealTracker';
import TodoList from './components/TodoList';
import LoadingSpinner from './components/LoadingSpinner';

const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

function App() {
  const [currentView, setCurrentView] = useState('initialChoice');
  const [user, setUser] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [userIdForDisplay, setUserIdForDisplay] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setUserIdForDisplay(currentUser.uid);
        setIsAuthReady(true);
      } else {
        setIsAuthReady(false); // Show loading until sign-in attempt
        try {
          if (initialAuthToken) {
            await signInWithCustomToken(auth, initialAuthToken);
          } else {
            await signInAnonymously(auth);
          }
        } catch (error) {
          console.error("Error during sign-in:", error);
          setIsAuthReady(true); // Allow UI to render even if sign-in fails, to show error
        }
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    document.body.style.backgroundColor = '#EDE7F6'; // Default to theme-light-purple

    if (currentView === 'mealTracker') {
      document.body.style.backgroundColor = '#FFF0F5'; // meal-page-bg
    } else if (currentView === 'todoList') {
      document.body.style.backgroundColor = '#EDE7F6'; // theme-light-purple
    }
  }, [currentView]);

  if (!isAuthReady && !user) { // Show loading longer if user is null and auth isn't ready
    return (
      <div className="min-h-screen flex items-center justify-center bg-theme-light-purple">
        <LoadingSpinner message="Initializing App..." />
      </div>
    );
  }

  const navigateTo = (view) => {
    setCurrentView(view);
  };

  const renderView = () => {
    switch (currentView) {
      case 'mealTracker':
        return <MealTracker user={user} onNavigate={navigateTo} customAppId={customAppId} />;
      case 'todoList':
        return <TodoList user={user} onNavigate={navigateTo} customAppId={customAppId} />;
      case 'initialChoice':
      default:
        return <InitialChoice onNavigate={navigateTo} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 sm:p-6">
      {userIdForDisplay && (
        <div id="userIdDisplay" className="fixed bottom-2.5 left-2.5 bg-white/90 backdrop-blur-sm p-1.5 px-2.5 rounded-lg text-xs text-gray-700 shadow-md z-50 font-mono">
          User ID: <span className="font-semibold">{userIdForDisplay.substring(0,8)}...</span>
        </div>
      )}
      <div className="w-full max-w-2xl">
        {renderView()}
        <footer className="text-center mt-10 mb-6 text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Fun Times Tracker
        </footer>
      </div>
    </div>
  );
}
export default App;