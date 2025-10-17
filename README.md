Perfecto 👍 acá tenés el **contenido completo del `README.md`** listo para copiar y pegar directamente en tu proyecto:

---

```markdown
# Sistema de Gestión de Biblioteca

## 🏛️ Descripción general
El **Sistema de Gestión de Biblioteca** permite al bibliotecario administrar todos los procesos de la biblioteca municipal de forma digital.  
Incluye módulos para gestionar **libros, socios, préstamos y multas**, todo con una interfaz moderna, responsive y conectada a una base de datos MySQL mediante un backend en Node.js.

---

## ⚙️ Estructura del proyecto
```

BibliotecaApp/
├── backend/
│   ├── src/
│   │   ├── models/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── routes/
│   │   └── db.js
│   ├── server.js
│   ├── package.json
│   └── .env
│
└── frontend/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── App.jsx
│   ├── App.css
│   └── index.js
├── package.json
└── public/

````

---

## 🧩 Tecnologías utilizadas
| Componente | Tecnología | Descripción |
|-------------|-------------|-------------|
| **Backend** | Node.js + Express.js | Servidor principal y API REST |
| **Base de datos** | MySQL + Sequelize ORM | Almacenamiento y modelado relacional |
| **Frontend** | React.js + Bootstrap 5 | Interfaz de usuario moderna y responsive |
| **Gestión de entorno** | dotenv | Configuración de variables seguras |
| **Cliente HTTP** | Axios | Comunicación entre frontend y backend |

---

## 📂 Modelos principales
- **Libro** → título, autor, ISBN, estado  
- **Socio** → nombre, DNI, número de socio, email, teléfono  
- **Préstamo** → socio, libro, fecha de inicio, fecha de devolución, estado  
- **Multa** → socio, motivo, monto, fecha

Cada modelo cuenta con su respectiva relación definida mediante **Sequelize**:
- Un socio puede tener **muchos préstamos** y **muchas multas**.  
- Un libro puede estar asociado a **un préstamo a la vez**.  

---

## 🚀 Instalación y ejecución

### 1️⃣ Clonar el repositorio
```bash
git clone <URL_DEL_REPOSITORIO>
cd BibliotecaApp
````

### 2️⃣ Configurar el backend

```bash
cd backend
npm install
```

Luego crear un archivo `.env` con el siguiente formato:

```env
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=biblioteca
PORT=3001
```

### 3️⃣ Iniciar el servidor backend

```bash
npm run dev
```

Si todo está correcto, verás:

```
✅ Servidor ejecutándose en puerto 3001
```

---

### 4️⃣ Configurar el frontend

```bash
cd ../frontend
npm install
npm start
```

El frontend estará disponible en 👉 **[http://localhost:3000](http://localhost:3000)**

---

## 💻 Funcionalidades principales

| Módulo        | Descripción                           | Acciones                            |
| ------------- | ------------------------------------- | ----------------------------------- |
| **Libros**    | Administración del catálogo           | Alta, edición, eliminación, listado |
| **Socios**    | Registro de usuarios de la biblioteca | Alta, edición, eliminación, listado |
| **Préstamos** | Control de préstamos de libros        | Asignación, devolución, listado     |
| **Multas**    | Registro de sanciones                 | Alta, edición, eliminación, listado |

---

## 🖥️ Interfaz de usuario

* **Navbar fija superior** con acceso directo a todos los módulos
* **Footer institucional** con la leyenda “© Biblioteca Municipal 2025”
* **Cards, tablas y formularios** con diseño responsive en Bootstrap
* Colores institucionales y animaciones suaves
* Totalmente funcional desde desktop y dispositivos móviles

---

## 🔒 Consideraciones

* Solo el bibliotecario accede al sistema (no hay login múltiple).
* Los socios son gestionados por el bibliotecario (no se registran por sí mismos).
* Los libros solo pueden estar prestados a un socio a la vez.

---

## 🧠 Créditos y autoría

Desarrollado por: **José Thorlet**
Comisión: **C-TARDE**
Año: **2025**

---