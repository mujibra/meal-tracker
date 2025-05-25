// src/components/TodoList.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { db, doc, getDoc, setDoc, onSnapshot } from '../firebase';
import LoadingSpinner from './LoadingSpinner';

const todoDataDefinition = [ /* ... (same as before) ... */ 
    { type: "header", title: "Bangun tidur", icon: "🌅" },
    { id: "todo-bangun-1", text: "Minum", type: "task", icon: "💧" },
    { id: "todo-bangun-2", text: "Beresin tempat tidur", type: "task", icon: "🛏️" },
    { id: "todo-bangun-3", text: "Cuci muka/wudhu", type: "task", icon: "🧼" },
    { id: "todo-bangun-4", text: "Solat subuh", type: "task", icon: "🙏" },
    { id: "todo-bangun-5", text: "Almatsurat", type: "task", icon: "📖" },
    { id: "todo-bangun-6", text: "Pipis", type: "task", icon: "🚽" },
    { type: "header", title: "Siap siap sekolah", icon: "🎒" },
    { id: "todo-sekolah-1", text: "Mandi", type: "task", icon: "🚿" },
    { id: "todo-sekolah-2", text: "Sarapan", type: "task", icon: "🥞" },
    { id: "todo-sekolah-3", text: "Siapin bekel + minum", type: "task", icon: "🍱" },
    { id: "todo-sekolah-4", text: "Minum", type: "task", icon: "🥤" },
    { type: "event", title: "Sekolah", icon: "🏫" },
    { type: "header", title: "Pulang sekolah", icon: "🏡" },
    { id: "todo-pulang-1", text: "Simpen tas ditempatnya", type: "task", icon: "🎒" },
    { id: "todo-pulang-2", text: "Cuci kaki tangan muka", type: "task", icon: "🤲" },
    { id: "todo-pulang-3", text: "Ganti baju", type: "task", icon: "👕" },
    { id: "todo-pulang-4", text: "Simpen wadah bekel ke wastafel", type: "task", icon: "🍽️" },
    { id: "todo-pulang-5", text: "Minum", type: "task", icon: "💧" },
    { type: "header", title: "Siang", icon: "☀️" },
    { id: "todo-siang-1", text: "Minum", type: "task", icon: "💧" },
    { id: "todo-siang-2", text: "Sholat", type: "task", icon: "🙏" },
    { id: "todo-siang-3", text: "Makan siang", type: "task", icon: "🍛" },
    { id: "todo-siang-4", text: "Tidur siang", type: "task", icon: "😴" },
    { type: "header", title: "Sore", icon: "🧸" },
    { id: "todo-sore-1", text: "Sholat", type: "task", icon: "🙏" },
    { id: "todo-sore-2", text: "Main", type: "task", icon: "🪁" },
    { id: "todo-sore-3", text: "Mandi", type: "task", icon: "🛀" },
    { id: "todo-sore-4", text: "Makan malem", type: "task", icon: "🍲" },
    { id: "todo-sore-5", text: "Beresin rumah sebelum papa plg", type: "task", icon: "🧹" },
    { id: "todo-sore-6", text: "Almatsurat", type: "task", icon: "📖" },
    { type: "header", title: "Magrib", icon: "🌙" },
    { id: "todo-magrib-1", text: "Sholat", type: "task", icon: "🙏" },
    { id: "todo-magrib-2", text: "Ombeh", type: "task", icon: "🤲" },
    { id: "todo-magrib-3", text: "Siapin buat bsk sekolah", type: "task", icon: "📚" },
    { id: "todo-magrib-4", text: "Bobo", type: "task", icon: "💤" }
];

