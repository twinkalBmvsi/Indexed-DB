import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { useNavigate } from "react-router-dom";
import { addRoute, getRoute, updateRoute } from "../utils/indexedDB";

const menuButtons = [
  {
    name: "Appointment",
    route: "/",
  },
  {
    name: "Ask",
    route: "/ask",
  },
  {
    name: "Test",
    route: "/test",
  },
  {
    name: "Treat",
    route: "/treat",
  },
  {
    name: "Consult",
    route: "/consult",
  },
];

const Mainmenu = () => {
  const navigate = useNavigate();

  //   Adding the route to the IndexedDB
  const handleAddRoute = async (UUID, routeName) => {
    console.log("Line 40 IndexedDB func", UUID);

    const newRoute = {
      id: UUID,
      name: routeName,
      isActive: true,
      master: true,
    };

    const route = await getRoute(UUID);
    if (route) {
      await updateRoute(newRoute);
    } else {
      await addRoute(newRoute);
    }

    console.log("Navigating to", routeName);
    navigate(routeName);
  };

  const handleNavigate = (route) => {
    let tabId = "";
    const sessionTabId = sessionStorage.getItem("tabId");

    if (sessionTabId) {
      tabId = sessionTabId;
      handleAddRoute(sessionTabId, route);
    } else {
      let UUID = self.crypto.randomUUID();
      tabId = UUID;

      //   Storing the route to indexedDB.
      handleAddRoute(UUID, route);
      sessionStorage.setItem("tabId", UUID);
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Virgie
          </Typography>
          <Stack spacing={1} direction="row">
            {menuButtons?.map((item, index) => {
              return (
                <Button
                  key={index}
                  onClick={() => handleNavigate(item.route)}
                  color="inherit"
                >
                  {item.name}
                </Button>
              );
            })}
          </Stack>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Mainmenu;
