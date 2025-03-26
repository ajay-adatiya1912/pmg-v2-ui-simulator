const proposeNewMeterValue = (previousMeterValue, connectorDefaultPower) => {
  let newMeterValue = 0;
  if (previousMeterValue === 0) {
    newMeterValue = Math.ceil(connectorDefaultPower) * 1000;
  } else {
    newMeterValue = Math.ceil(previousMeterValue + previousMeterValue * 0.02);
  }
  return newMeterValue;
};

export default proposeNewMeterValue;
