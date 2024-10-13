import React, { useState, useEffect, useRef } from 'react';
import CheckInStatus from './CheckInStatus';
import CheckpointHistory from './CheckpointHistory';
import './App.css';
import { generateRandomHistory } from './historyUtils';
import { gsap } from 'gsap';

// Import Firebase modules
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue } from 'firebase/database';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCinhS9yTZ19d8VLJEjnR7ukDS2Bw1_RNc",
  authDomain: "checkpoint-77dd4.firebaseapp.com",
  databaseURL: "https://checkpoint-77dd4-default-rtdb.firebaseio.com",
  projectId: "checkpoint-77dd4",
  storageBucket: "checkpoint-77dd4.appspot.com",
  messagingSenderId: "250629851274",
  appId: "1:250629851274:web:5a52719e4cb5fb424a4573",
  measurementId: "G-TLL6YHS1K4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

function App() {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [studentName] = useState('John'); // Default student name
  const [history, setHistory] = useState([]);
  const mainContentRef = useRef(null);

  useEffect(() => {
    // Set up Firebase listener for detection_status
    const detectionStatusRef = ref(db, 'detection_status');
    onValue(detectionStatusRef, (snapshot) => {
      const status = snapshot.val();
      setIsCheckedIn(status);
    });

    // Load random checkpoint history on mount
    const randomHistory = generateRandomHistory(20);
    setHistory(randomHistory);

    // Animate main content when the component mounts
    gsap.fromTo(
      mainContentRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1 }
    );
  }, []);

  return (
    <div className="app-container">
      <main className="main-content" ref={mainContentRef}>
        <CheckInStatus
          isCheckedIn={isCheckedIn}
          studentName={studentName}
        />
        <CheckpointHistory history={history} />
      </main>
    </div>
  );
}

export default App;
