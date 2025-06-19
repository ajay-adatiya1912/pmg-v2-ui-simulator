import axios from "axios";
import updateChargingDataFromAPI from "./updateChargingDataFromAPI";
import { useState } from "react";

export const callPmgAlgoV2API = () => {
  const [data, setData] = useState({});
  const callAPI = async (chargingData) => {
    try {
      const response = await axios.request({
        // url: "https://zqt2qkn4z0.execute-api.eu-west-1.amazonaws.com/algo",
        url: "http://localhost:3000/algo",
        method: "post",
        data: chargingData,
      });
      const updatedChargingData = updateChargingDataFromAPI(
        chargingData,
        response
      );
      // return updatedChargingData;
      setData(updatedChargingData);
    } catch (error) {
      //console.error("Error fetching updated charging data:", error);
      throw error;
    }
  }

  return { data, callAPI };
};
