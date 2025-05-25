// src/components/InitialChoice.jsx
import React from 'react';
import LoadingSpinner from './LoadingSpinner';

const InitialChoice = ({ onNavigate, waterCount, waterGoal, onWaterGlassClick, isWaterLoading  }) => {
  return (
    <div className="text-center pt-[5vh]">
      <div className="text-5xl mb-2">🧸</div> {/* Original: main-header-icon -> 3rem */}
      <h1 className="text-4xl font-bold text-gray-700">My Daily Helper</h1>
      <p className="text-gray-500 mt-2 mb-10 font-['Inter']">Choose what you want to track today!</p>
      <div className="grid md:grid-cols-2 gap-6">
        <div 
          onClick={() => onNavigate('mealTracker')}
          className="bg-white p-8 py-10 rounded-3xl shadow-custom-choice cursor-pointer transition-all hover:transform hover:-translate-y-1.5 hover:shadow-xl"
        > {/* p-8 is 2rem, py-10 for more vertical space. Original padding: 2rem 1.5rem */}
          <div className="text-6xl mb-2">🍓</div> {/* Original: choice-icon -> 3.5rem */}
          <h3 className="text-2xl font-bold text-theme-pink">Meal Tracker</h3> {/* Original: 1.8rem */}
          <p className="text-sm text-gray-600 mt-1 font-['Inter']">Track your daily meals and snacks.</p> {/* Original: 0.9rem */}
        </div>
        <div 
          onClick={() => onNavigate('todoList')}
          className="bg-white p-8 py-10 rounded-3xl shadow-custom-choice cursor-pointer transition-all hover:transform hover:-translate-y-1.5 hover:shadow-xl"
        >
          <div className="text-6xl mb-2">📝</div>
          <h3 className="text-2xl font-bold text-theme-purple">To-Do List</h3>
          <p className="text-sm text-gray-600 mt-1 font-['Inter']">Check off your daily tasks and routines.</p>
        </div>
      </div>
      {/* Water Tracker Section - Placed in the red box area */}
      <div className="bg-white mt-6 p-6 rounded-3xl bg-water-tracker-bg shadow-custom-dark-card">
        <h3 className="text-2xl font-bold text-theme-purple">Today's Water Intake</h3>
        {isWaterLoading ? (
          <div className="py-4"><LoadingSpinner message="Loading water data..." /></div>
        ) : (
          <>
            <h3 className="text-7xl my-8 text-water-text mb-5 font-semibold">
              {waterCount}🥛
            </h3>
            <div className="flex justify-center mt-8 items-center space-x-1 sm:space-x-2 mb-3">
              {[...Array(waterGoal)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => onWaterGlassClick(index)}
                  aria-label={`Mark ${index + 1} ${index + 1 === 1 ? 'glass' : 'glasses'} of water`}
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-initial-bg-dark focus:ring-water-full-glass
                              ${index < waterCount 
                                  ? 'bg-[#BFE7FF] border-transparent hover:opacity-80' 
                                  : 'bg-[#E7E2F1] border-transparent hover:bg-opacity-60 hover:border-water-full-glass' 
                              }`}
                >
                  {/* Visual cue for filled/empty if needed, e.g., a smaller inner circle or different emoji */}
                </button>
              ))}
            </div>
            {waterCount === waterGoal && (
              <p className="text-center text-purple-400 font-bold mt-8 animate-pulse">
                🎉 Goal Achieved! Keep it up! 🎉
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default InitialChoice;