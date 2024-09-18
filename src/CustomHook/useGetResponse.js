import React, { useReducer, useEffect } from "react";
import { modifyAppointment } from "../utils/appointmentReducers";
import axios from "axios";

const initialState = {
  userId: "",
  title: "",
  id: "",
};

const useGetResponse = (url) => {
  const [todos, setTodos] = useReducer(modifyAppointment, initialState);

  useEffect(() => {
    const callApi = () => {
      axios
        .get(url)
        .then((response) => {
          if (response.status === 200) {
            setTodos(response.data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };
    callApi();
  }, []);

  return todos;
};

export default useGetResponse;
