import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Button, Table, Modal, Form } from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [usuarios, setUsuarios] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState({
    id: 0,
    nombre: '',
  });

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    const response = await axios.get('http://localhost:5031/api/usuarios');
    setUsuarios(response.data);
  };

  const handleShowModal = (usuario) => {
    setSelectedUsuario(usuario);
    setShowModal(true);
  };

  const handleAddUsuario = () => {
    setSelectedUsuario({ id: 0, nombre: '' }); // Agregar un nuevo usuario
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedUsuario({ id: 0, nombre: '' }); // Reiniciar el usuario seleccionado
    setShowModal(false);
  };

  const handleDeleteUsuario = async (id) => {
    await axios.delete(`http://localhost:5031/api/usuarios/${id}`);
    fetchUsuarios();
  };

  const handleSaveUsuario = async () => {
    if (selectedUsuario.id === 0) {
      // Agregar un nuevo usuario
      await axios.post('http://localhost:5031/api/usuarios', selectedUsuario);
    } else {
      // Editar un usuario existente
      await axios.put(`http://localhost:5031/api/usuarios/${selectedUsuario.id}`, selectedUsuario);
    }
    fetchUsuarios();
    handleCloseModal();
  };

  const generarInformeReservas = async () => {
    // Aquí puedes enviar una solicitud al servidor para generar el informe
    // Puedes utilizar axios u otra biblioteca para hacer la solicitud
    // El servidor debe proporcionar una ruta para generar el informe
  };

  return (
    <Container>
      <h1 className="my-4">Administración de Usuarios</h1>
      <Button variant="primary" className="mb-3" onClick={handleAddUsuario}>
        Agregar Usuario
      </Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.id}>
              <td>{usuario.id ? usuario.id.toString() : ''}</td>
              <td>{usuario.nombre}</td>
              <td>
                <Button variant="info" onClick={() => handleShowModal(usuario)}>Editar</Button>{' '}
                <Button variant="danger" onClick={() => handleDeleteUsuario(usuario.id)}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Button variant="success" onClick={generarInformeReservas} className="mb-4">
        Generar Informe de Reservas
      </Button>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedUsuario.id === 0 ? 'Agregar Usuario' : 'Editar Usuario'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formNombre">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el nombre"
                value={selectedUsuario.nombre}
                onChange={(e) => setSelectedUsuario({ ...selectedUsuario, nombre: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Cerrar</Button>
          <Button variant="primary" onClick={handleSaveUsuario}>Guardar</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default App;
