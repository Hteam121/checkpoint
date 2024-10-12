import React, { useState, useEffect } from 'react';
import CheckInStatus from './CheckInStatus';
import CheckpointHistory from './CheckpointHistory';
import './App.css';
import { generateRandomHistory } from './historyUtils'; // Utility to generate random history

function App() {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [studentName] = useState('John'); // Default student name
  const [history, setHistory] = useState([]);

  // Load random checkpoint history on mount
  useEffect(() => {
    const randomHistory = generateRandomHistory(20);
    setHistory(randomHistory);
  }, []);

  const toggleCheckIn = () => setIsCheckedIn(!isCheckedIn);

  return (
    <div className="app-container">
      <main className="main-content">
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



