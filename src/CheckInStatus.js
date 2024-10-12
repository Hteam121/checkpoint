import React from 'react';

function CheckInStatus({ isCheckedIn, studentName, onToggle }) {
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

      <button onClick={onToggle}>
        {isCheckedIn ? 'Undo Check-In' : 'Simulate Check-In'}
      </button>
    </div>
  );
}

export default CheckInStatus;