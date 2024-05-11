import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import "../Assets/Css/PilotDashboard.css";
import axios from "axios";
import Sidebar from "../Components/Sidebar";
import { Line } from "react-chartjs-2";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Modal from "react-modal";
import { backeEndUrl } from "../App.js";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const PilotDashboard = () => {
  const { id } = useParams();
  const [dashboardData, setDashboardData] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasFitbitAccount, setHasFitbitAccount] = useState(null);
  const pdfRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          backeEndUrl + `/api/pilotes/dashboard/${id}/`
        );
        const data = response.data;
        setDashboardData(data);

        console.log("Données récupérées:", data);
        console.log("Fitbit User ID:", data.pilote?.fitbit_user);

        const fitbitUser = data.pilote?.fitbit_user;
        const hasAccount = fitbitUser && fitbitUser > 0;
        setHasFitbitAccount(hasAccount);
      } catch (error) {
        setError("Erreur lors de la récupération des données du dashboard");
        console.error(
          "Erreur lors de la récupération des données du dashboard:",
          error
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const supprimerFitbitAccount = async () => {
    try {
      await axios.delete(backeEndUrl + `/api/pilotes/fitbit/supprimer/${id}/`);
      setHasFitbitAccount(false);
    } catch (error) {
      console.error("Erreur lors de la suppression du compte Fitbit:", error);
    }
  };

  const ajouterFitbitAccount = async () => {
    try {
      const response = await axios.post(
        backeEndUrl + `/api/pilotes/addfitbit/${id}/`,
        {
          redirect_to: `http://127.0.0.1:3000/pilote/${id}/`,
        }
      );
      const authorizationUrl = response.data.authorization_url;
      if (authorizationUrl) {
        window.location.href = authorizationUrl;
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout du compte Fitbit:", error);
    }
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!dashboardData) {
    return (
      <div className="no-data">Aucune donnée disponible pour ce pilote.</div>
    );
  }

  const photoUrl = backeEndUrl + `/pilotes/${dashboardData.pilote?.photo}`;

  const heart_rate_by_experimentation =
    dashboardData.heart_rate_by_experimentation;
  const datasets = Object.keys(heart_rate_by_experimentation).map(
    (experimentId, index) => {
      const experiment = heart_rate_by_experimentation[experimentId];

      return {
        label: `Expérimentation ${experimentId}`,
        data: experiment["data"].map((y, idx) => ({
          x: experiment["labels"][idx],
          y,
        })),
        borderColor: `rgba(${index * 100}, ${150 - index * 30}, 200, 1)`,
        fill: false,
        tension: 0.4,
      };
    }
  );

  const lineData = {
    datasets: datasets,
  };

  const downloadPDF = () => {
    const input = pdfRef.current;
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4", true);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 30;
      pdf.addImage(
        imgData,
        "PNG",
        imgX,
        imgY,
        imgWidth * ratio,
        imgHeight * ratio
      );
      pdf.save("DashboardPilote.pdf");
    });
  };

  return (
    <div className="pilot-dashboard">
      <Sidebar />
      <div className="dashboard-glass">
        <div className="dashboard-content">
          <div className="info-exp">
            <div className="pilot-info">
              <h2>Informations sur le pilote</h2>

              <img
                src={photoUrl}
                alt={`Photo de ${dashboardData.pilote?.prenom || "Inconnu"}`}
                className="pilot-photo"
                onError={(e) => {
                  e.target.alt = "Photo non disponible";
                }}
              />

              <div className="info-grid">
                <div className="info-box">
                  <span className="label">Prénom:</span>
                  <div className="value-box">
                    <span className="value">
                      {dashboardData.pilote?.prenom || "Inconnu"}
                    </span>
                  </div>
                </div>
                <div className="info-box">
                  <span className="label">Nom:</span>
                  <div className="value-box">
                    <span className="value">
                      {dashboardData.pilote?.nom || "Inconnu"}
                    </span>
                  </div>
                </div>
                <div className="info-box">
                  <span className="label">Rôle:</span>
                  <div className="value-box">
                    <span className="value">
                      {dashboardData.pilote?.role || "Inconnu"}
                    </span>
                  </div>
                </div>
                <div className="info-box">
                  <span className="label">Âge:</span>
                  <div className="value-box">
                    <span className="value">
                      {dashboardData.pilote?.age || "Inconnu"}
                    </span>
                  </div>
                </div>
                <div className="info-box">
                  <span className="label">Fitbit :</span>
                  <div className="value-box">
                    <span className="value">
                      {dashboardData.pilote?.fitbit_user || "Inconnu"}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                {hasFitbitAccount ? (
                  <button
                    className="Supfitbit"
                    onClick={supprimerFitbitAccount}
                  >
                    Supprimer le compte
                  </button>
                ) : (
                  <button className="ajtfitbit" onClick={ajouterFitbitAccount}>
                    Ajouter un compte
                  </button>
                )}
              </div>
            </div>

            <div>
              <div className="experimentations-table">
                <h2>Expérimentations associées</h2>
                {dashboardData.experimentations?.length > 0 ? (
                  <table style={{ width: "100%" }}>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Nom de l'expérimentation</th>
                        <th>Participants</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardData.experimentations.map((experimentation) => (
                        <tr key={experimentation.id}>
                          <td>{experimentation.id}</td>
                          <td>{experimentation.nom}</td>
                          <td>
                            {dashboardData.experiment_members[
                              experimentation.id
                            ]
                              ? dashboardData.experiment_members[
                                  experimentation.id
                                ]
                                  .map((member) => `${member[0]} ${member[1]}`)
                                  .join(", ")
                              : "Aucun participant"}
                          </td>
                          <td>
                            <Link to={`/experimentation/${experimentation.id}`}>
                              <button className="view-button">Consulter</button>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>Aucune expérimentation associée</p>
                )}
              </div>

              <div className="graph-container">
                <div className="info-graph">
                  <h2>Fréquence cardiaque au fil du temps</h2>
                  <button onClick={toggleFullScreen}>
                    Graphique plein écran
                  </button>
                </div>

                <div ref={pdfRef}>
                  <Modal
                    isOpen={isFullScreen}
                    onRequestClose={toggleFullScreen}
                    style={{
                      content: {
                        width: "80%",
                        height: "100%",
                        margin: "auto",
                      },
                    }}
                  >
                    <div className="info-graph">
                      <h2>Fréquence cardiaque au fil du temps</h2>
                      <button onClick={downloadPDF}>Telechargement Pdf</button>
                      <button onClick={toggleFullScreen}>Fermer</button>
                    </div>

                    <Line data={lineData} />
                  </Modal>
                  {lineData.datasets[0].data.length > 0 ? (
                    <Line
                      data={lineData}
                      options={{ maintainAspectRatio: true }}
                    />
                  ) : (
                    <p>Aucune donnée à afficher</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PilotDashboard;
