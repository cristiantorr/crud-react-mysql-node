const express = require("express");
const mysql = require("mysql2");

const app = express();
const port = 3001;

// SE UTILIZA CORS PARA PERMITIR QUE EL FRONTEND PUEDA USAR LA API
const cors = require("cors");
console.log(`Servidor corriendosdas`);
// Middleware de CORS dinámico
app.use(
  cors({
    origin: "http://localhost:5173", // Asegúrate de que este sea el dominio correcto de tu frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // Si necesitas compartir cookies o cabeceras de autenticación
  })
);
app.use(express.json());

// Conexión a la base de datos MySQL fuera de docker
const db = mysql.createConnection({
  host: "127.0.0.1",
  user: "user",
  password: "userpassword",
  database: "mydatabase",
  port: 3306, // El puerto mapeado a 3306
});

/* // Conexión a la base de datos MySQL dentro de docker
const db = mysql.createConnection({
  host: "mysql", // Nombre del servicio en docker-compose
  user: "user", // Usuario definido en docker-compose
  password: "userpassword", // Contraseña definida en docker-compose
  database: "mydatabase", // Base de datos definida en docker-compose
}); */

db.connect((err) => {
  if (err) {
    console.error("Error al conectar con la base de datos", err);
  } else {
    console.log("Conexión establecida con la base de datoss");
  }
});

app.post("/create", (req, res) => {
  const { Username, Age, Country, Position, Experience } = req.body; // Asegúrate de obtener los datos correctos del cuerpo de la solicitud

  // Comprobación simple para asegurarte de que los campos necesarios están presentes
  if (!Username || !Age || !Country || !Position || !Experience) {
    return res.status(400).json({ error: "Faltan campos requeridos" });
  }

  db.query("INSERT INTO empleados SET ?", req.body, (err, results) => {
    if (err) {
      console.error("Error al insertar en la base de datos", err);
      return res
        .status(500)
        .json({ error: "Hubo un error al agregar el empleado" });
    } else {
      console.log("Empleado agregado exitosamente");
      res.status(201).json({
        message: "Empleado agregado correctamente",
        empleadoId: results.insertId, // ID del nuevo empleado insertado
      });
    }
  });
});

app.put("/update", (req, res) => {
  const { Username, Age, Country, Position, Experience, id } = req.body; // Asegúrate de obtener los datos correctos del cuerpo de la solicitud

  // Comprobación simple para asegurarte de que los campos necesarios están presentes
  if (!Username || !Age || !Country || !Position || !Experience || !id) {
    return res.status(400).json({ error: "Faltan campos requeridos" });
  }

  db.query(
    "UPDATE empleados SET Username=?, Age=?, Country=?, Position=?, Experience=? WHERE id=?",
    [Username, Age, Country, Position, Experience, id], // Aquí pasamos los valores en el orden correcto
    (err, results) => {
      if (err) {
        console.error("Error al editar en la base de datos", err);
        return res
          .status(500)
          .json({ error: "Hubo un error al editar el empleado" });
      } else {
        console.log("Empleado editado exitosamente");
        res.status(200).json({
          message: "Empleado editado correctamente",
          empleadoId: id, // ID del empleado editado
        });
      }
    }
  );
});

// Ruta DELETE para eliminar el empleado
app.delete("/delete/:id", (req, res) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({ error: "Falta el id del empleado" });
  }

  db.query(
    "DELETE FROM empleados WHERE id = ?",
    [id], // Pasar el id como parámetro en la consulta SQL
    (err, results) => {
      if (err) {
        console.error("Error al eliminar el empleado", err);
        return res
          .status(500)
          .json({ error: "Hubo un error al eliminar el empleado" });
      } else {
        console.log("Empleado eliminado exitosamente");
        res.status(200).json({ message: "Empleado eliminado correctamente" });
      }
    }
  );
});
app.get("/empleados", (req, res) => {
  db.query("SELECT * FROM empleados", (err, results) => {
    if (err) {
      console.error("Error al consultar la base de datos", err);
      return res
        .status(500)
        .json({ error: "Error al consultar la base de datos", err });
    } else {
      console.log("Consulta exitosa");
      res.status(200).json(results);
    }
  });
});

app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
