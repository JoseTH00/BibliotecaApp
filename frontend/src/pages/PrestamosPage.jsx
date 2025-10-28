import React, { useEffect, useState } from "react";
import api from "../services/api";

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
  const [mensaje, setMensaje] = useState(null);

  // Estados para buscadores
  const [busquedaSocio, setBusquedaSocio] = useState("");
  const [busquedaLibro, setBusquedaLibro] = useState("");
  const [resultadosSocio, setResultadosSocio] = useState([]);
  const [resultadosLibro, setResultadosLibro] = useState([]);
  const [timeoutIdSocio, setTimeoutIdSocio] = useState(null);
  const [timeoutIdLibro, setTimeoutIdLibro] = useState(null);

  useEffect(() => {
    cargarPrestamos();
  }, []);

  const mostrarMensaje = (texto, tipo = "info") => {
    setMensaje({ texto, tipo });
    setTimeout(() => setMensaje(null), 4000);
  };

  const cargarPrestamos = async () => {
    try {
      const res = await api.get("prestamos");
      setPrestamos(res.data);
    } catch (error) {
      mostrarMensaje("Error al cargar préstamos", "danger");
      console.error(error);
    }
  };

  // 🔍 Buscar socios parcialmente
  const buscarSocios = async (texto) => {
    if (!texto.trim()) {
      setResultadosSocio([]);
      return;
    }
    try {
      const res = await api.get(`socios/buscar?search=${encodeURIComponent(texto)}`);
      setResultadosSocio(res.data);
    } catch (error) {
      console.error("Error buscando socios:", error);
    }
  };

  // 🔍 Buscar libros parcialmente
  const buscarLibros = async (texto) => {
    if (!texto.trim()) {
      setResultadosLibro([]);
      return;
    }
    try {
      const res = await api.get(`libros/buscar?search=${encodeURIComponent(texto)}`);
      // Filtrar solo libros disponibles
      setResultadosLibro(res.data.filter((l) => l.estado === "DISPONIBLE"));
    } catch (error) {
      console.error("Error buscando libros:", error);
    }
  };

  // ⏱️ Manejar input con debounce
  const handleBusquedaSocio = (e) => {
    const valor = e.target.value;
    setBusquedaSocio(valor);
    if (timeoutIdSocio) clearTimeout(timeoutIdSocio);
    const nuevoTimeout = setTimeout(() => buscarSocios(valor), 400);
    setTimeoutIdSocio(nuevoTimeout);
  };

  const handleBusquedaLibro = (e) => {
    const valor = e.target.value;
    setBusquedaLibro(valor);
    if (timeoutIdLibro) clearTimeout(timeoutIdLibro);
    const nuevoTimeout = setTimeout(() => buscarLibros(valor), 400);
    setTimeoutIdLibro(nuevoTimeout);
  };

  const handleSelectSocio = (s) => {
    setFormData({ ...formData, idSocio: s.idSocio });
    setBusquedaSocio(`${s.nombre} (${s.numeroSocio})`);
    setResultadosSocio([]);
  };

  const handleSelectLibro = (l) => {
    setFormData({ ...formData, idLibro: l.idLibro });
    setBusquedaLibro(l.titulo);
    setResultadosLibro([]);
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("prestamos", formData);
      mostrarMensaje("Préstamo registrado correctamente ✅", "success");
      setFormData({
        idSocio: "",
        idLibro: "",
        fechaInicio: "",
        fechaDevolucion: "",
      });
      setBusquedaSocio("");
      setBusquedaLibro("");
      cargarPrestamos();
    } catch (error) {
      const texto =
        error.response?.data?.error || "Error al registrar préstamo";
      mostrarMensaje(texto, "danger");
    }
  };

  const registrarDevolucion = async (idPrestamo) => {
    if (window.confirm("¿Confirmar devolución del libro?")) {
      try {
        await api.put(`prestamos/${idPrestamo}/devolver`);
        mostrarMensaje("Devolución registrada correctamente 📗", "success");
        cargarPrestamos();
      } catch (error) {
        const texto =
          error.response?.data?.error || "Error al registrar devolución";
        mostrarMensaje(texto, "danger");
      }
    }
  };

  return (
    <div className="container py-4">
      <h2 className="text-center mb-4">🔁 Gestión de Préstamos</h2>

      {mensaje && (
        <div className={`alert alert-${mensaje.tipo} text-center fw-semibold`} role="alert">
          {mensaje.texto}
        </div>
      )}

      {/* 📘 Formulario */}
      <div className="card shadow p-4 mb-4 position-relative">
        <h5 className="mb-3">📘 Registrar Nuevo Préstamo</h5>
        <form onSubmit={handleSubmit} className="row g-3">
          {/* 🔍 Socio */}
          <div className="col-md-3 position-relative">
            <label className="form-label">Socio</label>
            <input
              type="text"
              className="form-control"
              placeholder="Buscar socio..."
              value={busquedaSocio}
              onChange={handleBusquedaSocio}
              required
            />
            {resultadosSocio.length > 0 && (
              <ul
                className="list-group position-absolute w-100"
                style={{ zIndex: 10, maxHeight: "180px", overflowY: "auto" }}
              >
                {resultadosSocio.map((s) => (
                  <li
                    key={s.idSocio}
                    className="list-group-item list-group-item-action"
                    onClick={() => handleSelectSocio(s)}
                    style={{ cursor: "pointer" }}
                  >
                    {s.nombre} ({s.numeroSocio}) — {s.dni}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* 🔍 Libro */}
          <div className="col-md-3 position-relative">
            <label className="form-label">Libro</label>
            <input
              type="text"
              className="form-control"
              placeholder="Buscar libro..."
              value={busquedaLibro}
              onChange={handleBusquedaLibro}
              required
            />
            {resultadosLibro.length > 0 && (
              <ul
                className="list-group position-absolute w-100"
                style={{ zIndex: 10, maxHeight: "180px", overflowY: "auto" }}
              >
                {resultadosLibro.map((l) => (
                  <li
                    key={l.idLibro}
                    className="list-group-item list-group-item-action"
                    onClick={() => handleSelectLibro(l)}
                    style={{ cursor: "pointer" }}
                  >
                    {l.titulo} — {l.autor}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Fechas */}
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

      {/* 📋 Lista */}
      <div className="card shadow p-4">
        <h5 className="mb-3">📖 Lista de Préstamos Activos</h5>
        {prestamos.length === 0 ? (
          <p className="text-muted">No hay préstamos activos.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped align-middle">
              <thead className="table-primary">
                <tr>
                  <th>Socio</th>
                  <th>Libro</th>
                  <th>Fecha Inicio</th>
                  <th>Fecha Devolución</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {prestamos.map((p) => (
                  <tr key={p.idPrestamo}>
                    <td>{p.Socio?.nombre}</td>
                    <td>{p.Libro?.titulo}</td>
                    <td>{p.fechaInicio}</td>
                    <td>{p.fechaDevolucion}</td>
                    <td>
                      <button
                        onClick={() => registrarDevolucion(p.idPrestamo)}
                        className="btn btn-sm btn-outline-success"
                      >
                        Registrar Devolución
                      </button>
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