import React from "react";
import Sidebar from "../../../Components/Sidebar/Sidebar.jsx";
import MainContent from "../../../Components/MainContent/MainContent.jsx";
import "../CSS/Home.css";

function HomePage() {
  return (
    <div className="homepage-container-home">
      <Sidebar />
      <MainContent />
    </div>
  );
}

export default HomePage;