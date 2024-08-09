import React, { useEffect, useRef } from "react";
import "./App.css";
import Mainmenu from "./components/Mainmenu";
import Appointment from "./routes/Appointment";
import Ask from "./routes/Ask";
import Test from "./routes/Test";
import Treat from "./routes/Treat";
import Consult from "./routes/Consult";
import { Routes, Route, useLocation } from "react-router-dom";
import {
  addRoute,
  updateRoute,
  getRoute,
  partialUpdateRoute,
} from "./utils/indexedDB";

function App() {
  const location = useLocation();
  const didRun = useRef(false);

  // Callback for Storing the data to sessionStorage;
  const handleGetRoute = async () => {
    let UUID = self.crypto.randomUUID();
    const newRoute = {
      id: UUID,
      name: location.pathname,
      isActive: true,
      master: true,
    };

    if (!sessionStorage.getItem("UUID")) {
      sessionStorage.setItem("UUID", UUID);
      await addRoute(newRoute);
    }
  };

  useEffect(() => {
    if (!didRun.current) {
      handleGetRoute();
      didRun.current = true;
    }

    return () => {
      console.log("Vanishing...");
    };
  }, []);

  // Triggers when route changes, it is responsible to change the routes of the exixting tab id.

  useEffect(() => {
    const handleChangeRoute = async () => {
      const sessionData = sessionStorage.getItem("UUID");

      if (sessionData) {
        const updatedRouteValues = {
          id: sessionData,
          name: location.pathname,
          isActive: true,
          master: true,
        };
        await updateRoute(updatedRouteValues);
      }
    };

    // Make route inactive if Tab is closed.
    const handleIsActive = async () => {
      // getting the UUID from the local storage.
      const sessionData = sessionStorage.getItem("UUID");

      // Update the existing route from isActive = true to isActive = false when the tab is closed.
      const updatedRouteValues = {
        name: location.pathname,
        isActive: false,
        master: true,
      };
      await partialUpdateRoute(sessionData, updatedRouteValues);
    };

    handleChangeRoute();

    return () => {
      console.log("Closing...");
      window.removeEventListener("beforeunload", handleIsActive);
    };
  }, [location.pathname]);

  return (
    <div>
      <Mainmenu />
      <Routes>
        <Route path="/" element={<Appointment />} />
        <Route path="/ask" element={<Ask />} />
        <Route path="/test" element={<Test />} />
        <Route path="/treat" element={<Treat />} />
        <Route path="/consult" element={<Consult />} />
      </Routes>
    </div>
  );
}

export default App;
