import { Modal, TextField } from "@mui/material";
import { FieldArray, Formik } from "formik";
import * as Yup from "yup";
import { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import { Alert } from "@mui/material";
import { getInitialData } from "../functions/getInitialData";
import RunAlgo from "./runAlgorithm";

const style = {
  position: "absolute",
  outline: "none",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  maxWidth: 1000,
  bgcolor: "background.paper",
  border: "1px solid #000",
  borderRadius: "20px",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

const getConnectorsTextFieldStyles = () => ({
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "#c9c9c9 !important",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "#c9c9c9 !important",
  },
  "& .MuiInputBase-input.Mui-disabled": {
    color: "#000",
    backgroundColor: "#f7f7f7 !important",
  },
  "& .MuiInputBase-input.MuiOutlinedInput-input": {
    WebkitTextFillColor: "#000 !important",
    color: "#000",
  },
  "& .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(0, 0, 0, 0.26) !important",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#000 !important",
  },
  "& .MuiInputLabel-root": {
    color: "#000 !important",
  },
  "& .MuiInputLabel-root.Mui-disabled": {
    color: "#000 !important",
  },
});

const getPmgSettingsTextFieldStyles = () => ({
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "#c9c9c9 !important",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "#c9c9c9 !important",
  },
  "& .MuiInputBase-input.Mui-disabled": {
    color: "#000",
    backgroundColor: "#f7f7f7 !important",
  },
  "& .MuiInputBase-input.MuiOutlinedInput-input": {
    WebkitTextFillColor: "#000 !important",
    color: "#000",
  },
  "& .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(0, 0, 0, 0.26) !important",
  },
  "& .MuiInputBase-input.MuiOutlinedInput-input.Mui-disabled": {
    WebkitTextFillColor: "#000 !important",
    color: "#000",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#000 !important",
  },
  "& .MuiInputLabel-root": {
    color: "#000 !important",
  },
  "& .MuiInputLabel-root.Mui-disabled": {
    color: "#000 !important",
  },
});

