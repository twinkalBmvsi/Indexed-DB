import React from "react";
import useGetResponse from "../CustomHook/useGetResponse";

const Appointment = () => {
  const todos = useGetResponse("https://jsonplaceholder.typicode.com/todos");

  console.log("todos", todos);

  return <div>Appointment</div>;
};

export default Appointment;
