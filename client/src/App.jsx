import { useEffect, useState } from "react";
import "./App.css";
import Axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Table from "react-bootstrap/Table";
import Stack from "react-bootstrap/Stack";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

function App() {
  const [username, setUsername] = useState("");
  const [age, setAge] = useState(0);
  const [country, setCountry] = useState("");
  const [position, setPosition] = useState("");
  const [experience, setExperience] = useState(0);
  const [listEmployees, setListEmpoyees] = useState([]);
  const [infoEmployees, setInfoEmployees] = useState(false);
  const [removeEmployees, setRemoveEMployees] = useState(false);
  const MySwal = withReactContent(Swal);

  const [idEmployee, setIdEmployee] = useState(0);
  const [hasFetched, setHasFetched] = useState(false); // Estado que controla si ya se hizo la consulta

  // Se obtiene información del empleado para editarlo en el formulario
  const info = (data) => {
    setInfoEmployees(true);
    setIdEmployee(data.id);
    setUsername(data.Username);
    setAge(data.Age);
    setCountry(data.Country);
    setPosition(data.Position);
    setExperience(data.Experience);
  };

  //Clear the form for a new employee
  const clearForm = () => {
    setUsername("");
    setAge("");
    setCountry("");
    setPosition("");
    setExperience("");
  };

  const cancel = () => {
    clearForm();
    setInfoEmployees(false);
  };

  // Se hizo la consulta con fetch.
  /*   const add = () => {
    fetch("http://localhost:3001/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Username: username,
        Age: age,
        Country: country,
        Position: position,
        Experience: experience,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      });
  }; */

  // Se hace consulta con axios, para agregar empleados
  const create = () => {
    Axios.post("http://localhost:3001/create", {
      Username: username,
      Age: age,
      Country: country,
      Position: position,
      Experience: experience,
    })
      .then((res) => {
        console.log(res);
        const Toast = MySwal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: false,

          didOpen: (toast) => {
            toast.onmouseenter = MySwal.stopTimer;
            toast.onmouseleave = MySwal.resumeTimer;
          },
        });
        Toast.fire({
          icon: "success",
          title: "Empleado(a) creado correctamente",
        });
        updateEmployeeList();
        clearForm();
      })
      .catch((err) => {
        MySwal.fire({
          icon: "error",
          title: "Oops..",
          text: "No se logró crear el empleado",
          confirmButtonColor: "#198754",
          footer: "Lo sentimos, intente más tarde",
        });
        /*  if (err.response) {
          // El servidor respondió con un código de estado fuera del rango 2xx
          console.error("Error en el servidor:", err.response.status);
          console.error("Mensaje de error del servidor:", err.response.data);
        } else if (err.request) {
          // La solicitud fue hecha, pero no se recibió respuesta (error de conexión o timeout)
          console.error(
            "Error de conexión o timeout. No se recibió respuesta del servidor"
          );
        } else {
          // Algo sucedió al configurar la solicitud
          console.error("Error al configurar la solicitud:", err.message);
        } */
      });
  };

  // Se hace consulta con axios, para editar empleados

  const update = () => {
    Axios.put("http://localhost:3001/update", {
      id: idEmployee,
      Username: username,
      Age: age,
      Country: country,
      Position: position,
      Experience: experience,
    })
      .then((res) => {
        const Toast = MySwal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: false,

          didOpen: (toast) => {
            toast.onmouseenter = MySwal.stopTimer;
            toast.onmouseleave = MySwal.resumeTimer;
          },
        });
        Toast.fire({
          icon: "success",
          title: "Empleado(a) actualizado correctamente",
        });
        updateEmployeeList();
      })
      .catch((err) => {
        MySwal.fire({
          icon: "error",
          title: "Oops..",
          text: "No se logró actualizar el empleado",
          confirmButtonColor: "#198754",
          footer: "Lo sentimos, intente más tarde",
        });
      });
  };

  const remove = (id) => {
    Swal.fire({
      title: "¿Estas seguro?",
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#198754",
      cancelButtonColor: "#d33",
      confirmButtonText: "¡Sí, bórralo!",
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        setRemoveEMployees(true);

        Axios.delete(`http://localhost:3001/delete/${id}`, {
          id: id,
        })
          .then((res) => {
            updateEmployeeList();
            Swal.fire({
              title: "Eliminado(a)",
              text: "Empleado(a) eliminado correctamente",
              icon: "success",
            });
          })
          .catch((err) => {
            MySwal.fire({
              icon: "error",
              title: "Oops..",
              text: "No se logró eliminar el empleado",
              confirmButtonColor: "#198754",
              footer: "Lo sentimos, intente más tarde",
            });
          });
      } else if (result.isDenied) {
        setRemoveEMployees(false);
        MySwal.fire("Los cambios no se han guardado", "", "info");
      }
    });
  };

  // Se hace consulta con axios, para listar empleados
  const updateEmployeeList = () => {
    Axios.get("http://localhost:3001/empleados")
      .then((res) => {
        setListEmpoyees(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    updateEmployeeList();
  }, []);
  //Asegurarse de que el array de empleados no está vacío
  const tableHead =
    listEmployees.length > 0 ? Object.keys(listEmployees[0]).slice(1) : [];

  return (
    <>
      <div className="container-lg">
        <Stack gap={2}>
          <Card className="">
            <Card.Header>Gestión de Empleados</Card.Header>
            <Card.Body>
              <Card.Title>Formularo de Registro</Card.Title>
              <InputGroup className="mb-3">
                <InputGroup.Text id="basic-addon1">
                  Nombres completos
                </InputGroup.Text>
                <Form.Control
                  onChange={(e) => setUsername(e.target.value)}
                  type="text"
                  name="username"
                  aria-label="Username"
                  aria-describedby="basic-addon1"
                  value={
                    (username && username.length > 0) || "" ? username : ""
                  }
                />
              </InputGroup>
              <InputGroup className="mb-3">
                <InputGroup.Text id="basic-addon1"> Edad </InputGroup.Text>
                <Form.Control
                  onChange={(e) => setAge(e.target.value)}
                  type="number"
                  name="age"
                  value={(age && age > 0) || "" ? age : ""}
                />
              </InputGroup>
              <InputGroup className="mb-3">
                <InputGroup.Text id="basic-addon1"> País </InputGroup.Text>
                <Form.Control
                  onChange={(e) => setCountry(e.target.value)}
                  type="text"
                  name="country"
                  value={(country && country.length > 0) || "" ? country : ""}
                />
              </InputGroup>
              <InputGroup className="mb-3">
                <InputGroup.Text id="basic-addon1">Cargo</InputGroup.Text>
                <Form.Control
                  onChange={(e) => setPosition(e.target.value)}
                  type="text"
                  name="position"
                  value={
                    (position && position.length > 0) || "" ? position : ""
                  }
                />
              </InputGroup>
              <InputGroup className="mb-3">
                <InputGroup.Text id="basic-addon1">
                  Años / Experiencia
                </InputGroup.Text>
                <Form.Control
                  onChange={(e) => setExperience(e.target.value)}
                  type="number"
                  name="experience"
                  value={(experience && experience > 0) || "" ? experience : ""}
                />
              </InputGroup>
              <div className="d-flex gap-2 mb-2 justify-content-center">
                <Button
                  variant={
                    infoEmployees
                      ? "outline-success primary"
                      : "outline-success m-auto d-block"
                  }
                  type="submit"
                  onClick={infoEmployees ? update : create}
                >
                  {infoEmployees ? "Actualizar" : "Registrar"}
                </Button>

                {infoEmployees && (
                  <Button
                    variant="outline-danger secondary"
                    type="button"
                    onClick={cancel}
                  >
                    Cancelar
                  </Button>
                )}
              </div>
            </Card.Body>
          </Card>

          <section className="lista">
            <Table responsive striped bordered hover>
              <thead>
                <tr>
                  {/* Encabezados dinámicos */}
                  {tableHead.map((key, index) => (
                    <th key={index}>
                      {key === "Username"
                        ? "Usuario"
                        : key === "Age"
                        ? "Edad"
                        : key === "Country"
                        ? "País"
                        : key === "Position"
                        ? "Cargo"
                        : key === "Experience"
                        ? "Años / Experiencia"
                        : key}
                    </th>
                  ))}
                  {listEmployees && listEmployees.length > 0 ? (
                    <th>Acciones</th>
                  ) : null}
                </tr>
              </thead>
              <tbody>
                {listEmployees && listEmployees.length > 0 ? (
                  listEmployees.map(
                    (
                      employee,
                      index // <-- listaEmployees
                    ) => (
                      <tr key={index}>
                        <td>{employee.Username}</td>
                        <td>{employee.Age}</td>
                        <td>{employee.Country}</td>
                        <td>{employee.Position}</td>
                        <td>{employee.Experience}</td>
                        <td>
                          <div className="d-flex gap-2 mb-2">
                            <Button
                              variant="outline-info"
                              onClick={() => info(employee)}
                            >
                              Editar
                            </Button>
                            <Button
                              variant="outline-danger"
                              onClick={() => remove(employee.id)}
                            >
                              Eliminar
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  )
                ) : (
                  <tr>
                    <td colSpan={5}>
                      <div className="d-flex justify-content-center">
                        <h1 className="text-center">
                          No se encontraron empleados
                        </h1>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </section>
        </Stack>
      </div>
    </>
  );
}

export default App;
