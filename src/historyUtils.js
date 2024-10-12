const names = [
  'John Doe', 'Jane Smith', 'Chris Johnson', 'Pat Taylor', 
  'Alex Lee', 'Sam Green', 'Kelly Brown', 'Jordan White', 
  'Taylor Black', 'Morgan Fox', 'Bailey Young', 'Casey Hill', 
  'Drew Reed', 'Hunter Stone', 'Jesse Ford', 'Skyler Woods', 
  'Reese King', 'Quinn Adams', 'Rowan Clarke', 'Blake Knight'
];

const statuses = ['Picked Up', 'Not Picked Up'];

// Generate a unique license plate (AAA-1234)
function generateUniquePlate(existingPlates) {
  let plate;
  do {
    const letters = String.fromCharCode(
      65 + Math.floor(Math.random() * 26),
      65 + Math.floor(Math.random() * 26),
      65 + Math.floor(Math.random() * 26)
    );
    const numbers = Math.floor(1000 + Math.random() * 9000);
    plate = `${letters}-${numbers}`;
  } while (existingPlates.has(plate)); // Ensure the plate is unique

  existingPlates.add(plate); // Track generated plates
  return plate;
}

// Generate a unique checkpoint history
export function generateRandomHistory(count) {
  const existingPlates = new Set(); // Track unique license plates
  const history = [];

  // Shuffle names to ensure unique assignments
  const shuffledNames = [...names].sort(() => Math.random() - 0.5);

  for (let i = 0; i < count; i++) {
    const name = shuffledNames[i % shuffledNames.length];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const licensePlate = generateUniquePlate(existingPlates);

    history.push({
      licensePlate,
      name,
      status,
    });
  }
  return history;
}

