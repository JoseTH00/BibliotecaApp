import React from "react";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="container py-5">
      <h1 className="text-center mb-5">Sistema de Gestión de Biblioteca</h1>

      <div className="row g-4">
        <div className="col-12 col-md-6">
          <div className="card shadow text-center p-4">
            <h4 className="card-title mb-3">📚 Gestionar Libros</h4>
            <Link to="/libros" className="btn btn-primary btn-lg">
              Ir a Libros
            </Link>
          </div>
        </div>

        <div className="col-12 col-md-6">
          <div className="card shadow text-center p-4">
            <h4 className="card-title mb-3">👥 Gestionar Socios</h4>
            <Link to="/socios" className="btn btn-primary btn-lg">
              Ir a Socios
            </Link>
          </div>
        </div>

        <div className="col-12 col-md-6">
          <div className="card shadow text-center p-4">
            <h4 className="card-title mb-3">🔁 Gestionar Préstamos</h4>
            <Link to="/prestamos" className="btn btn-primary btn-lg">
              Ir a Préstamos
            </Link>
          </div>
        </div>

        <div className="col-12 col-md-6">
          <div className="card shadow text-center p-4">
            <h4 className="card-title mb-3">⚠️ Gestionar Multas</h4>
            <Link to="/multas" className="btn btn-primary btn-lg">
              Ir a Multas
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}