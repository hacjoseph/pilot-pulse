import React, { useState, useEffect, useCallback } from "react";
import { useHistory, useLocation } from "react-router-dom";
import logo from "../Assets/Img/logo.svg";
import {
  UilClipboardAlt,
  UilChart,
  UilSignOutAlt,
} from "@iconscout/react-unicons";
import "../Assets/Css/Sidebar.css";

function Sidebar() {
  const history = useHistory();

  const location = useLocation();

  const [activeMenu, setActiveMenu] = useState(() => {
    return localStorage.getItem("activeMenu") || location.pathname;
  });

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("activeMenu");
    history.push("/login");
  };

  const navigate = (route) => {
    setActiveMenu(route);
    localStorage.setItem("activeMenu", route);
    history.push(route);
  };

  const getActiveMenu = useCallback(() => {
    return localStorage.getItem("activeMenu") || location.pathname;
  }, [location.pathname]);

  useEffect(() => {
    setActiveMenu(getActiveMenu());
  }, [location.pathname,getActiveMenu]);

  return (
    <div className="sidebar">
      <div className="sidebarGlass">
        <div className="sidebarContainer">
          <div className="logo-container">
            <img src={logo} alt="Logo" className="logo" />
          </div>

          <div className="menu">
            <div
              className={`menuItem ${
                activeMenu === "/experiments" ? "active" : ""
              }`}
              onClick={() => navigate("/experiments")}
            >
              <UilChart />
              <span>Experimentation</span>
            </div>

            <div
              className={`menuItem ${activeMenu === "/pilots" ? "active" : ""}`}
              onClick={() => navigate("/pilots")}
            >
              <UilClipboardAlt />
              <span>Pilote</span>
            </div>

            <div className="menuItem" onClick={logout}>
              <UilSignOutAlt />
              <span>Déconnexion</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
