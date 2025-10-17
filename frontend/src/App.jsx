import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import LibrosPage from "./pages/LibrosPage";
import SociosPage from "./pages/SociosPage";
import PrestamosPage from "./pages/PrestamosPage";
import MultasPage from "./pages/MultasPage";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="py-5 mt-5">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/libros" element={<LibrosPage />} />
          <Route path="/socios" element={<SociosPage />} />
          <Route path="/prestamos" element={<PrestamosPage />} />
          <Route path="/multas" element={<MultasPage />} />
        </Routes>
      </div>
      <Footer />
    </BrowserRouter>
  );
}

export default App;