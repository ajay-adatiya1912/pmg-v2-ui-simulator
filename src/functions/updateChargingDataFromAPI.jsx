import { useContext } from "react";
import { getCallCount, incrementCallCount } from "./callCount";
import proposeNewMeterValue from "./proposeNewMeterValue";
import { updateChargingDataHistory } from "./updateChargingDataHistory";
import { PmgPowerValuesContext } from "../context/PmgAlgoContext";

const updateChargingDataFromAPI = (chargingData, data) => {
  debugger;
  const pmgPowerValuesContext = useContext(PmgPowerValuesContext);
  const pmgObj = localStorage.getItem("pmgObj");
  const parsedPmgObj = JSON.parse(pmgObj);
  const callCount = getCallCount();
  let previousTotalPower = 0;
  const { minimumPowerPerConnector, connectorsDetails, pmgSettings } = parsedPmgObj;
  const filteredConnectors = connectorsDetails.filter(
    (connector) => connector.chargingStartedAt === callCount + 1
  );

  const removeConnectors = connectorsDetails.filter(
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
        }
      };
    }
  );

  localStorage.setItem("previousTotalPower", previousTotalPower);
  pmgPowerValuesContext.updateAvailablePower(pmgPowerValuesContext.totalPower - previousTotalPower);

  updateChargingDataHistory(chargingData, updatedChargingData);

  removeConnectors.forEach((removeConnector) => {
    updatedChargingData.connectorList =
      updatedChargingData.connectorList.filter(
        (connector) => connector.connectorId !== removeConnector.connectorId
      );
  });

  filteredConnectors.forEach((filteredConnector) => {
    const { 
      connectorDefaultPower,
      connectorId,
      chargeStationId,
      CSMaxPower,
      connectorMaxPower 
    } = filteredConnector;

    const exists = updatedChargingData.connectorList.some(
      (connector) => connector.connectorId === connectorId
    );

    if (!exists) {
      // console.log(
      //   "before proposeNewMeterValue",
      //   filteredConnector,
      //   parsedPmgObj
      // );
      // debugger;
      let currentTXvalue =
        pmgSettings.pmgMaxPower - previousTotalPower >
        connectorDefaultPower * 1000
          ? connectorDefaultPower * 1000
          : pmgSettings.pmgMaxPower - previousTotalPower;
        
      currentTXvalue = currentTXvalue < minimumPowerPerConnector ? 0 : currentTXvalue;

      previousTotalPower = previousTotalPower + currentTXvalue;

      const newMeterValue = proposeNewMeterValue(0, currentTXvalue / 1000);

      // Add the missing connector
      updatedChargingData.connectorList.push({
        connectorId: connectorId,
        chargeStationId: chargeStationId,
        sessionId: 1,
        CSMaxPower: CSMaxPower,
        connectorMaxPower: connectorMaxPower,
        connectorDefaultPower: connectorDefaultPower,
        currentTXvalue,
        metadata: {
          settleTime: pmgSettings.settleTimeParameter,
          lowThreshold: null,
          highThreshold: null,
        },
        previousMeterReads: [
          {
            date: new Date(),
            value: newMeterValue,
          },
        ]
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
