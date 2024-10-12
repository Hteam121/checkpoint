import React, { useState, useEffect, useRef } from 'react';
import CheckInStatus from './CheckInStatus';
import CheckpointHistory from './CheckpointHistory';
import './App.css';
import { generateRandomHistory } from './historyUtils'; // Utility to generate random history
import { gsap } from 'gsap'; // Import GSAP

function App() {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [studentName] = useState('John'); // Default student name
  const [history, setHistory] = useState([]);
  const mainContentRef = useRef(null); // Create a reference for the main content

  // Load random checkpoint history on mount
  useEffect(() => {
    const randomHistory = generateRandomHistory(20);
    setHistory(randomHistory);

    // Animate main content when the component mounts
    gsap.fromTo(mainContentRef.current, 
      { opacity: 0, y: 20 }, 
      { opacity: 1, y: 0, duration: 1 }
    );
  }, []);

  const toggleCheckIn = () => setIsCheckedIn(!isCheckedIn);

  return (
    <div className="app-container">
      <main className="main-content" ref={mainContentRef}>
        <CheckInStatus
          isCheckedIn={isCheckedIn}
          studentName={studentName} // Using default name
          onToggle={toggleCheckIn}
        />
        <CheckpointHistory history={history} />
      </main>
    </div>
  );
}

export default App;
