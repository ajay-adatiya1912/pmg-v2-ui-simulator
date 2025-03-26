import proposeNewMeterValue from "./proposeNewMeterValue";

export const getInitialData = () => {
  const savedData = localStorage.getItem("chargingData");
  let previousTotalPower = 0;

  if (localStorage.getItem("previousTotalPower")) {
    previousTotalPower = parseInt(localStorage.getItem("previousTotalPower"));
  }

  if (savedData) {
    return JSON.parse(savedData);
  } else {
    const pmgObj = localStorage.getItem("pmgObj");
    const parsedPmgObj = JSON.parse(pmgObj);

    const filteredConnectors = parsedPmgObj.connectorsDetails.filter(
      (connector) => connector.chargingStartedAt === 1
    );

    return {
      timeStamp: new Date(),
      pmgSettings: parsedPmgObj.pmgSettings,
      connectorList: filteredConnectors.map((connector) => {
        const currentTXvalue =
          parsedPmgObj.pmgSettings.pmgMaxPower - previousTotalPower >
          connector.connectorDefaultPower * 1000
            ? connector.connectorDefaultPower * 1000
            : parsedPmgObj.pmgSettings.pmgMaxPower - previousTotalPower;

        const newMeterValue = proposeNewMeterValue(0, currentTXvalue / 1000);

        return {
          connectorId: connector.connectorId,
          chargeStationId: connector.chargeStationId,
          sessionId: 1,
          CSMaxPower: connector.CSMaxPower,
          connectorMaxPower: connector.connectorMaxPower,
          connectorDefaultPower: connector.connectorDefaultPower,
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
          ocppIdentityKey: `CS_${connector.chargeStationId}`,
          cpo_id: 1,
          currentAllocatedValue: 0,
        };
      }),
    };
  }
};