export const ConfigModal = ({ open, setOpen }) => {
  const historyCheck = localStorage.getItem("chargingDataHistory")
    ? true
    : false;

  var initialValues = {
    pmgId: parseInt(""),
    pmgMaxPower: parseInt(""),
    settleTimeParameter: parseInt(""),
    powerBlockAllocationSize: parseInt(""),
    thresholdLowOffsetParameter: parseInt(""),
    thresholdHighOffsetParameter: parseInt(""),
    connectorsDetails: [
      {
        CSMaxPower: parseInt(""),
        connectorId: parseInt(""),
        connectorMaxPower: parseInt(""),
        connectorDefaultPower: parseInt(""),
        chargingStartedAt: parseInt(""),
        chargingStoppedAt: parseInt(""),
        chargeStationId: parseInt(""),
        isSaved: false,
      },
    ],
  };
  const [initialValuesObj, setInitialValuesObj] = useState(initialValues);
  const divRef = useRef();
  const handleSubmit = (values) => {
    setOpen(false);
    const pmgSettings = {
      pmgId: parseInt(values.pmgId),
      pmgMaxPower: parseInt(values.pmgMaxPower),
      settleTimeParameter: parseInt(values.settleTimeParameter),
      powerBlockAllocationSize: parseInt(values.powerBlockAllocationSize),
      thresholdLowOffsetParameter: parseInt(values.thresholdLowOffsetParameter),
      thresholdHighOffsetParameter: parseInt(
        values.thresholdHighOffsetParameter
      ),
    };
    // debugger;
    const connectorsDetails = values.connectorsDetails;
    const pmgObj = {
      pmgSettings,
      connectorsDetails,
    };
    localStorage.setItem("pmgObj", JSON.stringify(pmgObj));
    window.location.reload();
  };

  useEffect(() => {
    var pmgObj = JSON.parse(localStorage.getItem("pmgObj"));

    if (pmgObj) {
      setInitialValuesObj({
        pmgId: pmgObj.pmgSettings.pmgId || "",
        pmgMaxPower: pmgObj.pmgSettings.pmgMaxPower || "",
        settleTimeParameter: pmgObj.pmgSettings.settleTimeParameter || "",
        powerBlockAllocationSize:
          pmgObj.pmgSettings.powerBlockAllocationSize || "",
        thresholdLowOffsetParameter:
          pmgObj.pmgSettings.thresholdLowOffsetParameter || "",
        thresholdHighOffsetParameter:
          pmgObj.pmgSettings.thresholdHighOffsetParameter || "",
        connectorsDetails: pmgObj.connectorsDetails || [],
      });
    }
  }, [open]);

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style, width: 1000 }}>
          <Formik
            enableReinitialize
            initialValues={initialValuesObj}
            onSubmit={handleSubmit}
            validationSchema={Yup.object({
              pmgMaxPower: Yup.number()
                .typeError("PMGMaxPower must be a number")
                .required("PMGMaxPower is Required"),
              settleTimeParameter: Yup.number()
                .typeError("SettleTimeParameter must be a number")
                .required("SettleTimeParameter is Required"),
              powerBlockAllocationSize: Yup.number()
                .typeError("PowerBlockAllocationSize must be a number")
                .required("PowerBlockAllocationSize is Required"),
              thresholdLowOffsetParameter: Yup.number()
                .typeError("ThresholdLowOffsetParameter must be a number")
                .required("ThresholdLowOffsetParameter is Required"),
              thresholdHighOffsetParameter: Yup.number()
                .typeError("ThresholdHighOffsetParameter must be a number")
                .required("ThresholdHighOffsetParameter is Required"),
              connectorsDetails: Yup.array().of(
                Yup.object().shape({
                  CSMaxPower: Yup.number()
                    .typeError("CSMaxPower must be a number")
                    .required("CSMaxPower is Required"),
                  connectorId: Yup.number()
                    .typeError("ConnectorId must be a number")
                    .required("ConnectorId is  Required"),
                  connectorMaxPower: Yup.number()
                    .typeError("ConnectorMaxPower must be a number")
                    .required("ConnectorMaxPower is Required"),
                  connectorDefaultPower: Yup.number()
                    .typeError("ConnectorDefaultPower must be a number")
                    .required("ConnectorDefaultPower is Required"),
                  chargingStartedAt: Yup.number()
                    .typeError("ChargingStartedAt must be a number")
                    .min(1, "Minimum Value should be 1")
                    .required("ChargingStartedAt is Required"),
                  chargingStoppedAt: Yup.number()
                    .typeError("ChargingStoppedAt must be a number")
                    .min(1, "Minimum Value should be 1")
                    .when("chargingStartedAt", (chargingStartedAt) => {
                      if (chargingStartedAt) {
                        return Yup.number()
                          .min(
                            parseInt(chargingStartedAt) + 1,
                            "ChargingStoppedAt must be greater than chargingStartedAt"
                          )
                          .typeError("ChargingStoppedAt must be a number")
                          .required("ChargingStoppedAt is Required");
                      }
                    })
                    .required("ChargingStoppedAt is Required"),
                  chargeStationId: Yup.number()
                    .typeError("ChargeStationId must be a number")
                    .required("ChargeStationId is Required"),
                })
              ),
            })}
          >
            {({ handleSubmit, setFieldValue, values, errors, touched }) => {
              return (
                <form onSubmit={handleSubmit}>
                  <h5
                    style={{
                      backgroundColor: "#f4f4f4",
                      color: "#000",
                      borderRadius: "5px",
                      padding: "0.8rem",
                      marginBottom: "0.5rem",
                      verticalAlign: "middle",
                    }}
                  >
                    PMG Settings
                  </h5>
                  <div
                    className="row p-3 mb-3"
                    style={{
                      borderRadius: "5px",
                      border: "1px solid #c9c9c9",
                      margin: "0",
                    }}
                  >
                    <div className="col-md-4 col-sm-6 col-12 p-1 mb-2 d-flex justify-content-center align-items-start">
                      <div className="w-100">
                        <TextField
                          id="outlined-basic"
                          name="pmgMaxPower"
                          label="PMGMaxPower"
                          variant="outlined"
                          type="number"
                          size="small"
                          fullWidth
                          disabled={historyCheck}
                          sx={getPmgSettingsTextFieldStyles()}
                          onChange={(value) => {
                            setFieldValue("pmgMaxPower", value.target.value);
                          }}
                          value={values?.pmgMaxPower}
                        />
                        {errors.pmgMaxPower ? (
                          <div style={{ color: "red" }}>
                            {errors.pmgMaxPower}
                          </div>
                        ) : null}
                      </div>
                    </div>
                    <div className="col-md-4 col-sm-6 col-12 p-1 mb-2 d-flex justify-content-center align-items-start">
                      <div className="w-100">
                        <TextField
                          id="outlined-basic"
                          label="SettleTimeParameter"
                          variant="outlined"
                          name="settleTimeParameter"
                          type="number"
                          size="small"
                          fullWidth
                          disabled={historyCheck}
                          sx={getPmgSettingsTextFieldStyles()}
                          onChange={(value) => {
                            setFieldValue(
                              "settleTimeParameter",
                              value.target.value
                            );
                          }}
                          value={values?.settleTimeParameter}
                        />
                        {errors.settleTimeParameter ? (
                          <div style={{ color: "red" }}>
                            {errors.settleTimeParameter}
                          </div>
                        ) : null}
                      </div>
                    </div>
                    <div className="col-md-4 col-sm-6 col-12 p-1 mb-2 d-flex justify-content-center align-items-start">
                      <div className="w-100">
                        <TextField
                          id="outlined-basic"
                          label="PowerBlockAllocationSize"
                          variant="outlined"
                          name="powerBlockAllocationSize"
                          type="number"
                          size="small"
                          fullWidth
                          disabled={historyCheck}
                          sx={getPmgSettingsTextFieldStyles()}
                          onChange={(value) => {
                            setFieldValue(
                              "powerBlockAllocationSize",
                              value.target.value
                            );
                          }}
                          value={parseInt(values?.powerBlockAllocationSize)}
                        />
                        {errors.powerBlockAllocationSize ? (
                          <div style={{ color: "red" }}>
                            {errors.powerBlockAllocationSize}
                          </div>
                        ) : null}
                      </div>
                    </div>
                    <div className="col-md-4 col-sm-6 col-12 p-1 mb-2 d-flex justify-content-center align-items-start">
                      <div className="w-100">
                        <TextField
                          id="outlined-basic"
                          label="ThresholdLowOffsetParameter"
                          variant="outlined"
                          name="thresholdLowOffsetParameter"
                          type="number"
                          size="small"
                          fullWidth
                          disabled={historyCheck}
                          sx={getPmgSettingsTextFieldStyles()}
                          onChange={(value) => {
                            setFieldValue(
                              "thresholdLowOffsetParameter",
                              value.target.value
                            );
                          }}
                          value={parseInt(values?.thresholdLowOffsetParameter)}
                        />
                        {errors.thresholdLowOffsetParameter ? (
                          <div style={{ color: "red" }}>
                            {errors.thresholdLowOffsetParameter}
                          </div>
                        ) : null}
                      </div>
                    </div>
                    <div className="col-md-4 col-sm-6 col-12 p-1 mb-2 d-flex justify-content-center align-items-start">
                      <div className="w-100">
                        <TextField
                          id="outlined-basic"
                          label="ThresholdHighOffsetParameter"
                          variant="outlined"
                          type="number"
                          name="thresholdHighOffsetParameter"
                          size="small"
                          fullWidth
                          disabled={historyCheck}
                          sx={getPmgSettingsTextFieldStyles()}
                          onChange={(value) => {
                            setFieldValue(
                              "thresholdHighOffsetParameter",
                              value.target.value
                            );
                          }}
                          value={parseInt(values?.thresholdHighOffsetParameter)}
                        />
                        {errors.thresholdHighOffsetParameter ? (
                          <div style={{ color: "red" }}>
                            {errors.thresholdHighOffsetParameter}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <h5
                    style={{
                      backgroundColor: "#f4f4f4",
                      color: "#000",
                      borderRadius: "5px",
                      padding: "0.8rem",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Connector Details
                  </h5>
                  <FieldArray
                    name="connectorsDetails"
                    render={(arrayHelpers) => (
                      <>
                        <div
                          ref={divRef}
                          style={{
                            height: "300px",
                            overflowY: "auto", // Use "auto" to allow scrolling only when necessary
                            padding: "10px",
                            border: "1px solid #c9c9c9",
                            borderRadius: "5px",
                            display: "flex",
                            flexDirection: "column",
                            rowGap: "1rem",
                            boxSizing: "border-box", // Ensure padding is included in height
                            alignItems: "stretch", // Ensures items stretch to fit the width
                          }}
                        >
                          {values.connectorsDetails &&
                            values.connectorsDetails.length > 0 &&
                            values.connectorsDetails.map((connector, index) => {
                              return (
                                <div
                                  key={index}
                                  className="row p-3"
                                  style={{
                                    border: "1px solid #c9c9c9",
                                    borderRadius: "5px",
                                    margin: "0.1rem",
                                  }}
                                >
                                  <div className="col-md-3 col-sm-6 col-12 p-1 mb-2 d-flex justify-content-center align-items-start">
                                    <div className="w-100">
                                      <TextField
                                        required={true}
                                        id="outlined-basic"
                                        label="ConnectorId"
                                        variant="outlined"
                                        type="number"
                                        size="small"
                                        fullWidth
                                        disabled={historyCheck}
                                        sx={getConnectorsTextFieldStyles()}
                                        name={`connectorsDetails[${index}].connectorId`}
                                        onChange={(value) => {
                                          setFieldValue(
                                            `connectorsDetails[${index}].connectorId`,
                                            isNaN(value.target.valueAsNumber)
                                              ? null
                                              : value.target.valueAsNumber
                                          );
                                        }}
                                        value={parseInt(connector?.connectorId)}
                                      />
                                      {errors.connectorsDetails &&
                                      errors.connectorsDetails[index] &&
                                      errors.connectorsDetails[index]
                                        .connectorId ? (
                                        <div style={{ color: "red" }}>
                                          {
                                            errors.connectorsDetails[index]
                                              .connectorId
                                          }
                                        </div>
                                      ) : null}
                                    </div>
                                  </div>
                                  <div className="col-md-3 col-sm-6 col-12 p-1 mb-2 d-flex justify-content-center align-items-start">
                                    <div className="w-100">
                                      <TextField
                                        required={true}
                                        id="outlined-basic"
                                        label="CSMaxPower (Wh)"
                                        variant="outlined"
                                        type="number"
                                        size="small"
                                        fullWidth
                                        disabled={historyCheck}
                                        sx={getConnectorsTextFieldStyles()}
                                        name={`connectorsDetails[${index}].CSMaxPower`}
                                        onChange={(value) => {
                                          setFieldValue(
                                            `connectorsDetails[${index}].CSMaxPower`,
                                            isNaN(value.target.valueAsNumber)
                                              ? null
                                              : value.target.valueAsNumber
                                          );
                                        }}
                                        value={parseInt(connector?.CSMaxPower)}
                                      />
                                      {errors.connectorsDetails &&
                                      errors.connectorsDetails[index] &&
                                      errors.connectorsDetails[index]
                                        .CSMaxPower ? (
                                        <div style={{ color: "red" }}>
                                          {
                                            errors.connectorsDetails[index]
                                              .CSMaxPower
                                          }
                                        </div>
                                      ) : null}
                                    </div>
                                  </div>
                                  <div className="col-md-3 col-sm-6 col-12 p-1 mb-2 d-flex justify-content-center align-items-start">
                                    <div className="w-100">
                                      <TextField
                                        required={true}
                                        id="outlined-basic"
                                        label="ConnectorMaxPower (Wh)"
                                        variant="outlined"
                                        type="number"
                                        size="small"
                                        fullWidth
                                        disabled={historyCheck}
                                        sx={getConnectorsTextFieldStyles()}
                                        name={`connectorsDetails[${index}].connectorMaxPower`}
                                        onChange={(value) => {
                                          setFieldValue(
                                            `connectorsDetails[${index}].connectorMaxPower`,
                                            isNaN(value.target.valueAsNumber)
                                              ? null
                                              : value.target.valueAsNumber
                                          );
                                        }}
                                        value={parseInt(
                                          connector?.connectorMaxPower
                                        )}
                                      />
                                      {errors.connectorsDetails &&
                                      errors.connectorsDetails[index] &&
                                      errors.connectorsDetails[index]
                                        .connectorMaxPower ? (
                                        <div style={{ color: "red" }}>
                                          {
                                            errors.connectorsDetails[index]
                                              .connectorMaxPower
                                          }
                                        </div>
                                      ) : null}
                                    </div>
                                  </div>
                                  <div className="col-md-3 col-sm-6 col-12 p-1 mb-2 d-flex justify-content-center align-items-start">
                                    <div className="w-100">
                                      <TextField
                                        required={true}
                                        id="outlined-basic"
                                        label="ConnectorDefaultPower (kWh)"
                                        variant="outlined"
                                        type="number"
                                        size="small"
                                        fullWidth
                                        disabled={historyCheck}
                                        sx={getConnectorsTextFieldStyles()}
                                        name={`connectorsDetails[${index}].connectorDefaultPower`}
                                        onChange={(value) => {
                                          setFieldValue(
                                            `connectorsDetails[${index}].connectorDefaultPower`,
                                            isNaN(value.target.valueAsNumber)
                                              ? null
                                              : value.target.valueAsNumber
                                          );
                                        }}
                                        value={parseInt(
                                          connector?.connectorDefaultPower
                                        )}
                                      />
                                      {errors.connectorsDetails &&
                                      errors.connectorsDetails[index] &&
                                      errors.connectorsDetails[index]
                                        .connectorDefaultPower ? (
                                        <div style={{ color: "red" }}>
                                          {
                                            errors.connectorsDetails[index]
                                              .connectorDefaultPower
                                          }
                                        </div>
                                      ) : null}
                                    </div>
                                  </div>
                                  <div className="col-md-3 col-sm-6 col-12 p-1 mb-2 d-flex justify-content-center align-items-start">
                                    <div className="w-100">
                                      <TextField
                                        required={true}
                                        id="outlined-basic"
                                        label="ChargingStartedAt"
                                        variant="outlined"
                                        type="number"
                                        size="small"
                                        fullWidth
                                        disabled={historyCheck}
                                        sx={getConnectorsTextFieldStyles()}
                                        name={`connectorsDetails[${index}].chargingStartedAt`}
                                        onChange={(value) => {
                                          setFieldValue(
                                            `connectorsDetails[${index}].chargingStartedAt`,
                                            isNaN(value.target.valueAsNumber)
                                              ? null
                                              : value.target.valueAsNumber
                                          );
                                        }}
                                        value={parseInt(
                                          connector?.chargingStartedAt
                                        )}
                                      />
                                      {errors.connectorsDetails &&
                                      errors.connectorsDetails[index] &&
                                      errors.connectorsDetails[index]
                                        .chargingStartedAt ? (
                                        <div style={{ color: "red" }}>
                                          {
                                            errors.connectorsDetails[index]
                                              .chargingStartedAt
                                          }
                                        </div>
                                      ) : null}
                                    </div>
                                  </div>
                                  <div className="col-md-3 col-sm-6 col-12 p-1 mb-2 d-flex justify-content-center align-items-start">
                                    <div className="w-100">
                                      <TextField
                                        required={true}
                                        id="outlined-basic"
                                        label="ChargingStoppedAt"
                                        variant="outlined"
                                        type="number"
                                        size="small"
                                        fullWidth
                                        disabled={historyCheck}
                                        sx={getConnectorsTextFieldStyles()}
                                        name={`connectorsDetails[${index}].chargingStoppedAt`}
                                        onChange={(value) => {
                                          setFieldValue(
                                            `connectorsDetails[${index}].chargingStoppedAt`,
                                            isNaN(value.target.valueAsNumber)
                                              ? null
                                              : value.target.valueAsNumber
                                          );
                                        }}
                                        value={parseInt(
                                          connector?.chargingStoppedAt
                                        )}
                                      />
                                      {errors.connectorsDetails &&
                                      errors.connectorsDetails[index] &&
                                      errors.connectorsDetails[index]
                                        .chargingStoppedAt ? (
                                        <div style={{ color: "red" }}>
                                          {
                                            errors.connectorsDetails[index]
                                              .chargingStoppedAt
                                          }
                                        </div>
                                      ) : null}
                                    </div>
                                  </div>
                                  <div className="col-md-3 col-sm-6 col-12 p-1 mb-2 d-flex justify-content-center align-items-start">
                                    <div className="w-100">
                                      <TextField
                                        required={true}
                                        id="outlined-basic"
                                        label="ChargeStationId"
                                        variant="outlined"
                                        type="number"
                                        size="small"
                                        fullWidth
                                        disabled={historyCheck}
                                        sx={getConnectorsTextFieldStyles()}
                                        name={`connectorsDetails[${index}].chargeStationId`}
                                        onChange={(value) => {
                                          setFieldValue(
                                            `connectorsDetails[${index}].chargeStationId`,
                                            isNaN(value.target.valueAsNumber)
                                              ? null
                                              : value.target.valueAsNumber
                                          );
                                        }}
                                        value={parseInt(
                                          connector?.chargeStationId
                                        )}
                                      />
                                      {errors.connectorsDetails &&
                                      errors.connectorsDetails[index] &&
                                      errors.connectorsDetails[index]
                                        .chargeStationId ? (
                                        <div style={{ color: "red" }}>
                                          {
                                            errors.connectorsDetails[index]
                                              .chargeStationId
                                          }
                                        </div>
                                      ) : null}
                                    </div>
                                  </div>
                                  <div className="col-md-3 p-1 d-flex justify-content-start column-gap-2 mb-2 connector-action-form">
                                    {connector && !connector.isSaved && (
                                      <button
                                        type="button"
                                        className="btn d-flex justify-content-center align-items-center"
                                        style={{
                                          border: "1px solid #000",
                                          height: "40px",
                                        }}
                                        disabled={
                                          values.connectorsDetails[index]
                                            .isSaved !== false ||
                                          (errors.connectorsDetails &&
                                            errors.connectorsDetails[index]) ||
                                          values.connectorsDetails[index]
                                            .connectorId === 0
                                        }
                                        onClick={() =>
                                          setFieldValue(
                                            `connectorsDetails[${index}].isSaved`,
                                            !connector.isSaved
                                          )
                                        }
                                      >
                                        <SaveIcon style={{ color: "#000" }} />
                                      </button>
                                    )}
                                    {!historyCheck && (
                                      <button
                                        type="button"
                                        className="btn d-flex justify-content-center align-items-center"
                                        style={{
                                          border: "1px solid #000",
                                          height: "40px",
                                        }}
                                        disabled={
                                          values.connectorsDetails.length === 1
                                        }
                                        onClick={() => {
                                          if (
                                            values.connectorsDetails.length > 1
                                          ) {
                                            arrayHelpers.remove(index);
                                          }
                                        }}
                                      >
                                        <DeleteIcon style={{ color: "#000" }} />
                                      </button>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                        <div className="form-action mt-3">
                          {historyCheck && (
                            <Alert
                              severity="info"
                              style={{
                                backgroundColor: "#fff",
                                color: "#333",
                                border: "1px solid red",
                                fontWeight: "bold",
                                position: "relative",
                                padding: "16px",
                                marginBottom: "15px",
                              }}
                            >
                              To change values, please reset the process.
                            </Alert>
                          )}
                          <div className="form-action-style d-flex justify-content-between align-items-center gap-2">
                            <div className="d-flex gap-2">
                              {!historyCheck && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    arrayHelpers.push({
                                      CSMaxPower: 0,
                                      connectorId: 0,
                                      connectorMaxPower: 0,
                                      connectorDefaultPower: 0,
                                      chargingStartedAt: 1,
                                      chargingStoppedAt: 1,
                                      chargeStationId: 0,
                                      isSaved: false,
                                    });
                                    setTimeout(() => {
                                      if (divRef.current) {
                                        divRef.current.scrollTop =
                                          divRef.current.scrollHeight;
                                      }
                                    }, 0);
                                  }}
                                  style={{
                                    backgroundColor: "#fff",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    padding: 0,
                                    outline: "none !important",
                                    border: "0px",
                                  }}
                                >
                                  <AddIcon style={{ color: "#000" }} />
                                  <p
                                    className="m-0 p-0"
                                    style={{ color: "#000" }}
                                  >
                                    Add Connector
                                  </p>
                                </button>
                              )}
                            </div>

                            <div className="d-flex justify-content-center align-items-center column-gap-2">
                              {!historyCheck && (
                                <button
                                  className="btn saveBtn"
                                  disabled={
                                    values.connectorsDetails.some(
                                      (connector) => connector.isSaved === false
                                    ) || Object.keys(errors).length > 0
                                  }
                                  type="submit"
                                >
                                  Save
                                </button>
                              )}
                              <button
                                className="btn closeBtn"
                                type="button"
                                onClick={() => {
                                  setOpen(false);
                                }}
                              >
                                Close
                              </button>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  ></FieldArray>
                </form>
              );
            }}
          </Formik>
        </Box>
      </Modal>
    </>
  );
};
