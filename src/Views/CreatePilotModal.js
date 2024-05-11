import React, { useState } from "react";
import Modal from "react-modal";
import axios from "axios";
import { backeEndUrl } from "../App.js";

function CreatePilotModal({ isOpen, closeModal }) {
  const [formData, setFormData] = useState({
    prenom: "",
    nom: "",
    role: "",
    age: "",
    experience: "",
    photo: "",
    sexe: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreatePilote = async (e) => {
    try {
      const response = axios.post(backeEndUrl + "/api/pilotes/add/", formData);
      response
        .then(function (result) {
          // Accéder à authorization_url à partir de result.data
          var authorizationUrl = result.data.authorization_url;
          console.log("Resutat; ", authorizationUrl);
          window.location.href = authorizationUrl;
        })
        .catch(function (error) {
          // Gérer les erreurs éventuelles
          console.error(
            "Erreur lors de la récupération de l'URL d'autorisation :",
            error
          );
        });

      console.log("Données envoyées avec succès:", response);
      closeModal();
    } catch (error) {
      console.error("Erreur lors de l'envoi des données:", error);
      if (error.response) {
        // Erreur de réponse HTTP
        console.error("Réponse HTTP:", error.response.data);
      } else if (error.request) {
        // Erreur de requête
        console.error("Erreur de requête:", error.request);
      } else {
        // Autres erreurs
        console.error("Erreur:", error.message);
      }
      closeModal();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel="Create Pilote Modal"
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        },
        content: {
          width: "400px",
          margin: "auto",
          borderRadius: "8px",
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
          padding: "20px",
        },
      }}
    >
      <h2 style={{ marginBottom: "20px", textAlign: "center" }}>
        Ajouter Pilote
      </h2>
      <form onSubmit={handleCreatePilote}>
        <div style={{ marginBottom: "15px" }}>
          <label>Photo:</label>
          <input
            type="file"
            name="photo"
            value={formData.photo}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>Nom du pilote :</label>
          <input
            type="text"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>Prénom :</label>
          <input
            type="text"
            name="prenom"
            value={formData.prenom}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>Age :</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>Expérience :</label>
          <input
            type="number"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>Rôle :</label>
          <input
            type="text"
            name="role"
            value={formData.role}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>Sexe :</label>
          <input
            type="text"
            name="sexe"
            value={formData.sexe}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
        </div>
        <button
          type="submit"
          style={{
            width: "100%",
            fontFamily: "Poppins",
            padding: "10px",
            borderRadius: "4px",
            border: "none",
            backgroundColor: "#4318FF",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Validez
        </button>
      </form>
    </Modal>
  );
}

export default CreatePilotModal;
