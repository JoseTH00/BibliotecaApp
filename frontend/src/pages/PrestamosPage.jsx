import React, { useEffect, useState } from "react";
import api from ".../services/api";

export default function PrestamosPage() {
  const [prestamos, setPrestamos] = useState([]);
  const [socios, setSocios] = useState([]);
  const [libros, setLibros] = useState([]);
  const [formData, setFormData] = useState({
    idSocio: "",
    idLibro: "",
    fechaInicio: "",
    fechaDevolucion: "",
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [resPrestamos, resSocios, resLibros] = await Promise.all([
        api.get("prestamos"),
        api.get("socios"),
        api.get("libros"),
      ]);
      setPrestamos(resPrestamos.data);
      setSocios(resSocios.data);
      setLibros(resLibros.data.filter((l) => l.estado === "DISPONIBLE"));
    } catch (error) {
      console.error("Error al cargar datos:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("prestamos", formData);
      alert("Préstamo registrado correctamente");
      setFormData({ idSocio: "", idLibro: "", fechaInicio: "", fechaDevolucion: "" });
      cargarDatos();
    } catch (error) {
      alert("Error al registrar el préstamo");
      console.error(error);
    }
  };

  const registrarDevolucion = async (idPrestamo) => {
    if (window.confirm("¿Confirmar devolución del libro?")) {
      try {
        await api.put(`prestamos/${idPrestamo}/devolver`);
        alert("Devolución registrada correctamente");
        cargarDatos();
      } catch (error) {
        alert("Error al registrar devolución");
        console.error(error);
      }
    }
  };

  return (
    <div className="container py-4">
      <h2 className="text-center mb-4">🔁 Gestión de Préstamos</h2>

      {/* Formulario de préstamo */}
      <div className="card shadow p-4 mb-4">
        <h5 className="mb-3">📘 Registrar Nuevo Préstamo</h5>
        <form onSubmit={handleSubmit} className="row g-3">
          <div className="col-md-3">
            <label className="form-label">Socio</label>
            <select
              name="idSocio"
              className="form-select"
              value={formData.idSocio}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione un socio...</option>
              {socios.map((s) => (
                <option key={s.idSocio} value={s.idSocio}>
                  {s.nombre} ({s.numeroSocio})
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-3">
            <label className="form-label">Libro</label>
            <select
              name="idLibro"
              className="form-select"
              value={formData.idLibro}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione un libro...</option>
              {libros.map((l) => (
                <option key={l.idLibro} value={l.idLibro}>
                  {l.titulo}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-3">
            <label className="form-label">Fecha Inicio</label>
            <input
              type="date"
              name="fechaInicio"
              className="form-control"
              value={formData.fechaInicio}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-3">
            <label className="form-label">Fecha Devolución</label>
            <input
              type="date"
              name="fechaDevolucion"
              className="form-control"
              value={formData.fechaDevolucion}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-12 text-end">
            <button type="submit" className="btn btn-success">
              Registrar Préstamo
            </button>
          </div>
        </form>
      </div>

      {/* Listado de préstamos */}
      <div className="card shadow p-4">
        <h5 className="mb-3">📖 Lista de Préstamos</h5>
        {prestamos.length === 0 ? (
          <p className="text-muted">No hay préstamos registrados.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped align-middle">
              <thead className="table-primary">
                <tr>
                  <th>ID</th>
                  <th>Socio</th>
                  <th>Libro</th>
                  <th>Fecha Inicio</th>
                  <th>Fecha Devolución</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {prestamos.map((p) => (
                  <tr key={p.idPrestamo}>
                    <td>{p.idPrestamo}</td>
                    <td>{p.Socio?.nombre}</td>
                    <td>{p.Libro?.titulo}</td>
                    <td>{p.fechaInicio}</td>
                    <td>{p.fechaDevolucion}</td>
                    <td>
                      <span
                        className={
                          p.devuelto
                            ? "badge bg-success"
                            : "badge bg-warning text-dark"
                        }
                      >
                        {p.devuelto ? "Devuelto" : "En préstamo"}
                      </span>
                    </td>
                    <td>
                      {!p.devuelto && (
                        <button
                          onClick={() => registrarDevolucion(p.idPrestamo)}
                          className="btn btn-sm btn-outline-success"
                        >
                          Registrar Devolución
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}