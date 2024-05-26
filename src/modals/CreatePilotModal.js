import React, { useState } from "react";
import Modal from "react-modal";
import axios from "axios";

const backeEndUrl = 'https://pilotpulse.pythonanywhere.com';

function CreatePilotModal({ isOpen, closeModal }) {
  const [formData, setFormData] = useState({
    prenom: "",
    nom: "",
    role: "",
    age: "",
    experience: "",
    photo: "",
    sexe: "",
    redirect_to: "https://pilot-pulse.netlify.app/pilots/",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    if (type === "file") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: e.target.files[0],
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nom) newErrors.nom = "Nom est requis";
    if (!formData.prenom) newErrors.prenom = "Prénom est requis";
    if (!formData.age) newErrors.age = "Age est requis";
    if (!formData.experience) newErrors.experience = "Expérience est requise";
    if (!formData.role) newErrors.role = "Rôle est requis";
    if (!formData.sexe) newErrors.sexe = "Sexe est requis";
    return newErrors;
  };

  const handleCreatePilote = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    const formDataToSend = new FormData();

    for (const key in formData) {
      if (key === "photo" && formData[key] instanceof File) {
        formDataToSend.append(key, formData[key]);
      } else {
        formDataToSend.append(key, formData[key]);
      }
    }
    try {
      const response = await axios.post(
        backeEndUrl + "/api/pilotes/add/",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const authorizationUrl = response.data.authorization_url;
      window.location.href = authorizationUrl;
      closeModal();
    } catch (error) {
      console.error("Erreur lors de l'envoi des données:", error);
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
          padding: "20px",
        },
      }}
    >
      <h2 style={{ textAlign: "center" }}>Ajouter Pilote</h2>
      <form onSubmit={handleCreatePilote} encType="multipart/form-data">
        <div className="form-group">
          <label>Photo:</label>
          <input type="file" name="photo" onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Nom du pilote:</label>
          <input
            type="text"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
          />
          {errors.nom && <div style={{ color: "red", fontSize: '12px' }}>{errors.nom}</div>}
        </div>

        <div className="form-group">
          <label>Prénom:</label>
          <input
            type="text"
            name="prenom"
            value={formData.prenom}
            onChange={handleChange}
          />
          {errors.prenom && <div style={{ color: "red", fontSize: '12px' }}>{errors.prenom}</div>}
        </div>

        <div className="form-group">
          <label>Age:</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
          />
          {errors.age && <div style={{ color: "red", fontSize: '12px' }}>{errors.age}</div>}
        </div>

        <div className="form-group">
          <label>Expérience:</label>
          <input
            type="number"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
          />
          {errors.experience && (
            <div style={{ color: "red", fontSize: '12px' }}>{errors.experience}</div>
          )}
        </div>

        <div className="form-group">
          <label>Rôle:</label>
          <input
            type="text"
            name="role"
            value={formData.role}
            onChange={handleChange}
          />
          {errors.role && <div style={{ color: "red", fontSize: '12px' }}>{errors.role}</div>}
        </div>

        <div className="form-group">
          <label>Sexe:</label>
          <select name="sexe" value={formData.sexe} onChange={handleChange}>
            <option value="">Sélectionner le sexe</option>
            <option value="F">Femme</option>
            <option value="M">Homme</option>
          </select>
          {errors && errors.sexe && (
            <div style={{ color: "red", fontSize: "12px" }}>{errors.sexe}</div>
          )}
        </div>
        <button className="createexpirementbutton" type="submit">
          Valider
        </button>
      </form>
    </Modal>
  );
}

export default CreatePilotModal;
