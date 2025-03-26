import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { ConfigModal } from "./components/configModal";
import RunAlgo from "./components/runAlgorithm";
import saveDefaultPmgObj from "./functions/saveDefaultPmgObj";
import "./App.css";

function App() {
  saveDefaultPmgObj();
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [isAlgoOpen, setIsAlgoOpen] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem("pmgObj")) {
      setIsModelOpen(true);
    } else {
      setIsAlgoOpen(true);
    }
  }, []);

  const modalHandler = () => {
    setIsModelOpen(!isModelOpen);
  };

  useEffect(() => {
    if (localStorage.getItem("pmgObj")) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [isModelOpen]);

  const AlgoHandler = () => {
    if (localStorage.getItem("pmgObj")) {
      setIsAlgoOpen(true);
    }
  };

  const resetAllValues = () => {
    localStorage.removeItem("chargingData");
    localStorage.removeItem("chargingDataHistory");
    localStorage.removeItem("callCount");
    localStorage.removeItem("pmgObj");
    localStorage.removeItem("previousTotalPower");
    window.location.reload();
  };

  return (
    <>
      <ConfigModal open={isModelOpen} setOpen={setIsModelOpen} />
      {isAlgoOpen && (
        <RunAlgo resetValues={resetAllValues} modalHandle={modalHandler} />
      )}
      {!isAlgoOpen && (
        <div>
          <button
            className="runAlgoBtn"
            onClick={AlgoHandler}
            disabled={isDisabled}
            type="button"
          >
            Run Algo
          </button>
          <button className="configBtn" onClick={modalHandler} type="button">
            Configuration
          </button>
          <button className="resetBtn" onClick={resetAllValues} type="button">
            Reset
          </button>
        </div>
      )}
    </>
  );
}

export default App;
