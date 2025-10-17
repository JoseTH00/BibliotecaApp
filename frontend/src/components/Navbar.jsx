import React from "react";
import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm fixed-top">
      <div className="container">
        {/* Título principal */}
        <Link className="navbar-brand fw-bold" to="/">
          Biblioteca Municipal
        </Link>

        {/* Botón de menú móvil */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menú principal */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="/libros">
                Libros
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/socios">
                Socios
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/prestamos">
                Préstamos
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/multas">
                Multas
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link text-warning fw-semibold" to="/">
                Salir
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}