const TodoList = ({ user, onNavigate, customAppId }) => {
  const [todoStatuses, setTodoStatuses] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const todoStatusDocRef = useMemo(() => {
    if (!user || !user.uid || !customAppId) return null;
    return doc(db, `artifacts/${customAppId}/users/${user.uid}/todoListData`, "dailyTodoStatus");
  }, [user?.uid, customAppId]);

  useEffect(() => {
    if (!todoStatusDocRef) {
      setIsLoading(false); 
      if (!user) setError("User not authenticated.");
      setTodoStatuses({});
      return;
    }
    setIsLoading(true); setError(null);
    const unsubscribe = onSnapshot(todoStatusDocRef, async (docSnap) => {
      if (docSnap.exists()) {
        setTodoStatuses(docSnap.data().statuses || {});
      } else {
        const initialStatuses = {};
        todoDataDefinition.filter(item => item.type === 'task').forEach(task => { initialStatuses[task.id] = false; });
        try {
          await setDoc(todoStatusDocRef, { statuses: initialStatuses });
          setTodoStatuses(initialStatuses);
        } catch (e) { setError("Could not initialize to-do data."); }
      }
      setIsLoading(false);
    }, (err) => { setError("Failed to load to-do data."); setIsLoading(false); });
    return () => unsubscribe();
  }, [todoStatusDocRef]);

  const handleTodoCheckChange = async (taskId, isChecked) => {
    if (!user || !todoStatusDocRef) return;
    const newStatuses = { ...todoStatuses, [taskId]: isChecked };
    setTodoStatuses(newStatuses);
    try {
      await setDoc(todoStatusDocRef, { statuses: newStatuses }, { merge: true });
    } catch (err) {
      setError("Failed to save. Reverting.");
      setTodoStatuses(prev => ({ ...prev, [taskId]: !isChecked }));
    }
  };

  if (isLoading) return <LoadingSpinner message="Loading To-Dos... 📝" />;
  if (error && !user) return <div className="text-center p-4 text-red-500 bg-red-100 rounded-lg">User not authenticated. Please refresh or try signing in again.</div>;
  if (error) return <div className="text-center p-4 text-red-500 bg-red-100 rounded-lg">{error}</div>;


  return (
    <div className="relative"> {/* Ensure section-container equivalent */}
      <button 
        onClick={() => onNavigate('initialChoice')}
        className="absolute top-0 left-[-0.5rem] sm:left-0 bg-white/80 backdrop-blur-sm text-gray-700 py-2 px-3 rounded-lg shadow hover:bg-white transition-colors text-sm font-semibold z-10"
      >
        ❮ Menu
      </button>
      <header className="text-center mb-8 mt-12">
        <div className="text-5xl text-theme-purple">📝</div>
        <h1 className="text-4xl font-bold text-theme-purple">My To-Do List</h1>
        <p className="text-gray-500 mt-2 font-['Inter']">Let's get things done!</p>
      </header>
      <main>
        {todoDataDefinition.map((item, index) => {
          if (item.type === 'header') {
            return <h2 key={`header-${index}`} className="text-2xl-plus font-bold text-theme-dark-purple mt-8 mb-3 pb-1 border-b-2 border-theme-purple flex items-center"><span className="text-3xl mr-2">{item.icon}</span>{item.title}</h2>;
          } else if (item.type === 'event') {
            return (
              <div key={`event-${index}`} className="p-5 mb-4 rounded-3xl shadow-custom-event bg-purple-100 text-theme-dark-purple font-semibold flex items-center justify-center text-lg"> {/* Original: rounded-2xl */}
                <span className="text-3xl mr-3">{item.icon}</span>{item.title}
              </div>
            );
          } else if (item.type === 'task') {
            const isChecked = todoStatuses[item.id] || false;
            return (
              <div 
                key={item.id} 
                style={{ /* Polka dot pattern from original CSS */
                  backgroundImage: "radial-gradient(circle at 1.5px 1.5px, rgba(192, 132, 252, 0.15) 1.5px, transparent 0)",
                  backgroundSize: "12px 12px"
                }}
                className={`py-[1.25rem] px-6 mb-4 rounded-3xl shadow-custom-todo transition-all flex items-center
                            ${isChecked ? 'bg-purple-900 opacity-75' : 'bg-white hover:shadow-xl hover:-translate-y-1'}`}
              > {/* py-[1.25rem] px-6, mb-4 (1rem), rounded-3xl (1.5rem) */}
                <span className="text-[1.4rem] mr-3.5 w-7 text-center text-theme-med-purple">{item.icon}</span> {/* Original task-icon styling */}
                <p className={`flex-grow text-[1.1rem] ${isChecked ? 'line-through text-theme-med-purple' : 'text-theme-dark-purple'}`}>{item.text}</p> {/* Original 1.1rem */}
                <label htmlFor={`checkbox-todo-${item.id}`} className="flex items-center cursor-pointer ml-auto todo-checkbox-label">
                  <div className={`checkbox-custom w-7 h-7 border-2 rounded-md flex items-center justify-center transition-all
                                   ${isChecked ? 'bg-purple-500 border-theme-purple' : 'border-theme-todo-border'}`}>
                    {isChecked && <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>}
                  </div>
                  <input 
                    type="checkbox" 
                    id={`checkbox-todo-${item.id}`}
                    className="hidden"
                    checked={isChecked}
                    onChange={(e) => handleTodoCheckChange(item.id, e.target.checked)}
                  />
                </label>
              </div>
            );
          }
          return null;
        })}
      </main>
    </div>
  );
};
export default TodoList;