import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";

const backeEndUrl = 'https://pilotpulse.pythonanywhere.com';

const ModifyPilotModal = ({ isOpen, closeModal, piloteId, refreshData }) => {
  const [pilotData, setPilotData] = useState({
    prenom: "",
    nom: "",
    role: "",
    age: "",
    experience: "",
    photo: null,
    sexe: "M",
    fitbit_user_id: null,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setErrors({});
    if (piloteId) {
      axios
        .get(backeEndUrl + `/api/pilotes/${piloteId}/`)
        .then((response) => {
          const data = response.data;

          const fitbitId = data.fitbit_user_id || null;
          setPilotData({
            prenom: data.prenom,
            nom: data.nom,
            role: data.role,
            age: data.age,
            experience: data.experience,
            sexe: data.sexe,
            fitbit_user_id: fitbitId,
          });
        })
        .catch((error) => {
          console.error(
            "Erreur lors du chargement des données du pilote:",
            error
          );
        });
    }
  }, [piloteId]);

  const handleInputChange = (e) => {
    const { name, type } = e.target;
    if (type === "file") {
      setPilotData((prev) => ({
        ...prev,
        photo: e.target.files[0],
      }));
    } else {
      const { value } = e.target;
      setPilotData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    Object.entries(pilotData).forEach(([key, value]) => {
      if (key === "photo" && value) {
        formData.append(key, value);
      } else {
        formData.append(key, value);
      }
    });

    try {
      await axios.post(
        backeEndUrl + `/api/pilotes/update/${piloteId}/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      refreshData();
      closeModal();
    } catch (error) {
      console.error("Erreur lors de la modification du pilote:", error);
      if (error.response && error.response.data) {
        setErrors(error.response.data);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel="Modifier les informations du pilote"
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
        Modifier le Pilote
      </h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="form-group">
          <label>Prénom:</label>
          <input
            type="text"
            name="prenom"
            value={pilotData.prenom}
            onChange={handleInputChange}
            required
          />
          {errors.prenom && (
            <span style={{ color: "red" }}>{errors.prenom}</span>
          )}
        </div>

        <div className="form-group">
          <label>Nom:</label>
          <input
            type="text"
            name="nom"
            value={pilotData.nom}
            onChange={handleInputChange}
            required
          />
          {errors.nom && <span style={{ color: "red" }}>{errors.nom}</span>}
        </div>

        <div className="form-group">
          <label>Rôle:</label>
          <input
            type="text"
            name="role"
            value={pilotData.role}
            onChange={handleInputChange}
            required
          />
          {errors.role && <span style={{ color: "red" }}>{errors.role}</span>}
        </div>

        <div className="form-group">
          <label>Âge:</label>
          <input
            type="number"
            name="age"
            value={pilotData.age}
            onChange={handleInputChange}
            required
          />
          {errors.age && <span style={{ color: "red" }}>{errors.age}</span>}
        </div>

        <div className="form-group">
          <label>Expérience:</label>
          <input
            type="number"
            name="experience"
            value={pilotData.experience}
            onChange={handleInputChange}
            required
          />
          {errors.experience && (
            <span style={{ color: "red" }}>{errors.experience}</span>
          )}
        </div>

        <div className="form-group">
          <label>Sexe:</label>
          <select
            name="sexe"
            value={pilotData.sexe}
            onChange={handleInputChange}
          >
            <option value="M">Masculin</option>
            <option value="F">Féminin</option>
          </select>
          {errors.sexe && <span style={{ color: "red" }}>{errors.sexe}</span>}
        </div>

        <div className="form-group">
          <label>Photo:</label>
          <input type="file" name="photo" onChange={handleInputChange} />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="createexpirementbutton"
          style={{
            cursor: isSubmitting ? "not-allowed" : "pointer",
          }}
        >
          Modifier
        </button>
      </form>
    </Modal>
  );
};

export default ModifyPilotModal;
