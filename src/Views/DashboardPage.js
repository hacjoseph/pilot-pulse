import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Sidebar from "../Components/Sidebar";
import { Line } from "react-chartjs-2";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from "chart.js";
import Modal from "react-modal";
import {
  UilMinusCircle,
  UilPlusCircle,
  UilStopwatch,
  UilAbacus,
} from "@iconscout/react-unicons";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement
);

const backeEndUrl = "https://pilotpulse.pythonanywhere.com";

const DashboardPage = () => {
  const { id } = useParams();
  const [dashboardData, setDashboardData] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const pdfRef = useRef();

  useEffect(() => {
    axios
      .get(backeEndUrl + `/api/experimentations/dashboard/${id}/`)
      .then((response) => {
        setDashboardData(response.data);
      })
      .catch((error) => {
        console.error(
          "Erreur lors de la récupération des données du dashboard:",
          error
        );
        setDashboardData({ error: "Impossible de charger les données" });
      });
  }, [id]);

  if (!dashboardData) {
    return <div>Chargement...</div>;
  }

  const heart_rate_by_participant =
    dashboardData.heart_rate_by_participant || {};
  const globalMin = dashboardData.global_heart_rate_range?.min || "N/A";
  const globalMax = dashboardData.global_heart_rate_range?.max || "N/A";
  const globalAverage = dashboardData.global_average_heart_rate || "N/A";
  const experimentationDetails = dashboardData.experimentation_details;

  const validDatasets = Object.values(heart_rate_by_participant).filter(
    (participant) =>
      participant.labels?.length > 0 && participant.data?.length > 0
  );

  const lineData = {
    labels: validDatasets.length > 0 ? validDatasets[0].labels : [],
    datasets: validDatasets.map((participantData) => ({
      label: participantData.nom || "Nom non défini",
      data: participantData.data,
      borderColor: `rgba(${Math.floor(Math.random() * 255)},${Math.floor(
        Math.random() * 255
      )},${Math.floor(Math.random() * 255)},1)`,
      fill: false,
    })),
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const downloadPDF = () => {
    setTimeout(() => {
      const input = pdfRef.current;
      html2canvas(input, { scale: 2 }).then((canvas) => {
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
    }, 200);
  };

  return (
    <div className="dashboard-page">
      <Sidebar />
      <div className="dashboard-glass">
        <div className="data-cubes">
          <div className="cube">
            <div className="icon">
              <UilMinusCircle />
            </div>
            <div>
              <span className="cube-label">Minimum</span>
              <span className="cube-value"> {globalMin} bpm</span>
            </div>
          </div>
          <div className="cube">
            <div className="icon">
              <UilStopwatch />
            </div>
            <div>
              <span className="cube-label">Moyenne</span>
              <span className="cube-value">{globalAverage} bpm</span>
            </div>
          </div>
          <div className="cube">
            <div className="icon">
              <UilPlusCircle />
            </div>
            <div>
              <span className="cube-label">Maximum</span>
              <span className="cube-value">{globalMax} bpm</span>
            </div>
          </div>
          <div className="cube">
            <div className="icon">
              <UilAbacus />
            </div>
            <div>
              <span className="cube-label">Nombre</span>
              <span className="cube-value"> N/A </span>
            </div>
          </div>
        </div>

        <div className="dashboard-content">
          <div className="participants-list">
            {Object.values(heart_rate_by_participant).map(
              (participant, index) => (
                <Link
                  to={`/pilote/${participant.id}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div className="participant-card">
                    <div className="participant-photo-container">
                      {participant.photo ? (
                        <img
                          src={backeEndUrl + `/${participant.photo}`}
                          alt={participant.nom}
                          className="participant-photo"
                        />
                      ) : (
                        <div className="empty-photo" />
                      )}
                    </div>
                    <span className="participant-name">
                      {participant.nom || "Inconnu"}
                    </span>
                    <span className="participant-role">
                      {participant.role || "Rôle non défini"}
                    </span>
                  </div>
                </Link>
              )
            )}
          </div>

          {validDatasets.length > 0 && (
            <div className="graph-container">
              <div className="titre2">
                <div>
                  <span className="graph-title">
                    Graphique de Fréquence Cardiaque
                  </span>
                </div>
                <div>
                  <button className="screen-button" onClick={toggleFullScreen}>
                    Agrandir
                  </button>
                </div>
              </div>

              <div className="graphe">
                <Line
                  data={lineData}
                  options={{ maintainAspectRatio: false }}
                />
              </div>
            </div>
          )}
        </div>

        {isFullScreen && (
          <div>
            <Modal
              isOpen={isFullScreen}
              onRequestClose={toggleFullScreen}
              style={{
                content: {
                  width: "90%",
                  height: "100%",
                  margin: "auto",
                },
              }}
            >
              <div className="impression" ref={pdfRef}>
                <div className="info-graph">
                  <h2>Fréquence cardiaque au fil du temps</h2>
                  <button onClick={downloadPDF}>Telechargement Pdf</button>
                  <button onClick={toggleFullScreen}>Fermer</button>
                </div>

                <div className="experimentation-info">
                  <div>
                    <h4>Experimentation:</h4>
                    <p>{experimentationDetails.nom}</p>
                  </div>

                  <div>
                    <h4>Date:</h4>
                    <p> {experimentationDetails.date}</p>
                  </div>
                  <div>
                    <h4>Temps: </h4>
                    <p>
                      {" "}
                      {experimentationDetails.temps_debut} -{" "}
                      {experimentationDetails.temps_fin}
                    </p>
                  </div>
                </div>

                <Line data={lineData} />
              </div>
            </Modal>
            {lineData.datasets[0].data.length > 0 ? (
              <Line data={lineData} options={{ maintainAspectRatio: true }} />
            ) : (
              <p>Aucune donnée à afficher</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
