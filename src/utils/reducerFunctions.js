const handlePressure = (functionValue, obsValue) => {
  return functionValue.map((item) => ({
    parentCode: obsValue,
    ovservationCode: obsValue,
    date: item.scheduled_time,
    value: `${item.blood_pressure_1}, ${item.blood_pressure_2}`,
  }));
};

const handleWeight = (functionValue, obsValue) => {
  return functionValue.map((item) => ({
    parentCode: obsValue,
    ovservationCode: obsValue,
    date: item.scheduled_time,
    value: item.bmi,
  }));
};

const handleOtherGraph = (functionValue, obsValue) => {
  return functionValue.map((item) => ({
    parentCode: obsValue,
    ovservationCode: item.observation_code,
    date: item.specimen_received,
    value: item.value,
  }));
};

export const invokeFunction = (initialState, functionValue) => {
  if (functionValue) {
    const returnData = {
      Pressure: handlePressure(functionValue, "Pressure"),
      Weight: handleWeight(functionValue, "Weight"),
      Sugar: handleOtherGraph(functionValue, "Sugar"),
      Lipid: handleOtherGraph(functionValue, "Lipid"),
      Kidney: handleOtherGraph(functionValue, "Kidney"),
      Thyroid: handleOtherGraph(functionValue, "Thyroid"),
      Liver: handleOtherGraph(functionValue, "Liver"),
    };

    return returnData[initialState[0]["parentCode"]];
  } else {
    return initialState;
  }
};
