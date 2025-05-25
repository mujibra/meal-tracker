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
        // --- Initial Screen Dark Theme (NEW) ---
        'initial-bg-dark': '#2E294E', // Dark Purple-Blue, adjust to match image_9288ce.png
        'initial-text-light': '#F0EAFE', // Very light lavender/off-white for text on dark bg
        'initial-text-dim': '#BCA8E8',   // Dimmer light purple for subtitles on dark bg

        // --- Choice Cards on Dark BG (Can remain white or be slightly adjusted) ---
        'choice-card-bg': '#FFFFFF',
        'choice-card-shadow-color': 'rgba(0, 0, 0, 0.3)', // Darker shadow for contrast

        // --- Water Tracker on Dark BG ---
        'water-tracker-bg': 'rgba(255, 255, 255, 0.08)', // Semi-transparent light card for water tracker
        'water-empty-glass': 'rgba(203, 168, 232, 0.3)',    // Light, dim outline/fill for empty
        'water-full-glass': '#A78BFA',     // Brighter purple for full glass (can reuse theme-purple)
        'water-text': '#F0EAFE',         // Light text for water tracker

        // --- Existing Theme Colors (Tweaked for overall harmony) ---
        'theme-light-purple': '#EDE7F6',   // ToDo Page BG
        'theme-purple': '#A78BFA',         // Main Purple Accent (Used for Water Full Glass too)
        'theme-dark-purple': '#581C87',    // Darker Purple for ToDo Text/Headers
        'theme-med-purple': '#7E22CE',     // Medium Purple
        'theme-done-bg': '#E1BEE7',        // ToDo done card BG
        'theme-todo-border': '#D8B4FE',   // Softer ToDo Checkbox Border
        
        'meal-page-bg': '#FFF0F5',          // Meal Tracker Page BG
        'meal-header-text': '#D81B60',      // Strong pink for Meal Headers
        'meal-time-text': '#E91E63',        // Vibrant pink for meal time text
        'meal-name-text': '#374151',        
        'meal-note-text': '#6B7280',        
        'meal-card-default-bg': '#FFFFFF', 
        'meal-card-eaten-bg': '#E0F7FA',   
        'meal-event-card-bg': '#FEF6E6',  
        'meal-checkbox-border': '#E91E63',   
        'meal-checkbox-checked-bg': '#4CAF50',
      },
      borderRadius: {
        '3xl': '1.5rem', 
      },
      boxShadow: {
        'custom-dark-card': '0 8px 25px rgba(0, 0, 0, 0.25)', // For cards on dark BG
        'custom-meal': '0 8px 15px rgba(0, 0, 0, 0.05)',
        'custom-todo': '0 8px 15px rgba(100, 30, 150, 0.07)', // Adjusted todo shadow
        'custom-event': '0 4px 8px -1px rgba(0,0,0,0.03), 0 2px 4px -1px rgba(0,0,0,0.03)',
      },
      fontSize: {
        '2xl-plus': '1.6rem', 
      }
    },
  },
  plugins: [],
}