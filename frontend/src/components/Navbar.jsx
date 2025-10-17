import React from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm fixed-top">
      <div className="container">
        {/* Título principal */}
        <Link className="navbar-brand fs-3 fw-bold" to="/">
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
              <NavLink className="nav-link fs-5" to="/libros">
                Libros
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link fs-5" to="/socios">
                Socios
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link fs-5" to="/prestamos">
                Préstamos
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link fs-5" to="/multas">
                Multas
              </NavLink>
            </li>
            {!isHomePage && (
              <li className="nav-item">
                <NavLink className="nav-link text-warning fw-semibold fs-5" to="/">
                  Salir
                </NavLink>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}