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

  const handleGetRoute = async () => {
    let UUID = "";

    // Get the list of all routes
    const routesList = await getAllRoutes();
    // Checking that if there is any route in the DB which isActive is false
    const foundRoute = routesList.find((item) => item.isActive === false);

    console.log("Line 42 foundRoute", foundRoute);

    if (foundRoute) {
      UUID = foundRoute.id;
    } else {
      UUID = self.crypto.randomUUID();
    }

    const modifiedRouteObject = {
      id: UUID,
      name: location.pathname,
      isActive: true,
      master: await handleGetMaster(),
    };

    if (!sessionStorage.getItem("UUID")) {
      sessionStorage.setItem("UUID", UUID);
      foundRoute
        ? await updateRoute(modifiedRouteObject)
        : await addRoute(modifiedRouteObject);

      /**
       *
       * for checking if there is tabs which is not opened then an alert will display and on
       * accept, the inactive tabs will open.
       *
       */
      const TabLists = await getAllRoutes();
      const isTabs = TabLists.some((item) => item.isActive === false);
      if (isTabs) {
        setOpenDialog(true);
      }
    }
  };

  const handleOpenTabs = async (data) => {
    setOpenDialog(false);
    if (data) {
      const indexRecords = await getAllRoutes();
      const TabLists = indexRecords.filter(
        (item) => item.isActive === false && item?.name !== location.pathname
      );
      // console.log("🚀 ~ handleOpenTabs ~ TabLists:", TabLists.length);

      // const ModifyData = async (element) => {
      //   if (element.id && element?.name !== location.pathname) {
      //     const objValue = await getRoute(element?.id);
      //     objValue.isActive = true;
      //     await partialUpdateRoute(objValue);
      //   }
      // };

      // indexRecords.forEach((item) => {
      //   ModifyData(item);
      // });

      // callBackFunction(1, TabLists.length, TabLists);

      TabLists.forEach((item) => {
        const newWindow = window.open(item.name, "_blank");

        if (newWindow) {
          newWindow.sessionStorage.setItem("UUID", item.id);
          console.log("UUID set for", item.name);
          clearInterval(interval);
        } else {
          console.log("The new window was blocked by the browser.");
        }
      });
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
    const handleChangeRoute = async () => {
      const sessionData = sessionStorage.getItem("UUID");

      if (sessionData) {
        const sessionData = sessionStorage.getItem("UUID");
        const objValue = await getRoute(sessionData);
        console.log(
          location.pathname,
          "🚀 ~ handleChangeRoute ~ objValue:",
          objValue
        );
        objValue.name = location.pathname;
        objValue.isActive = true;
        await partialUpdateRoute(objValue);
      }
    };

    /**
     * @Make route inactive if Tab is closed.
     *
     * The function `handleIsActive` retrieves a UUID from local storage, updates the `isActive` and
     * `master` properties of an object fetched using the UUID, and then performs a partial update on
     * the object.
     */
    const handleIsActive = async () => {
      // getting the UUID from the local storage.
      const sessionData = sessionStorage.getItem("UUID");
      const objValue = await getRoute(sessionData);
      objValue.isActive = false;
      objValue.master = false;
      await partialUpdateRoute(objValue);

      // if master page is closed then this functionality will make another one page master
      const allRoutes = await getAllRoutes();
      const activepages = allRoutes.filter((item) => item.isActive === true);
      if (activepages.length > 0) {
        let masterPage = activepages[0];
        masterPage.master = true;
        await partialUpdateRoute(masterPage);
      }
    };

    handleChangeRoute();

    window.addEventListener("beforeunload", handleIsActive);

    return () => {
      console.log("Closing...");

      window.removeEventListener("beforeunload", handleIsActive);
    };
  }, [location.pathname]);

  // const handleOpenTabs = async (data) => {
  //   setOpenDialog(false);
  //   if (data) {
  //     const TabLists = await getAllRoutes();
  //     TabLists.filter((item) => item.isActive === false).forEach((item) => {
  //       const newWindow = window.open(item.name, "_blank");

  //       // Check if the window opened successfully (not blocked by the browser)
  //       if (newWindow) {
  //         // Once the new window is loaded, assign data to its sessionStorage
  //         newWindow.onload = function () {
  //           newWindow.sessionStorage.setItem("UUID", item.id);
  //         };
  //         setTimeout(() => {
  //           console.log("wait 2 sec");
  //         }, 100);
  //       } else {
  //         console.log("The new window was blocked by the browser.");
  //       }
  //     });
  //   }
  // };

  const callBackFunction = (start, end, data) => {
    console.log("🚀 ~ callBackFunction ~ data:", data);
    if (start > end) {
      return; // Base case: end of recursion
    }

    const item = data[start - 1];
    console.log("🚀 ~ callBackFunction ~ item:", item);
    const newWindow = window.open(item.name, "_blank");
    if (newWindow) {
      // Use setTimeout to give the new window time to initialize
      const interval = setInterval(() => {
        try {
          // Check if the new window is fully initialized
          if (newWindow.document.readyState === "complete") {
            newWindow.sessionStorage.setItem("UUID", item.id);
            console.log("UUID set for", item.name);
            clearInterval(interval);
          }
        } catch (err) {
          // Handle potential cross-origin restrictions
          console.error("Error accessing the new window:", err);
        }
      }, 100); // Retry every 100ms
    } else {
      console.log("The new window was blocked by the browser.");
    }

    setTimeout(() => {
      callBackFunction(start + 1, end, data); // Recursive call for the next iteration
    }, 1000);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <Mainmenu />
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
