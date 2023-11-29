import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import AdminPage from "./components/Admin";
import Home from "@mui/icons-material/Home";
import Admin from "@mui/icons-material/AdminPanelSettings";
import Request from "@mui/icons-material/RequestPage";
import About from "@mui/icons-material/InfoRounded";
import Contact from "@mui/icons-material/ContactPage";
import {
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from "@mui/material";
import Navbar from "./components/Components/NavigationBar/Navbar";
import NavItem from "./components/Components/NavigationBar/NavItem";
import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import DataService from "./Services/data.service";
import ViewContent from "./components/ViewContent";
import Landing from "./components/Landing";

// import { Login } from "@mui/icons-material";
function App() {
  const [selectedTab, setSelectedTab] = useState("");

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/admin" element={<Landing />}>
            <Route index element={<AdminPage />} />
            <Route path="view-content/:id" element={<ViewContent />} />
          </Route>
          <Route path="/user" element={<Landing />}>
            <Route index element={<AdminPage />} />
            <Route path="view-content/:id" element={<ViewContent />} />
          </Route>
        </Routes>
      </BrowserRouter>
      {/* <Drawer
        className="sidebar"
        sx={{
          width: 250,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 250,
            boxSizing: "border-box",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <List className="bg-dark">
          <ListItem>
            <ListItemText primary="PDF Tool" />
          </ListItem>

          {["Home", "Upload"].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  {index === 0 ? (
                    <Home onClick={() => setSelectedTab("Home")} />
                  ) : (
                    ""
                  )}
                  {index === 1 ? (
                    <Admin onClick={() => setSelectedTab("Admin")} />
                  ) : (
                    ""
                  )}
                  {index === 2 ? (
                    <Request onClick={() => setSelectedTab("Request Admin")} />
                  ) : (
                    ""
                  )}
                  {index === 3 ? (
                    <About onClick={() => setSelectedTab("About")} />
                  ) : (
                    ""
                  )}
                  {index === 4 ? (
                    <Contact onClick={() => setSelectedTab("Contact")} />
                  ) : (
                    ""
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={text}
                  onClick={() => setSelectedTab(text)}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer> */}
      {/* <AdminPage selectedTab={selectedTab} />; */}
    </>
  );
}

export default App;
