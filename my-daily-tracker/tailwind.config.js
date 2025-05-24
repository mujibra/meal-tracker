// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // --- General & To-Do Theme ---
        'theme-light-purple': '#EDE7F6', // Main page background for ToDo & Initial Choice
        'theme-purple': '#BA68C8',       // To-Do accents
        'theme-dark-purple': '#7B1FA2',  // Adjusted for better contrast for To-Do text
        'theme-med-purple': '#AB47BC',
        'theme-done-bg': '#E1BEE7',      
        'theme-todo-border': '#B3E5FC', 
        
        // --- Meal Tracker Theme (derived from image_cb00ba.png) ---
        'meal-page-bg': '#FFF0F5',         // Page BG (Lavender Blush like original HTML)
        'meal-header-text': '#D81B60',     // Strong pink for "My Daily Meals" title
        'meal-time-text': '#E91E63',       // Vibrant pink for time text & event item text
        'meal-name-text': '#374151',       // Dark Gray (Tailwind gray-700) for meal names
        'meal-note-text': '#6B7280',       // Medium Gray (Tailwind gray-500) for notes
        
        'meal-card-default-bg': '#FFFFFF', // Default meal card is white
        'meal-card-eaten-bg': '#E0F7FA',   // Light Cyan/Aqua for eaten cards (like Tailwind cyan-50)
        'meal-event-card-bg': '#FEF6E6',  // Very light peachy-pink for event cards like "Wake Up"
        
        'meal-checkbox-border': '#E91E63',   // Vibrant pink for checkbox border
        'meal-checkbox-checked-bg': '#4CAF50',// Clear green for checked state
      },
      borderRadius: {
        '3xl': '1.5rem', 
      },
      boxShadow: { // Using standard Tailwind shadows for now to ensure they apply
        'custom-meal': '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.03)', // Kept custom for closer match if picked up
        'custom-event': '0 4px 8px -1px rgba(0,0,0,0.03), 0 2px 4px -1px rgba(0,0,0,0.03)',   // Slightly more visible event shadow
        'custom-choice': '0 10px 15px -3px rgba(0,0,0,0.07), 0 4px 6px -2px rgba(0,0,0,0.04)',
      },
      fontSize: {
        '2xl-plus': '1.6rem', 
      }
    },
  },
  plugins: [],
}