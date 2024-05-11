import React, { useState } from "react";
import { useHistory } from "react-router";
import axios from "axios";
import { backeEndUrl } from "../App.js";

const LOGIN_URL = backeEndUrl + "/api/login/";

function LoginPage() {
  const history = useHistory();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = (route) => {
    history.push(route);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(LOGIN_URL, {
        username: username,
        password: password,
      });

      const { token } = response.data;

      localStorage.setItem("token", token);

      setUsername("");
      setPassword("");

      history.push("/experiments");
    } catch (error) {
      console.error("Erreur lors de la connexion :", error.message);
      setError("Identifiants incorrects. Veuillez réessayer.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Connexion</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <p>Username :</p>
            <input
              type="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nom d'utilisateur"
              required
            />
          </div>

          <div className="form-group">
            <p>Mot de passe :</p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe"
              required
            />
          </div>

          <div className="erreur">
            {error && <p className="error">{error}</p>}
          </div>

          <button type="submit" className="login-button">
            Connexion
          </button>

          <div className="inscription">
            <p>
              Vous n'avez pas de compte ?{" "}
              <span className="rgt" onClick={() => navigate("/register")}>
                S'inscrire
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
