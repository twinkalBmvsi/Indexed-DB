import React, { useState, useEffect, useRef, Suspense, lazy } from "react";
import "./App.css";
const Mainmenu = lazy(() => import("./components/Mainmenu"));
const Ask = lazy(() => import("./routes/Ask"));
const Test = lazy(() => import("./routes/Test"));
const Treat = lazy(() => import("./routes/Treat"));
const Consult = lazy(() => import("./routes/Consult"));
const Appointment = lazy(() => import("./routes/Appointment"));

import { Routes, Route, useLocation } from "react-router-dom";
import {
  addRoute,
  updateRoute,
  getRoute,
  getAllRoutes,
  partialUpdateRoute,
} from "./utils/indexedDB";
import DialogBox from "./components/DialogBox";

function App() {
  const location = useLocation();
  const didRun = useRef(false);
  const [openDialog, setOpenDialog] = useState(false);

  // Callback for Storing the data to sessionStorage;
  const handleGetMaster = async () => {
    const allRoutesDatas = await getAllRoutes();
    const isMaster = allRoutesDatas.some((item) => item.master === true);
    return isMaster ? false : true;
  };

  // const handleGetRoute = async () => {
  //   let UUID = "";

  //   // Get the list of all routes
  //   const routesList = await getAllRoutes();
  //   // Checking that if there is any route in the DB which isActive is false
  //   const foundRoute = routesList.find((item) => item.isActive === false);

  //   console.log("Line 42 foundRoute", foundRoute);

  //   if (foundRoute) {
  //     UUID = foundRoute.id;
  //     console.log("🚀 ~ handleGetRoute ~ foundRoute:", UUID);
  //   } else {
  //     UUID = self.crypto.randomUUID();
  //     console.log("🚀 ~ handleGetRoute ~ UUID:", UUID);
  //   }

  //   const modifiedRouteObject = {
  //     id: UUID,
  //     name: location.pathname,
  //     isActive: true,
  //     master: await handleGetMaster(),
  //     timeStamp: new Date(),
  //   };

  //   console.log(
  //     "🚀 ~ handleGetRoute ~ !sessionStorage.getItem('UUID'):",
  //     !sessionStorage.getItem("UUID"),
  //     sessionStorage.getItem("UUID")
  //   );

  //   if (!sessionStorage.getItem("UUID")) {
  //     setTimeout(() => {
  //       sessionStorage.setItem("UUID", UUID);
  //     }, 100);
  //     foundRoute
  //       ? await updateRoute(modifiedRouteObject)
  //       : await addRoute(modifiedRouteObject);

  //     /**
  //      *
  //      * for checking if there is tabs which is not opened then an alert will display and on
  //      * accept, the inactive tabs will open.
  //      *
  //      */
  //     const TabLists = await getAllRoutes();
  //     const isTabs = TabLists.some((item) => item.isActive === false);
  //     if (isTabs) {
  //       setOpenDialog(true);
  //     }
  //   }
  // };

  const handleGetRoute = async () => {
    const UUID = sessionStorage.getItem("UUID");
    let createdUUID = "";
    const makeObject = async (id) => ({
      id,
      name: location.pathname,
      isActive: true,
      master: await handleGetMaster(),
      timeStamp: new Date(),
    });

    const routesList = await getAllRoutes();

    if (UUID) {
      // Handle the case where UUID is provided
      const existingRoute = routesList.find((item) => item?.id === UUID);

      if (existingRoute) {
        createdUUID = existingRoute.id;
        const objValue = await getRoute(createdUUID);
        objValue.isActive = true;
        objValue.name = location.pathname;
        objValue.master = await handleGetMaster();
        await partialUpdateRoute(objValue);
      } else {
        console.log("🚀 ~ handleGetRoute ~ objValue ~ New Object");
        createdUUID = crypto.randomUUID();
        const newObject = await makeObject(createdUUID);
        await addRoute(newObject);
      }
    } else {
      // Handle the case where UUID is not provided
      const inactiveRoute = routesList.find(
        (item) => !item.isActive && item.name === location.pathname
      );

      if (inactiveRoute) {
        createdUUID = inactiveRoute.id;
        const objValue = await getRoute(createdUUID);
        console.log(
          "🚀 ~ handleGetRoute ~ objValue ~ PartialUpdates",
          objValue
        );
        objValue.isActive = true;
        objValue.master = await handleGetMaster();
        await partialUpdateRoute(objValue);
      } else {
        console.log("🚀 ~ handleGetRoute ~ objValue ~ New Object");
        createdUUID = crypto.randomUUID();
        const newObject = await makeObject(createdUUID);
        await addRoute(newObject);
      }

      // Check if there are still inactive routes
      const newRoutesList = await getAllRoutes();
      if (newRoutesList.some((item) => !item.isActive)) {
        setOpenDialog(true);
      }
    }

    // Store the UUID in sessionStorage
    setTimeout(() => {
      sessionStorage.setItem("UUID", createdUUID);
      console.log("🚀 ~ setTimeout ~ createdUUID:", createdUUID);
    }, 1000);
  };

  const handleOpenTabs = async (data) => {
    setOpenDialog(false);
    if (data) {
      const indexRecords = await getAllRoutes();
      const UUID = sessionStorage.getItem("UUID");
      const TabLists = indexRecords.filter(
        (item) => item.isActive === false // &&
        // item?.name !== location.pathname &&
        // item?.id !== UUID
      );
      console.log("🚀 ~ handleOpenTabs ~ TabLists:", TabLists);

      const ModifyData = async (element) => {
        if (element.id && element?.name !== location.pathname) {
          const objValue = await getRoute(element?.id);
          objValue.isActive = true;
          objValue.timeStamp = new Date();
          await partialUpdateRoute(objValue);
        }
      };

      TabLists.forEach((item) => {
        ModifyData(item);
      });

      callBackFunction(1, TabLists.length, TabLists);

      // TabLists.forEach((item) => {
      //   const newWindow = window.open(item.name, "_blank");

      //   if (newWindow) {
      //     newWindow.sessionStorage.setItem("UUID", item.id);
      //     console.log("UUID set for", item.name);
      //     clearInterval(interval);
      //   } else {
      //     console.log("The new window was blocked by the browser.");
      //   }
      // });
    }
  };

  const handleChangeRoute = async (route) => {
    const sessionData = sessionStorage.getItem("UUID");

    if (sessionData) {
      const sessionData = sessionStorage.getItem("UUID");
      const allRoutes = await getAllRoutes();
      const objValue = await getRoute(sessionData);
      console.log(route, "🚀 ~ handleChangeRoute ~ objValue:", objValue);
      objValue.name = route;
      objValue.timeStamp = new Date();
      if (!allRoutes.some((item) => item.master === true)) {
        objValue.master = true;
      }
      objValue.isActive = true;
      await partialUpdateRoute(objValue);
    }
  };

  // Responsible to Add route and it's detail to Indexed DB and make isActive false if existing tab closed.
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
    const handleIsActive = async () => {
      // getting the UUID from the local storage.
      const sessionData = sessionStorage.getItem("UUID");
      const objValue = await getRoute(sessionData);
      objValue.isActive = false;
      objValue.master = false;
      objValue.timeStamp = new Date();
      await partialUpdateRoute(objValue);

      // if master page is closed then this functionality will make another one page master
      const allRoutes = await getAllRoutes();
      const activepages = allRoutes.filter((item) => item.isActive === true);
      if (activepages.length > 0) {
        let masterPage = activepages[0];
        masterPage.master = true;
        objValue.timeStamp = new Date();
        await partialUpdateRoute(masterPage);
      }
    };

    window.addEventListener("beforeunload", handleIsActive);

    return () => {
      console.log("Closing...");

      window.removeEventListener("beforeunload", handleIsActive);
    };
  }, []);

  const callBackFunction = (start, end, data) => {
    console.log("🚀 ~ callBackFunction ~ data:", data);
    if (start > end) {
      return; // Base case: end of recursion
    }

    const item = data[start - 1];
    const newWindow = window.open(item.name, "_blank");
    if (newWindow) {
      // Use setTimeout to give the new window time to initialize
      setTimeout(() => {
        newWindow.sessionStorage.setItem("UUID", item.id);
        console.log("UUID set for", item.name, item.id);
      }, 100);
    } else {
      console.log("The new window was blocked by the browser.");
    }

    setTimeout(() => {
      callBackFunction(start + 1, end, data); // Recursive call for the next iteration
    }, 1000);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <Mainmenu handleClick={handleChangeRoute} />
      <Routes>
        <Route
          exact
          path="/"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <Appointment />
            </Suspense>
          }
        />
        <Route
          exact
          path="/ask"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <Ask />
            </Suspense>
          }
        />
        <Route
          exact
          path="/test"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <Test />
            </Suspense>
          }
        />
        <Route
          exact
          path="/treat"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <Treat />
            </Suspense>
          }
        />
        <Route
          exact
          path="/consult"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <Consult />
            </Suspense>
          }
        />
      </Routes>

      <DialogBox open={openDialog} handleAction={handleOpenTabs} />
    </div>
  );
}

export default App;
