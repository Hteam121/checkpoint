import React from 'react';

function CheckpointHistory({ history }) {
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
