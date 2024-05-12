import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import CreateExperimentModal from "../modals/CreateExperimentModal";
import AjouterPiloteModal from "../modals/AddPilotExperimentModal";
import axios from "axios";

const backeEndUrl = 'https://pilotpulse.pythonanywhere.com';

function ExperimentsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAjouterPiloteModalOpen, setIsAjouterPiloteModalOpen] =
    useState(false);
  const [currentExperimentationId, setCurrentExperimentationId] =
    useState(null);
  const [data, setData] = useState([]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openAjouterPiloteModal = (experimentationId) => {
    setCurrentExperimentationId(experimentationId);
    setIsAjouterPiloteModalOpen(true);
  };

  const closeAjouterPiloteModal = () => {
    setIsAjouterPiloteModalOpen(false);
    setCurrentExperimentationId(null);
  };

  const getData = () => {
    axios.get(backeEndUrl + "/api/experimentations/").then((response) => {
      setData(response.data);
    });
  };

  const deleteData = (id) => {
    const confirmation = window.confirm(
      "Voulez-vous vraiment supprimer cette Experimentation ?"
    );
    if (confirmation) {
      axios
        .delete(backeEndUrl + `/api/experimentations/supprimer/${id}/`)
        .then(() => {
          const result = data.filter((item) => item.id !== id);
          setData(result);
        });
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="experiments-page">
      <Sidebar activePage="experimentation" />
      <div className="experimentsGlass">
        <div className="experiments-content">
          <h2>
            Liste des Expérimentations
            <button className="create-experiment-button" onClick={openModal}>
              Créer une Expérimentation
            </button>
          </h2>

          <table className="experiments-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>ID</th>
                <th>Date</th>
                <th>Temps Début</th>
                <th>Temps Fin</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id}>
                  <td>{item.nom}</td>
                  <td>{item.id}</td>
                  <td>{item.date}</td>
                  <td>{item.temps_debut}</td>
                  <td>{item.temps_fin}</td>
                  <td>
                    <button
                      className="delete-button"
                      onClick={() => deleteData(item.id)}
                    >
                      Supprimer
                    </button>
                    <button
                      className="modify-button"
                      onClick={() => openAjouterPiloteModal(item.id)}
                    >
                      Ajouter Pilote
                    </button>
                    <Link to={`/experimentation/${item.id}`}>
                      <button className="view-button">Consulter</button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <CreateExperimentModal isOpen={isModalOpen} closeModal={closeModal} />

      <AjouterPiloteModal
        isOpen={isAjouterPiloteModalOpen}
        experimentationId={currentExperimentationId}
        closeModal={closeAjouterPiloteModal}
      />
    </div>
  );
}

export default ExperimentsPage;
