import { useContext } from "react";

export const pmgObj = {
  pmgSettings: {
    pmgId: 135,
    pmgMaxPower: 425000,
    settleTimeParameter: 2,
    powerBlockAllocationSize: 1000,
    thresholdLowOffsetParameter: 10000,
    thresholdHighOffsetParameter: 5000,
    minimumPowerPerConnector: 5000
  },
  connectorsDetails: [
    {
      connectorId: 1,
      chargeStationId: 1,
      CSMaxPower: 120000,
      connectorMaxPower: 120000,
      connectorDefaultPower: 78,
      chargingStartedAt: 1,
      chargingStoppedAt: 18,
      isSaved: true,
    },
    {
      connectorId: 2,
      chargeStationId: 1,
      CSMaxPower: 120000,
      connectorMaxPower: 60000,
      connectorDefaultPower: 0,
      chargingStartedAt: 20,
      chargingStoppedAt: 50,
      isSaved: true,
    },
    {
      connectorId: 3,
      chargeStationId: 2,
      CSMaxPower: 90000,
      connectorMaxPower: 90000,
      connectorDefaultPower: 45,
      chargingStartedAt: 4,
      chargingStoppedAt: 50,
      isSaved: true,
    },
    // {
    //   connectorId: 4,
    //   chargeStationId: 2,
    //   CSMaxPower: 90000,
    //   connectorMaxPower: 60000,
    //   connectorDefaultPower: 46,
    //   chargingStartedAt: 6,
    //   chargingStoppedAt: 98,
    //   isSaved: true,
    // },

    {
      connectorId: 5,
      chargeStationId: 3,
      CSMaxPower: 100000,
      connectorMaxPower: 75000,
      connectorDefaultPower: 25,
      chargingStartedAt: 15,
      chargingStoppedAt: 50,
      isSaved: true,
    },
    // {
    //   connectorId: 6,
    //   chargeStationId: 3,
    //   CSMaxPower: 100000,
    //   connectorMaxPower: 25000,
    //   connectorDefaultPower: 46,
    //   chargingStartedAt: 5,
    //   chargingStoppedAt: 54,
    //   isSaved: true,
    // },
    {
      connectorId: 7,
      chargeStationId: 4,
      CSMaxPower: 320000,
      connectorMaxPower: 160000,
      connectorDefaultPower: 78,
      chargingStartedAt: 4,
      chargingStoppedAt: 50,
      isSaved: true,
    },
    {
      connectorId: 8,
      chargeStationId: 4,
      CSMaxPower: 320000,
      connectorMaxPower: 160000,
      connectorDefaultPower: 78,
      chargingStartedAt: 7,
      chargingStoppedAt: 50,
      isSaved: true,
    }
  ],
};

const saveDefaultPmgObj = () => {
  // Check if pmgObj exists in localStorage
  if (!localStorage.getItem("pmgObj")) {
    // If not, save the default pmgObj
    localStorage.setItem(
      "pmgObj",
      JSON.stringify(pmgObj)
    );
  }
};

export default saveDefaultPmgObj;
