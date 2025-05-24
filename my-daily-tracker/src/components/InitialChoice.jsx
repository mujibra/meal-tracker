// src/components/InitialChoice.jsx
import React from 'react';

const InitialChoice = ({ onNavigate }) => {
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
    </div>
  );
};

export default InitialChoice;