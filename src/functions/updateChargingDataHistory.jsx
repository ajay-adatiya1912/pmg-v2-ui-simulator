export const updateChargingDataHistory = (
  chargingData,
  updatedChargingData
) => {
  const existingHistory =
    JSON.parse(localStorage.getItem("chargingDataHistory")) || [];

  const newEntry = {
    input: chargingData,
    output: updatedChargingData,
    timestamp: new Date(),
  };

  existingHistory.push(newEntry);

  localStorage.setItem("chargingDataHistory", JSON.stringify(existingHistory));
};
