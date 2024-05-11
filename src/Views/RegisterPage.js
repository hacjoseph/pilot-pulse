import React, { useState } from "react";
import { useHistory } from "react-router";
import axios from "axios";
import { backeEndUrl } from "../App.js";

const REGISTER_URL = backeEndUrl + "/signup";

function RegisterPage() {
  const history = useHistory();

  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(REGISTER_URL, {
        username: username,
        first_name: firstName,
        last_name: lastName,
        email: email,
        password: password,
      });

      setUsername("");
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      history.push("/login");
    } catch (error) {
      console.error("Erreur lors de l", "inscription :", error.message);
      setError(
        "Une erreur s",
        "est produite lors de l",
        "inscription. Veuillez réessayer."
      );
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <h2>Inscription</h2>
        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label htmlFor="username">Nom d'utilisateur :</label>
            <input
              type="username"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Entrez votre nom d'utilisateur"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="first_name">Prénom :</label>
            <input
              type="username"
              id="first_name"
              name="first_name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Entrez votre prénom"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="last_name">Nom :</label>
            <input
              type="username"
              id="last_name"
              name="last_name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Entrez votre nom"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email :</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Entrez votre email"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Mot de passe :</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Entrez votre mot de passe"
              required
            />
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit" className="register-button">
            Inscription
          </button>
        </form>
        <p>
          Vous avez déjà un compte ?{" "}
          <span className="rgt" onClick={() => history.push("/login")}>
            Se connecter
          </span>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
