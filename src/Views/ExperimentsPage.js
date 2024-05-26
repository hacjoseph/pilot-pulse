import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import CreateExperimentModal from "../modals/CreateExperimentModal";
import AjouterPiloteModal from "../modals/AddPilotExperimentModal";
import Modal from 'react-modal';
import axios from "axios";

const backeEndUrl = 'https://pilotpulse.pythonanywhere.com';

function ExperimentsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAjouterPiloteModalOpen, setIsAjouterPiloteModalOpen] =
    useState(false);
  const [currentExperimentationId, setCurrentExperimentationId] =
    useState(null);
  const [data, setData] = useState([]);
  const [deleteConfirmationModalOpen, setDeleteConfirmationModalOpen] = useState(false);
  const [experimentationToDelete, setExperimentationToDelete] = useState(null);

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

  const deleteData = () => {
    axios.delete(backeEndUrl + `/api/experimentations/supprimer/${experimentationToDelete}/`).then(() => {
      const result = data.filter((item) => item.id !== experimentationToDelete);
      setData(result);
      setDeleteConfirmationModalOpen(false);
    }).catch((error) => {
      console.error('Erreur lors de la suppression de l\'expérimentation:', error);
      setDeleteConfirmationModalOpen(false);
    });
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
                      onClick={() => {
                        setExperimentationToDelete(item.id);
                        setDeleteConfirmationModalOpen(true);
                      }}
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

      <Modal
          isOpen={deleteConfirmationModalOpen}
          onRequestClose={() => setDeleteConfirmationModalOpen(false)}
          contentLabel="Confirmation de suppression"
          style={{
            overlay: {
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            },
            content: {
              width: '400px',
              margin: 'auto',
              borderRadius: '8px',
              padding: '20px',
              height: '150px',
            },
          }}
      >
          <h2>Confirmer la suppression de l'expérimentation?</h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
            <button className="view-button" onClick={() => setDeleteConfirmationModalOpen(false)}>Annuler</button>
            <button className="delete-button" onClick={deleteData}>Confirmer</button>
          </div>

        </Modal>

    </div>
  );
}

export default ExperimentsPage;