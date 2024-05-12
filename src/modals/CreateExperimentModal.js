import React, { useState } from "react";
import Modal from "react-modal";
import axios from "axios";
import AjouterPiloteModal from "./AddPilotExperimentModal";
import "../Assets/Css/CreateExperimentModal.css";

const backeEndUrl = 'https://pilotpulse.pythonanywhere.com';

function CreateExperimentModal({ isOpen, closeModal }) {
  const [nom, setNom] = useState("");
  const [date, setDate] = useState("");
  const [heure_debut, setHeureDebut] = useState("");
  const [minute_debut, setMinuteDebut] = useState("");
  const [heure_fin, setHeureFin] = useState("");
  const [minute_fin, setMinuteFin] = useState("");
  const [detail_level, setDetail_level] = useState("1min");
  const [isAjouterPiloteOpen, setAjouterPiloteOpen] = useState(false);
  const [experimentationId, setExperimentationId] = useState(null);

  const handleSubmit = async () => {
    const experimentation = {
      nom,
      date,
      temps_debut: `${heure_debut}:${minute_debut}`,
      temps_fin: `${heure_fin}:${minute_fin}`,
      detail_level,
    };

    try {
      const response = await axios.post(
        backeEndUrl + "/api/experimentations/creer/",
        experimentation
      );
      const id = response.data.experimentation_id;
      setExperimentationId(id);
      closeModal();
      setAjouterPiloteOpen(true);
    } catch (error) {
      console.error(
        "Erreur lors de la création de l",
        "expérimentation :",
        error
      );
    }
  };

  const selectOptions = (start, end) => {
    const options = [];
    for (let i = start; i <= end; i++) {
      options.push(
        <option key={i} value={i < 10 ? `0${i}` : i}>
          {i}
        </option>
      );
    }
    return options;
  };

  return (
    <>
      <div className="CreateExperiment">
        <Modal
          isOpen={isOpen}
          onRequestClose={closeModal}
          contentLabel="Créer une Expérimentation"
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
          <div className="titre">
            <h2>Créer une Expérimentation</h2>
          </div>

          <div className="form-group">
            <label>Nom de l'expérimentation :</label>
            <input
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Date :</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Temps Début :</label>
            <div className="temps">
              <select
                name="heure_debut"
                value={heure_debut}
                onChange={(e) => setHeureDebut(e.target.value)}
              >
                <option value="">-- Heure --</option>
                {selectOptions(0, 23)}
              </select>

              <select
                name="minute_debut"
                value={minute_debut}
                onChange={(e) => setMinuteDebut(e.target.value)}
              >
                <option value="">-- Minute --</option>
                {selectOptions(0, 59)}
              </select>
            </div>
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label>Temps Fin :</label>
            <div style={{ display: "flex", gap: "10px" }}>
              <select
                name="heure_fin"
                value={heure_fin}
                onChange={(e) => setHeureFin(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
              >
                <option value="">-- Heure --</option>
                {selectOptions(0, 23)}
              </select>
              <select
                name="minute_fin"
                value={minute_fin}
                onChange={(e) => setMinuteFin(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
              >
                <option value="">-- Minute --</option>
                {selectOptions(0, 59)}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Niveau de Détail :</label>
            <select
              value={detail_level}
              onChange={(e) => setDetail_level(e.target.value)}
            >
              <option value="1sec">1 Seconde</option>
              <option value="1min">1 Minute</option>
              <option value="5min">5 Minutes</option>
              <option value="15min">15 Minutes</option>
            </select>
          </div>

          <button className="createexpirementbutton" onClick={handleSubmit}>
            Créer l'expérimentation
          </button>
        </Modal>
        <AjouterPiloteModal
          isOpen={isAjouterPiloteOpen}
          experimentationId={experimentationId}
          closeModal={() => setAjouterPiloteOpen(false)}
        />
      </div>
    </>
  );
}

export default CreateExperimentModal;
