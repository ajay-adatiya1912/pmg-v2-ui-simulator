import axios from "axios";
import updateChargingDataFromAPI from "./updateChargingDataFromAPI";

export const callPmgAlgoV2API = async (chargingData) => {
  try {
    const response = await axios.request({
      url: "https://zqt2qkn4z0.execute-api.eu-west-1.amazonaws.com/algo",
      method: "post",
      data: chargingData,
    });
    const updatedChargingData = updateChargingDataFromAPI(
      chargingData,
      response
    );
    return updatedChargingData;
  } catch (error) {
    //console.error("Error fetching updated charging data:", error);
    throw error;
  }
};
