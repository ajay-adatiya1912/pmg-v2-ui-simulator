import { getCallCount, incrementCallCount } from "./callCount";
import proposeNewMeterValue from "./proposeNewMeterValue";
import { updateChargingDataHistory } from "./updateChargingDataHistory";

const updateChargingDataFromAPI = (chargingData, data) => {
  const pmgObj = localStorage.getItem("pmgObj");
  const parsedPmgObj = JSON.parse(pmgObj);
  const callCount = getCallCount();
  let previousTotalPower = 0;
  const filteredConnectors = parsedPmgObj.connectorsDetails.filter(
    (connector) => connector.chargingStartedAt === callCount + 1
  );

  const removeConnectors = parsedPmgObj.connectorsDetails.filter(
    (connector) => connector.chargingStoppedAt === callCount + 1
  );

  // Create a copy of the chargingData and update the timestamp
  const updatedChargingData = { ...chargingData };
  updatedChargingData.timeStamp = data.data.timeStamp;

  // Update existing connectors in updatedChargingData
  updatedChargingData.connectorList = updatedChargingData.connectorList.map(
    (connector, i) => {
      let index = data.data.connectorList.findIndex(
        (conn) => conn.connectorId == connector.connectorId
      );

      const powerBlockAllocationSize =
        updatedChargingData.pmgSettings.powerBlockAllocationSize; // from pmgSettings
      const proposedPowerAllocationValue =
        data.data.connectorList[index].proposedPowerAllocationValue;
      const currentAllocatedValue =
        data.data.connectorList[index].currentAllocatedValue;

      previousTotalPower =
        previousTotalPower +
        proposedPowerAllocationValue * powerBlockAllocationSize;

      return {
        ...connector,
        previousMeterReads: [
          {
            date: new Date(),
            value: proposeNewMeterValue(
              proposedPowerAllocationValue * powerBlockAllocationSize,
              connector.connectorDefaultPower
            ),
          },
        ],
        currentTXvalue: proposedPowerAllocationValue * powerBlockAllocationSize,
        metadata: {
          ...connector.metadata,
          settleTime: data.data.connectorList[index].metadata.settleTime,
          highThreshold: data.data.connectorList[index].metadata.highThreshold,
          lowThreshold: data.data.connectorList[index].metadata.lowThreshold,
        },
        currentAllocatedValue: currentAllocatedValue,
      };
    }
  );

  localStorage.setItem("previousTotalPower", previousTotalPower);

  updateChargingDataHistory(chargingData, updatedChargingData);

  removeConnectors.forEach((removeConnector) => {
    updatedChargingData.connectorList =
      updatedChargingData.connectorList.filter(
        (connector) => connector.connectorId !== removeConnector.connectorId
      );
  });

  filteredConnectors.forEach((filteredConnector) => {
    const exists = updatedChargingData.connectorList.some(
      (connector) => connector.connectorId === filteredConnector.connectorId
    );

    if (!exists) {
      console.log(
        "before proposeNewMeterValue",
        filteredConnector,
        parsedPmgObj
      );

      // debugger;
      const currentTXvalue =
        parsedPmgObj.pmgSettings.pmgMaxPower - previousTotalPower >
        filteredConnector.connectorDefaultPower * 1000
          ? filteredConnector.connectorDefaultPower * 1000
          : parsedPmgObj.pmgSettings.pmgMaxPower - previousTotalPower;

      previousTotalPower = previousTotalPower + currentTXvalue;

      const newMeterValue = proposeNewMeterValue(0, currentTXvalue / 1000);

      // Add the missing connector
      updatedChargingData.connectorList.push({
        connectorId: filteredConnector.connectorId,
        chargeStationId: filteredConnector.chargeStationId,
        sessionId: 1,
        CSMaxPower: filteredConnector.CSMaxPower,
        connectorMaxPower: filteredConnector.connectorMaxPower,
        connectorDefaultPower: filteredConnector.connectorDefaultPower,
        currentTXvalue: currentTXvalue,
        metadata: {
          settleTime: parsedPmgObj.pmgSettings.settleTimeParameter,
          lowThreshold: null,
          highThreshold: null,
        },
        previousMeterReads: [
          {
            date: new Date(),
            value: newMeterValue,
          },
        ],
        ocppIdentityKey: `CS_${filteredConnector.chargeStationId}`,
        cpo_id: 1,
        currentAllocatedValue: 0,
      });
    }
  });

  incrementCallCount();

  // Save the updated charging data to localStorage
  localStorage.setItem("chargingData", JSON.stringify(updatedChargingData));

  // Return the updated charging data
  return updatedChargingData;
};

export default updateChargingDataFromAPI;
