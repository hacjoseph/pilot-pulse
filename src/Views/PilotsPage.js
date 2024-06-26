import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import CreatePilotModal from "../modals/CreatePilotModal";
import ModifyPilotModal from "../modals/ModifyPilotModal";
import Modal from "react-modal";
import axios from "axios";

const backeEndUrl = 'https://pilotpulse.pythonanywhere.com';

Modal.setAppElement("#root");

function PilotsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState([]);

  const [isModifyModalOpen, setIsModifyModalOpen] = useState(false);
  const [selectedPilotId, setSelectedPilotId] = useState(null);
  const [deleteConfirmationModalOpen, setDeleteConfirmationModalOpen] = useState(false);
  const [pilotToDelete, setPilotToDelete] = useState(null);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openModifyModal = (pilotId) => {
    setSelectedPilotId(pilotId);
    setIsModifyModalOpen(true);
  };

  const closeModifyModal = () => {
    setIsModifyModalOpen(false);
  };

  const getData = () => {
    axios.get(backeEndUrl + "/api/pilotes/").then((data) => {
      console.log("pilotes", data);
      setData(data.data);
    });
  };

  const deleteData = () => {
    axios.delete(backeEndUrl + `/api/pilotes/delete/${pilotToDelete}/`).then(() => {
      const updatedData = data.filter((item) => item.id !== pilotToDelete);
      setData(updatedData);
      setDeleteConfirmationModalOpen(false);
    }).catch((error) => {
      console.error('Erreur lors de la suppression du pilote:', error);
      setDeleteConfirmationModalOpen(false);
    });
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="pilots-page">
      <Sidebar />
      <div className="pilotsGlass">
        <div className="pilots-content">
          <h2>
            Liste des Pilotes
            <button onClick={openModal} className="create-pilot-button">
              Ajouter un Pilote
            </button>
          </h2>

          <table className="pilots-table">
            <thead>
              <tr>
                <th>Photo</th>
                <th>Nom et Prenom</th>
                <th>Role</th>
                <th>Age</th>
                <th>Experience</th>
                <th>Sexe</th>
                <th>Actions</th>
              </tr>
            </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item.id}>
                    <td><img src={item.photo} alt="Pilot" className="pilot-image" /></td>
                    <td>{item.nom} {item.prenom}</td>
                    <td>{item.role} </td>
                    <td>{item.age} </td>
                    <td>{item.experience} </td>
                    <td>{item.sexe} </td>
                    <td>
                      <button className="delete-button" onClick={() => {
                      setPilotToDelete(item.id);
                      setDeleteConfirmationModalOpen(true);
                    }}>Supprimer</button>
                      <button className="modify-button" onClick={() => openModifyModal(item.id)}>Modifier</button>
                      <Link to={`/pilote/${item.id}`}>
                        <button className="view-button">Consulter</button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
          </table>
        </div>
      </div>
      <CreatePilotModal isOpen={isModalOpen} closeModal={closeModal} />
      <ModifyPilotModal
        isOpen={isModifyModalOpen}
        closeModal={closeModifyModal}
        piloteId={selectedPilotId}
        refreshData={getData}
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
        <h2>Confirmer la suppression du pilote?</h2>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px' }}>
          <button className="view-button" onClick={() => setDeleteConfirmationModalOpen(false)}>Annuler</button>
          <button className="delete-button" onClick={deleteData}>Confirmer</button>
        </div>
      </Modal>
    </div>
  );
}
export default PilotsPage;
