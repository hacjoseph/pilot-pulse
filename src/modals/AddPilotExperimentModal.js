import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import axios from "axios";

const backeEndUrl = 'https://pilotpulse.pythonanywhere.com';

function AddPilotExperimentModal({ isOpen, closeModal, experimentationId }) {
  const [pilotes, setPilotes] = useState([]);
  const [selectedPilote, setSelectedPilote] = useState("");

  useEffect(() => {
    if (isOpen) {
      axios
        .get(backeEndUrl + "/api/pilotes/")
        .then((response) => {
          setPilotes(response.data);
          setSelectedPilote("");
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [isOpen]);

  const addPilot = () => {
    if (!selectedPilote) {
      alert("Veuillez sélectionner un pilote.");
      return;
    }

    const data = {
      pilote: selectedPilote,
      experimentation: experimentationId,
      redirect_to: "https://pilot-pulse.netlify.app/experiments/",
    };

    axios
      .post(
        backeEndUrl + `/api/experimentations/ajouter-pilote/${experimentationId}/`,data
      )
      .then((result) => {
        const authorizationUrl = result.data.authorization_url;
        if (authorizationUrl) {
          window.location.href = authorizationUrl;
        } else {
          console.error("URL d'autorisation introuvable.");
        }
      })
      .catch((error) => {
        console.error("Erreur lors de l'ajout du pilote :", error);
        alert("Erreur lors de l'ajout du pilote. Veuillez réessayer."); // Ajout d'une alerte pour informer l'utilisateur
      });
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel="Ajouter un pilote à l'expérimentation"
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
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        Ajouter un pilote à l'expérimentation
      </h2>

      <div className="form-group">
        <label>Sélectionnez un pilote :</label>
        <select
          value={selectedPilote}
          onChange={(e) => setSelectedPilote(e.target.value)}
        >
          <option value="">-- Choisir un pilote --</option>
          {pilotes.map((pilote) => (
            <option key={pilote.id} value={pilote.id}>
              {pilote.nom}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={addPilot}
        style={{
          width: "100%",
          padding: "10px",
          borderRadius: "4px",
          border: "none",
          backgroundColor: "#4318FF",
          color: "#fff",
          cursor: "pointer",
          fontFamily: "Poppins",
        }}
      >
        Ajouter le pilote
      </button>
    </Modal>
  );
}

export default AddPilotExperimentModal;
