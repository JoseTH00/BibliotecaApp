import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function MultasPage() {
  const [multas, setMultas] = useState([]);
  const [formData, setFormData] = useState({
    idSocio: "",
    motivo: "",
    monto: "",
    fecha: "",
  });
  const [mensaje, setMensaje] = useState(null);

  // 🔍 buscador de socio (en formulario)
  const [busquedaSocio, setBusquedaSocio] = useState("");
  const [resultadosSocio, setResultadosSocio] = useState([]);
  const [timeoutIdSocio, setTimeoutIdSocio] = useState(null);

  // 🔍 buscador general (lista de multas)
  const [busquedaMulta, setBusquedaMulta] = useState("");
  const [timeoutIdMulta, setTimeoutIdMulta] = useState(null);

  useEffect(() => {
    cargarMultas();
  }, []);

  const mostrarMensaje = (texto, tipo = "info") => {
    setMensaje({ texto, tipo });
    setTimeout(() => setMensaje(null), 4000);
  };

  const cargarMultas = async () => {
    try {
      const res = await api.get("multas");
      setMultas(res.data);
    } catch (error) {
      mostrarMensaje("Error al cargar multas", "danger");
      console.error("Error al cargar multas:", error);
    }
  };

  // 🔍 Buscar socios parcialmente
  const buscarSocios = async (texto) => {
    if (!texto.trim()) {
      setResultadosSocio([]);
      return;
    }
    try {
      const res = await api.get(
        `socios/buscar?search=${encodeURIComponent(texto)}`
      );
      setResultadosSocio(res.data);
    } catch (error) {
      console.error("Error buscando socios:", error);
    }
  };

  // 🔍 Buscar multas (por socio)
  const buscarMultas = async (texto) => {
    try {
      const res = await api.get(
        `multas/buscar?search=${encodeURIComponent(texto)}`
      );
      setMultas(res.data);
    } catch (error) {
      mostrarMensaje("Error al buscar multas", "danger");
      console.error("Error al buscar multas:", error);
    }
  };

  // ⏱️ Debounce para buscador de socio
  const handleBusquedaSocio = (e) => {
    const valor = e.target.value;
    setBusquedaSocio(valor);

    if (timeoutIdSocio) clearTimeout(timeoutIdSocio);
    const nuevoTimeout = setTimeout(() => buscarSocios(valor), 400);
    setTimeoutIdSocio(nuevoTimeout);
  };

  // ⏱️ Debounce para buscador de multas
  const handleBusquedaMulta = (e) => {
    const valor = e.target.value;
    setBusquedaMulta(valor);

    if (timeoutIdMulta) clearTimeout(timeoutIdMulta);
    const nuevoTimeout = setTimeout(() => {
      if (valor.trim() === "") {
        cargarMultas();
      } else {
        buscarMultas(valor);
      }
    }, 500);
    setTimeoutIdMulta(nuevoTimeout);
  };

  const handleSelectSocio = (s) => {
    setFormData({ ...formData, idSocio: s.idSocio });
    setBusquedaSocio(`${s.nombre} (${s.numeroSocio})`);
    setResultadosSocio([]);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("multas", formData);
      mostrarMensaje("Multa registrada correctamente ✅", "success");
      setFormData({ idSocio: "", motivo: "", monto: "", fecha: "" });
      setBusquedaSocio("");
      cargarMultas();
    } catch (error) {
      const texto =
        error.response?.data?.error || "Error al registrar la multa";
      mostrarMensaje(texto, "danger");
      console.error(error);
    }
  };

  const cancelarMulta = async (idMulta) => {
    if (window.confirm("¿Confirmar cancelación de esta multa?")) {
      try {
        await api.put(`multas/${idMulta}/cancelar`);
        mostrarMensaje("Multa cancelada correctamente 🟢", "success");
        cargarMultas();
      } catch (error) {
        const texto =
          error.response?.data?.error || "Error al cancelar la multa";
        mostrarMensaje(texto, "danger");
        console.error(error);
      }
    }
  };

  return (
    <div className="container py-4">
      <h2 className="text-center mb-4">⚠️ Gestión de Multas</h2>

      {mensaje && (
        <div className={`alert alert-${mensaje.tipo} text-center fw-semibold`}>
          {mensaje.texto}
        </div>
      )}

      {/* 📋 Formulario */}
      <div className="card shadow p-4 mb-4 position-relative">
        <h5 className="mb-3">Registrar Nueva Multa</h5>
        <form onSubmit={handleSubmit} className="row g-3">
          {/* 🔍 Buscador de socio */}
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
                style={{
                  zIndex: 10,
                  maxHeight: "180px",
                  overflowY: "auto",
                }}
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

          {/* 📖 Motivo */}
          <div className="col-md-3">
            <label className="form-label">Motivo</label>
            <input
              type="text"
              name="motivo"
              className="form-control"
              value={formData.motivo}
              onChange={handleChange}
              required
            />
          </div>

          {/* 💰 Monto */}
          <div className="col-md-3">
            <label className="form-label">Monto</label>
            <input
              type="number"
              name="monto"
              className="form-control"
              value={formData.monto}
              onChange={handleChange}
              required
            />
          </div>

          {/* 📅 Fecha */}
          <div className="col-md-3">
            <label className="form-label">Fecha</label>
            <input
              type="date"
              name="fecha"
              className="form-control"
              value={formData.fecha}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-12 text-end">
            <button type="submit" className="btn btn-success">
              Registrar Multa
            </button>
          </div>
        </form>
      </div>

      {/* 📜 Tabla de multas */}
      <div className="card shadow p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="m-0">📋 Lista de Multas Activas</h5>

          {/* 🔍 Buscador de multas */}
          <input
            type="text"
            className="form-control w-50"
            placeholder="Buscar multas por socio..."
            value={busquedaMulta}
            onChange={handleBusquedaMulta}
          />
        </div>

        {multas.length === 0 ? (
          <p className="text-muted">No hay multas activas.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped align-middle">
              <thead className="table-danger">
                <tr>
                  <th>Socio</th>
                  <th>Motivo</th>
                  <th>Monto</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {multas.map((m) => (
                  <tr key={m.idMulta}>
                    <td>{m.Socio?.nombre}</td>
                    <td>{m.motivo}</td>
                    <td>${parseFloat(m.monto).toFixed(2)}</td>
                    <td>{m.fecha}</td>
                    <td>
                      <span
                        className={
                          m.estado === "ACTIVA"
                            ? "badge bg-warning text-dark"
                            : "badge bg-success"
                        }
                      >
                        {m.estado}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => cancelarMulta(m.idMulta)}
                        className="btn btn-sm btn-outline-danger"
                      >
                        Cancelar Multa
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