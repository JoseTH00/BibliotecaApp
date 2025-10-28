import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function SociosPage() {
  const [socios, setSocios] = useState([]);
  const [formData, setFormData] = useState({
    nombre: "",
    dni: "",
    email: "",
    telefono: "",
  });
  const [editando, setEditando] = useState(false);
  const [socioEditado, setSocioEditado] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const [busqueda, setBusqueda] = useState(""); // 🔍 nuevo estado
  const [timeoutId, setTimeoutId] = useState(null); // ⏱️ para debounce

  useEffect(() => {
    cargarSocios();
  }, []);

  const mostrarMensaje = (texto, tipo = "info") => {
    setMensaje({ texto, tipo });
    setTimeout(() => setMensaje(null), 5000);
  };

  const cargarSocios = async () => {
    try {
      const res = await api.get("socios");
      setSocios(res.data);
    } catch (error) {
      mostrarMensaje("Error al cargar socios", "danger");
      console.error("Error al cargar socios:", error);
    }
  };

  // 🔍 Buscar socios por nombre, DNI o correo
  const buscarSocios = async (texto) => {
    try {
      const res = await api.get(
        `socios/buscar?search=${encodeURIComponent(texto)}`
      );
      setSocios(res.data);
    } catch (error) {
      mostrarMensaje("Error en la búsqueda de socios", "danger");
      console.error("Error al buscar socios:", error);
    }
  };

  // 🧠 Manejar input de búsqueda con debounce
  const handleBusqueda = (e) => {
    const valor = e.target.value;
    setBusqueda(valor);

    if (timeoutId) clearTimeout(timeoutId);

    const nuevoTimeout = setTimeout(() => {
      if (valor.trim() === "") {
        cargarSocios();
      } else {
        buscarSocios(valor);
      }
    }, 500); // espera medio segundo

    setTimeoutId(nuevoTimeout);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editando) {
        await api.put(`socios/${socioEditado.idSocio}`, formData);
        mostrarMensaje("Socio actualizado correctamente ✅", "success");
      } else {
        await api.post("socios", formData);
        mostrarMensaje("Socio registrado correctamente ✅", "success");
      }

      setFormData({
        nombre: "",
        dni: "",
        email: "",
        telefono: "",
      });
      setEditando(false);
      setSocioEditado(null);
      cargarSocios();
    } catch (error) {
      const texto =
        error.response?.data?.error || "Error inesperado al guardar el socio";
      mostrarMensaje(texto, "danger");
      console.error("Error en guardar socio:", error);
    }
  };

  const handleEdit = (socio) => {
    setEditando(true);
    setSocioEditado(socio);
    setFormData({
      nombre: socio.nombre,
      dni: socio.dni,
      email: socio.email,
      telefono: socio.telefono,
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este socio?")) {
      try {
        await api.delete(`socios/${id}`);
        mostrarMensaje("Socio eliminado correctamente 🗑️", "warning");
        cargarSocios();
      } catch (error) {
        const texto =
          error.response?.data?.error || "Error al eliminar el socio";
        mostrarMensaje(texto, "danger");
        console.error("Error al eliminar socio:", error);
      }
    }
  };

  const handleCancel = () => {
    setEditando(false);
    setSocioEditado(null);
    setFormData({
      nombre: "",
      dni: "",
      email: "",
      telefono: "",
    });
    mostrarMensaje("Edición cancelada", "secondary");
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4 text-center">👥 Gestión de Socios</h2>

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
          {editando ? "✏️ Editar Socio" : "➕ Registrar Nuevo Socio"}
        </h5>
        <form onSubmit={handleSubmit} className="row g-3">
          <div className="col-md-4">
            <label className="form-label">Nombre</label>
            <input
              type="text"
              name="nombre"
              className="form-control"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">DNI</label>
            <input
              type="text"
              name="dni"
              className="form-control"
              value={formData.dni}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Teléfono</label>
            <input
              type="text"
              name="telefono"
              className="form-control"
              value={formData.telefono}
              onChange={handleChange}
            />
          </div>

          <div className="col-12 text-end">
            <button type="submit" className="btn btn-success me-2">
              {editando ? "Guardar Cambios" : "Registrar Socio"}
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
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="m-0">📋 Lista de Socios</h5>

          {/* 🔍 Input de búsqueda */}
          <input
            type="text"
            className="form-control w-50"
            placeholder="Buscar por nombre, DNI o correo..."
            value={busqueda}
            onChange={handleBusqueda}
          />
        </div>

        {socios.length === 0 ? (
          <p className="text-muted">No hay socios registrados.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped align-middle">
              <thead className="table-primary">
                <tr>
                  <th>Nombre</th>
                  <th>DNI</th>
                  <th>Número Socio</th>
                  <th>Email</th>
                  <th>Teléfono</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {socios.map((socio) => (
                  <tr key={socio.idSocio}>
                    <td>{socio.nombre}</td>
                    <td>{socio.dni}</td>
                    <td>
                      <span className="badge bg-info text-dark">
                        {socio.numeroSocio}
                      </span>
                    </td>
                    <td>{socio.email || "-"}</td>
                    <td>{socio.telefono || "-"}</td>
                    <td>
                      <button
                        onClick={() => handleEdit(socio)}
                        className="btn btn-sm btn-outline-primary me-2"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(socio.idSocio)}
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