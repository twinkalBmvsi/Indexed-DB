import React, { useEffect } from "react";
import "./App.css";
import Mainmenu from "./components/Mainmenu";
import Appointment from "./routes/Appointment";
import Ask from "./routes/Ask";
import Test from "./routes/Test";
import Treat from "./routes/Treat";
import Consult from "./routes/Consult";
import { Routes, Route } from "react-router-dom";
import { getAllRoutes } from "./utils/indexedDB";

function App() {
  const handleGetRoute = async () => {
    const routesList = await getAllRoutes();
    console.log("routes list", routesList);
  };

  useEffect(() => {
    handleGetRoute();

    return () => {
      console.log("Vanishing...");
    };
  }, []);

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
