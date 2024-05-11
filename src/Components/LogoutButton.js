import React from "react";
import { useHistory } from "react-router-dom";

const LogoutButton = () => {
  const history = useHistory();

  const logout = () => {
    localStorage.removeItem("token");
    history.push("/login");
  };

  return <button onClick={logout}>Déconnexion</button>;
};

export default LogoutButton;
