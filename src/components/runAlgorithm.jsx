import React, { useRef, useState, useEffect } from "react";
import { getInitialData } from "../functions/getInitialData";
import { callPmgAlgoV2API } from "../functions/callPmgAlgoV2API";
import Table from "@mui/joy/Table";
import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import { Tooltip, tooltipClasses } from "@mui/material";

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(() => ({
  border: `1px solid rgba(0, 0, 0, 0)`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&::before": {
    display: "none",
  },
}));

const BootstrapTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.black,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.black,
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor: "rgba(0, 0, 0, 0.02)",
  color: "#000",
  borderRadius: "5px",
  border: "1px solid #5A7EB7",
  fontWeight: "bolder",
  flexDirection: "row-reverse",
  "& .MuiTypography-root.MuiTypography-body1": {
    fontWeight: "700",
  },
  "& .MuiAccordionSummary-expandIconWrapper": {
    color: "#000",
  },
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
    color: "#000 !important",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
  ...theme.applyStyles("dark", {
    backgroundColor: "rgba(255, 255, 255, .05)",
  }),
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  paddingTop: 0,
  borderTop: "1px solid rgba(0, 0, 0, 0)",
}));

const RunAlgo = ({ resetValues, modalHandle }) => {
  const [chargingData, setChargingData] = useState(getInitialData);
  const [chargingDataHistory, setChargingDataHistory] = useState(
    JSON.parse(localStorage.getItem("chargingDataHistory"))
  );

  const divRef = useRef();
  const [expanded, setExpanded] = useState("panel0");
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    if (
      chargingData.connectorList.length === 0 ||
      chargingData.connectorList.some((connector) => {
        const previousValue = connector.previousMeterReads[0]?.value;
        return (
          previousValue === null ||
          isNaN(previousValue) ||
          previousValue === undefined
        );
      })
    ) {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  }, [chargingData]);

  const updateMeterReads = (event) => {
    const updatedChargingData = { ...chargingData };
    updatedChargingData.connectorList = updatedChargingData.connectorList.map(
      (connector) => {
        if (parseInt(event.target.id) === connector.connectorId) {
          return {
            ...connector,
            previousMeterReads: [
              {
                ...connector.previousMeterReads[0],
                value: parseInt(event.target.value),
              },
            ],
          };
        }
        return connector;
      }
    );
    const checkIsDisabled = updatedChargingData.connectorList.some(
      (connector) => {
        const previousValue = connector.previousMeterReads[0]?.value;
        return (
          previousValue === null ||
          isNaN(previousValue) ||
          previousValue === undefined
        );
      }
    );

    setIsDisabled(checkIsDisabled);
    setChargingData(updatedChargingData);
    localStorage.setItem("chargingData", JSON.stringify(updatedChargingData));
  };

  const updateConnector = () => {
    // const hasValidMeterReads = chargingData.connectorList.some(
    //   (x) => x.previousMeterReads[0].value !== 0
    // );

    // if (!hasValidMeterReads) {
    //   console.log("No valid meter reads found. Exiting updateConnector.");
    //   setIsDisabled(true);
    //   return;
    // }
    setIsDisabled(true);
    callPmgAlgoV2API(chargingData)
      .then((updatedChargingData) => {
        setChargingData(updatedChargingData);
        setChargingDataHistory(
          JSON.parse(localStorage.getItem("chargingDataHistory"))
        );
        setExpanded(`panel${chargingDataHistory.length - 1}`);
      })
      .catch((error) => {
        // Handle the error as needed
        //console.error("Failed to update charging data:", error);
      });
  };

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  useEffect(() => {
    if (chargingDataHistory) {
      const lastIndex =
        chargingDataHistory.length > 0 ? chargingDataHistory.length - 1 : 0;
      setExpanded(`panel${lastIndex}`);
      if (divRef.current) {
        divRef.current.scrollTop = divRef.current.scrollHeight;
      }
    }
  }, [chargingDataHistory]);

  return (
    <>
      <div className="run-algo container">
        {chargingDataHistory && (
          <div className="accordion-div" ref={divRef}>
            {chargingDataHistory.length > 0 &&
              chargingDataHistory.map((h, i) => {
                return (
                  <Accordion
                    key={i}
                    expanded={expanded === `panel${i}`}
                    onChange={handleChange(`panel${i}`)}
                  >
                    <AccordionSummary
                      aria-controls={`panel${i}d-content`}
                      id={`panel${i}d-header`}
                    >
                      <Typography>Iteration {i + 1}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography
                        sx={{
                          fontSize: "30px",
                          fontWeight: "bold",
                          marginTop: "0.4rem",
                          marginBottom: "0.4rem",
                          color: "#000",
                          // borderTop: "1px solid #000",
                          // borderBottom: "1px solid #000",
                        }}
                      >
                        Input
                      </Typography>
                      <Table aria-label="basic table" className="display-table">
                        <thead className="thead">
                          <tr>
                            <th
                              className="text-center th user-select-none"
                              style={{ borderTopLeftRadius: "10px" }}
                            >
                              <BootstrapTooltip title="ConnectorId">
                                <>ConnectorId</>
                              </BootstrapTooltip>
                            </th>
                            <th className="text-center th user-select-none">
                              <BootstrapTooltip title="ChargeStationId">
                                <>ChargeStationId</>
                              </BootstrapTooltip>
                            </th>
                            <th className="text-center th user-select-none">
                              <BootstrapTooltip title="SettleTime">
                                <>SettleTime</>
                              </BootstrapTooltip>
                            </th>
                            <th className="text-center th user-select-none">
                              <BootstrapTooltip title="LowThreshold">
                                <>LowThreshold</>
                              </BootstrapTooltip>
                            </th>
                            <th className="text-center th user-select-none">
                              <BootstrapTooltip title="HighThreshold">
                                <>HighThreshold</>
                              </BootstrapTooltip>
                            </th>
                            <th className="text-center th user-select-none">
                              <BootstrapTooltip title="CSMaxPower">
                                <>CSMaxPower</>
                              </BootstrapTooltip>
                            </th>
                            <th className="text-center th user-select-none">
                              <BootstrapTooltip title="ConnectorMaxPower">
                                <>ConnectorMaxPower</>
                              </BootstrapTooltip>
                            </th>
                            <th className="text-center th user-select-none">
                              <BootstrapTooltip title="ConnectorDefaultPower">
                                <>ConnectorDefaultPower</>
                              </BootstrapTooltip>
                            </th>
                            <th className="text-center th user-select-none">
                              <BootstrapTooltip title="PreviousMeterReads">
                                <>PreviousMeterReads</>
                              </BootstrapTooltip>
                            </th>
                            <th
                              className="text-center th user-select-none"
                              style={{ borderTopRightRadius: "10px" }}
                            >
                              <BootstrapTooltip title="CurrentTXvalue">
                                <>CurrentTXvalue</>
                              </BootstrapTooltip>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {h.input &&
                            h.input.connectorList.map((d, indexI) => (
                              <tr key={indexI}>
                                <td>{d.connectorId}</td>
                                <td>{d.chargeStationId}</td>
                                <td>{d.metadata.settleTime}</td>
                                <td>
                                  {d.metadata.lowThreshold !== null
                                    ? d.metadata.lowThreshold
                                    : "-"}
                                </td>
                                <td>
                                  {d.metadata.highThreshold !== null
                                    ? d.metadata.highThreshold
                                    : "-"}
                                </td>
                                <td>{d.CSMaxPower}</td>
                                <td>{d.connectorMaxPower}</td>
                                <td>{d.connectorDefaultPower}</td>
                                <td>{d.previousMeterReads[0].value}</td>
                                <td>{d.currentTXvalue}</td>
                              </tr>
                            ))}
                        </tbody>
                      </Table>
                      <Typography
                        sx={{
                          fontSize: "30px",
                          fontWeight: "bold",
                          marginTop: "0.4rem",
                          marginBottom: "0.4rem",
                          color: "#000",
                          // borderTop: "1px solid #000",
                          // borderBottom: "1px solid #000",
                        }}
                      >
                        Output
                      </Typography>
                      <Table aria-label="basic table" className="display-table">
                        <thead className="thead">
                          <tr>
                            <th
                              className="text-center th user-select-none"
                              style={{ borderTopLeftRadius: "10px" }}
                            >
                              <BootstrapTooltip title="ConnectorId">
                                <>ConnectorId</>
                              </BootstrapTooltip>
                            </th>
                            <th className="text-center th user-select-none">
                              <BootstrapTooltip title="ChargeStationId">
                                <>ChargeStationId</>
                              </BootstrapTooltip>
                            </th>
                            <th className="text-center th user-select-none">
                              <BootstrapTooltip title="SettleTime">
                                <>SettleTime</>
                              </BootstrapTooltip>
                            </th>
                            <th className="text-center th user-select-none">
                              <BootstrapTooltip title="LowThreshold">
                                <>LowThreshold</>
                              </BootstrapTooltip>
                            </th>
                            <th className="text-center th user-select-none">
                              <BootstrapTooltip title="HighThreshold">
                                <>HighThreshold</>
                              </BootstrapTooltip>
                            </th>
                            <th
                              className="text-center th user-select-none"
                              colSpan={"2"}
                            >
                              <BootstrapTooltip title="ProposedPowerAllocationValue">
                                <>ProposedPowerAllocationValue</>
                              </BootstrapTooltip>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {h.output &&
                            h.output.connectorList.map((d, indexI) => (
                              <tr key={d.connectorId}>
                                <td>{d.connectorId}</td>
                                <td>{d.chargeStationId}</td>
                                <td>{d.metadata.settleTime}</td>
                                <td>
                                  {d.metadata.lowThreshold !== null
                                    ? d.metadata.lowThreshold
                                    : "-"}
                                </td>
                                <td>
                                  {d.metadata.highThreshold !== null
                                    ? d.metadata.highThreshold
                                    : "-"}
                                </td>
                                <td colSpan={"2"}>{d.currentTXvalue}</td>
                              </tr>
                            ))}
                        </tbody>
                      </Table>
                    </AccordionDetails>
                  </Accordion>
                );
              })}
          </div>
        )}

        <div className="seperator mt-5 mb-2"></div>

        <Table aria-label="basic table" className="display-table">
          <thead className="thead">
            <tr>
              <th
                className="text-center th user-select-none"
                style={{ borderTopLeftRadius: "10px" }}
              >
                <BootstrapTooltip title="ConnectorId">
                  <>ConnectorId</>
                </BootstrapTooltip>
              </th>
              <th className="text-center th user-select-none">
                <BootstrapTooltip title="ChargeStationId">
                  <>ChargeStationId</>
                </BootstrapTooltip>
              </th>
              <th className="text-center th user-select-none">
                <BootstrapTooltip title="SettleTime">
                  <>SettleTime</>
                </BootstrapTooltip>
              </th>
              <th className="text-center th user-select-none">
                <BootstrapTooltip title="LowThreshold">
                  <>LowThreshold</>
                </BootstrapTooltip>
              </th>
              <th className="text-center th user-select-none">
                <BootstrapTooltip title="HighThreshold">
                  <>HighThreshold</>
                </BootstrapTooltip>
              </th>
              <th className="text-center th user-select-none">
                <BootstrapTooltip title="CSMaxPower">
                  <>CSMaxPower</>
                </BootstrapTooltip>
              </th>
              <th className="text-center th user-select-none">
                <BootstrapTooltip title="ConnectorMaxPower">
                  <>ConnectorMaxPower</>
                </BootstrapTooltip>
              </th>
              <th className="text-center th user-select-none">
                <BootstrapTooltip title="ConnectorDefaultPower">
                  <>ConnectorDefaultPower</>
                </BootstrapTooltip>
              </th>
              <th className="text-center th user-select-none">
                <BootstrapTooltip title="PreviousMeterReads">
                  <>PreviousMeterReads</>
                </BootstrapTooltip>
              </th>
              <th
                className="text-center th user-select-none"
                style={{ borderTopRightRadius: "10px" }}
              >
                <BootstrapTooltip title="CurrentTXvalue">
                  <>CurrentTXvalue</>
                </BootstrapTooltip>
              </th>
            </tr>
          </thead>
          <tbody>
            {chargingData.connectorList.map((connector) => (
              <tr key={connector.connectorId}>
                <td>{connector.connectorId}</td>
                <td>{connector.chargeStationId}</td>
                <td>{connector.metadata.settleTime}</td>
                <td>
                  {connector.metadata.lowThreshold !== null
                    ? connector.metadata.lowThreshold
                    : "-"}
                </td>
                <td>
                  {connector.metadata.highThreshold !== null
                    ? connector.metadata.highThreshold
                    : "-"}
                </td>
                <td>{connector.CSMaxPower}</td>
                <td>{connector.connectorMaxPower}</td>
                <td>{connector.connectorDefaultPower}</td>
                <td>
                  <div>
                    <input
                      type="number"
                      className="form-control "
                      id={connector?.connectorId}
                      value={connector?.previousMeterReads[0].value}
                      onChange={updateMeterReads}
                      required
                    />
                  </div>
                </td>
                <td>{connector.currentTXvalue}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        <div>
          <button
            className="runAlgoBtn"
            onClick={updateConnector}
            disabled={isDisabled}
            type="button"
          >
            Run Algo
          </button>
          <button
            className="configBtn"
            onClick={() => {
              modalHandle();
            }}
            type="button"
          >
            Configuration
          </button>
          <button
            className="resetBtn"
            onClick={() => {
              resetValues();
            }}
            type="button"
          >
            Reset
          </button>
        </div>
      </div>
    </>
  );
};

export default RunAlgo;
