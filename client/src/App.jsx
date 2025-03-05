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
  const [cancelEmployees, setCancelEMployees] = useState(false);
  const MySwal = withReactContent(Swal);

  const [idEmployee, setIdEmployee] = useState(0);

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
    MySwal.fire({
      title: "Error!",
      text: "Do you want to continue",
      icon: "error",
      confirmButtonText: "Cool",
    });
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
        updateEmployeeList();
      })
      .catch((err) => {
        console.log(err);
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
        alert("Empleado actualizado correctamente");
        updateEmployeeList();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const remove = (id) => {
    const confirm = window.confirm("¿Estás seguro de eliminar este empleado?");
    if (confirm) {
      setRemoveEMployees(true);

      Axios.delete(`http://localhost:3001/delete/${id}`, {
        id: id,
      })
        .then((res) => {
          alert("Empleado eliminado correctamente");
          updateEmployeeList();
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setRemoveEMployees(false);
    }
  };

  // Se hace consulta con axios, para listar empleados
  const updateEmployeeList = () => {
    Axios.get("http://localhost:3001/empleados")
      .then((res) => {
        setListEmpoyees(res.data);
        console.log(res.data);
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
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {listEmployees.map((employee, index) => (
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
                ))}
              </tbody>
            </Table>
          </section>
        </Stack>
      </div>
    </>
  );
}

export default App;
