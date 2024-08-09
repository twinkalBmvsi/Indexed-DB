import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { useNavigate } from "react-router-dom";

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

  const handleNavigate = (route) => {
    navigate(route);
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
