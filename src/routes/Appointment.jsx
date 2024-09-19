import React, { useReducer, useEffect, useState } from "react";
import { invokeFunction } from "../utils/reducerFunctions";
import { returnJson } from "../utils/graphJson";

const returnInitial = (activeButton) => {
  const value = {
    Pressure: "Pressure",
    BMI: "Weight",
    Sugar: "Sugar",
    Lipid: "Lipid",
    Kidney: "Kidney",
    Thyroid: "Thyroid",
    Liver: "Liver",
  };

  return [
    {
      parentCode: value[activeButton],
      ovservationCode: "",
      value: "",
      date: "",
    },
  ];
};

const Appointment = () => {
  const [activeButton] = useState("Liver");
  const [graphData, setGraphData] = useReducer(
    invokeFunction,
    returnInitial(activeButton)
  );

  useEffect(() => {
    setGraphData(returnJson["Liver"]);
  }, []);

  console.log("Line 2 final modificatons", graphData);

  return <div>Appointment</div>;
};

export default Appointment;
