import React, { useEffect } from 'react';
import { gsap } from 'gsap';

function CheckpointHistory({ history }) {
  useEffect(() => {
    gsap.from('.history-item', {
      opacity: 0,
      y: 50,
      duration: 0.5,
      stagger: 0.1, // Stagger the animations for each item
      ease: "power2.out"
    });
  }, [history]); // Run this effect every time history changes

  return (
    <div className="card history-card">
      <h3>Checkpoint History</h3>
      <ul className="history-list">
        {history.map((entry, index) => (
          <li key={index} className="history-item">
            <span>{entry.licensePlate} - {entry.name}</span>
            <span className={`status-tag ${entry.status === 'Picked Up' ? 'picked-up' : 'not-picked-up'}`}>
              {entry.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CheckpointHistory;

