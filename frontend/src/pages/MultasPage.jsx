import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function MultasPage() {
  const [multas, setMultas] = useState([]);
  const [socios, setSocios] = useState([]);
  const [formData, setFormData] = useState({
    idSocio: "",
    motivo: "",
    monto: "",
    fecha: "",
  });
  const [editando, setEditando] = useState(false);
  const [multaEditada, setMultaEditada] = useState(null);
  const [mensaje, setMensaje] = useState(null); // { tipo, texto }

  useEffect(() => {
    cargarDatos();
  }, []);

  const mostrarMensaje = (texto, tipo = "info") => {
    setMensaje({ texto, tipo });
    setTimeout(() => setMensaje(null), 4000);
  };

  const cargarDatos = async () => {
    try {
      const [resMultas, resSocios] = await Promise.all([
        api.get("multas"),
        api.get("socios"),
      ]);
      setMultas(resMultas.data);
      setSocios(resSocios.data);
    } catch (error) {
      mostrarMensaje("Error al cargar datos", "danger");
      console.error("Error al cargar datos:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editando) {
        await api.put(`multas/${multaEditada.idMulta}`, formData);
        mostrarMensaje("Multa actualizada correctamente ✅", "success");
      } else {
        await api.post("multas", formData);
        mostrarMensaje("Multa registrada correctamente ✅", "success");
      }

      setFormData({ idSocio: "", motivo: "", monto: "", fecha: "" });
      setEditando(false);
      setMultaEditada(null);
      cargarDatos();
    } catch (error) {
      const texto =
        error.response?.data?.error || "Error al guardar la multa";
      mostrarMensaje(texto, "danger");
      console.error("Error en guardar multa:", error);
    }
  };

  const handleEdit = (multa) => {
    setEditando(true);
    setMultaEditada(multa);
    setFormData({
      idSocio: multa.idSocio,
      motivo: multa.motivo,
      monto: multa.monto,
      fecha: multa.fecha,
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar esta multa?")) {
      try {
        await api.delete(`multas/${id}`);
        mostrarMensaje("Multa eliminada correctamente 🗑️", "warning");
        cargarDatos();
      } catch (error) {
        const texto =
          error.response?.data?.error || "Error al eliminar la multa";
        mostrarMensaje(texto, "danger");
        console.error("Error al eliminar multa:", error);
      }
    }
  };

  const handleCancel = () => {
    setEditando(false);
    setMultaEditada(null);
    setFormData({ idSocio: "", motivo: "", monto: "", fecha: "" });
    mostrarMensaje("Edición cancelada", "secondary");
  };

  return (
    <div className="container py-4">
      <h2 className="text-center mb-4">⚠️ Gestión de Multas</h2>

      {/* Mensaje dinámico */}
      {mensaje && (
        <div
          className={`alert alert-${mensaje.tipo} text-center fw-semibold`}
          role="alert"
        >
          {mensaje.texto}
        </div>
      )}

      {/* Formulario */}
      <div className="card shadow p-4 mb-4">
        <h5 className="mb-3">
          {editando ? "✏️ Editar Multa" : "➕ Registrar Nueva Multa"}
        </h5>
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
            <button type="submit" className="btn btn-success me-2">
              {editando ? "Guardar Cambios" : "Registrar Multa"}
            </button>
            {editando && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCancel}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Listado */}
      <div className="card shadow p-4">
        <h5 className="mb-3">📋 Lista de Multas</h5>
        {multas.length === 0 ? (
          <p className="text-muted">No hay multas registradas.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped align-middle">
              <thead className="table-danger">
                <tr>
                  <th>ID</th>
                  <th>Socio</th>
                  <th>Motivo</th>
                  <th>Monto</th>
                  <th>Fecha</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {multas.map((m) => (
                  <tr key={m.idMulta}>
                    <td>{m.idMulta}</td>
                    <td>{m.Socio?.nombre || "-"}</td>
                    <td>{m.motivo}</td>
                    <td>${m.monto}</td>
                    <td>{m.fecha}</td>
                    <td>
                      <button
                        onClick={() => handleEdit(m)}
                        className="btn btn-sm btn-outline-primary me-2"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(m.idMulta)}
                        className="btn btn-sm btn-outline-danger"
                      >
                        Eliminar
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