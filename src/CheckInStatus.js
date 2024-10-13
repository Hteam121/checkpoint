// CheckInStatus.js
import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database'; // No need for `set` anymore
import { database } from './firebase'; // Import the Firebase config

function CheckInStatus({ studentName }) {
  const [isCheckedIn, setIsCheckedIn] = useState(false); // State to hold the check-in status

  useEffect(() => {
    // Reference to the 'detection_status' node in Firebase
    const statusRef = ref(database, 'detection_status');

    // Subscribe to changes in the 'detection_status' value
    const unsubscribe = onValue(statusRef, (snapshot) => {
      const status = snapshot.val();
      setIsCheckedIn(status); // Update the UI based on the Firebase value
    });

    // Clean up the subscription when the component unmounts
    return () => unsubscribe();
  }, []);

  return (
    <div
      className={`card checkin-card ${
        isCheckedIn ? 'picked-up' : 'not-picked-up'
      }`}
    >
      <h3>Check-In Status</h3>

      <p className="status">
        {isCheckedIn
          ? `${studentName} is Picked Up`
          : `${studentName} is Not Picked Up`}
      </p>
    </div>
  );
}

export default CheckInStatus;
