import React, { useState, useEffect } from 'react';
import { Button, Modal, Table, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    const [usuarios, setUsuarios] = useState([]);
    const [showAgregarModal, setShowAgregarModal] = useState(false);
    const [nombreUsuario, setNombreUsuario] = useState('');
    const [usuarioSeleccionadoID, setUsuarioSeleccionadoID] = useState(null);

    useEffect(() => {
        // Carga la lista de usuarios al cargar la página
        cargarUsuarios();
    }, []);

    const cargarUsuarios = async () => {
        try {
            const response = await fetch('http://localhost:5031/api/usuarios');
            if (response.ok) {
                const data = await response.json();
                setUsuarios(data);
            }
        } catch (error) {
            console.error('Error al cargar la lista de usuarios', error);
        }
    };

    const mostrarAgregarModal = () => {
        setShowAgregarModal(true);
    };

    const cerrarAgregarModal = () => {
        setShowAgregarModal(false);
    };

    const crearUsuario = async () => {
      try {
          const nuevoUsuario = {
              usuarioID: usuarioSeleccionadoID, // Utiliza el ID del usuario seleccionado
              nombre: nombreUsuario,
              reservas: [
                  {
                      reservaID: 1,
                      usuarioID: usuarioSeleccionadoID, // Utiliza el ID del usuario seleccionado
                      aplicacionID: 0,
                      fechaReserva: "2023-09-09T21:38:49.659Z",
                      duracionDias: 0,
                      usuario: "string",
                      aplicacion: {
                          aplicacionID: 0,
                          nombre: "string",
                          reservas: ["string"]
                      }
                  }
              ]
          };
  
          const response = await fetch('http://localhost:5031/api/usuarios', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(nuevoUsuario),
          });
  
          if (response.status === 201) {
              cargarUsuarios();
              setNombreUsuario('');
              cerrarAgregarModal();
          }
      } catch (error) {
          console.error('Error al crear un usuario', error);
      }
  };

  const eliminarUsuario = async () => {
    if (!usuarioSeleccionadoID) {
        return; // No se seleccionó ningún usuario para eliminar
    }
    
    try {
        const response = await fetch(`http://localhost:5031/api/usuarios/${usuarioSeleccionadoID}`, {
            method: 'DELETE',
        });

        if (response.status === 204) {
            cargarUsuarios();
            setUsuarioSeleccionadoID(null); // Reiniciar el usuario seleccionado
        }
    } catch (error) {
        console.error('Error al eliminar un usuario', error);
    }
};

    return (
        <div className="container">
            <h1>Administración de Usuarios</h1>

            <Button variant="primary" onClick={mostrarAgregarModal}>
                Agregar Usuario
            </Button>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {usuarios.map((usuario) => (
                        <tr key={usuario.usuarioID}>
                            <td>{usuario.nombre}</td>
                            <td>
                                <Button variant="info" onClick={() => setUsuarioSeleccionadoID(usuario.usuarioID)}>Editar</Button>{' '}
                                <Button variant="danger" onClick={eliminarUsuario}>Eliminar</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={showAgregarModal} onHide={cerrarAgregarModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Agregar Usuario</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="nombreUsuario">
                            <Form.Label>Nombre de Usuario</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ingrese el nombre de usuario"
                                value={nombreUsuario}
                                onChange={(e) => setNombreUsuario(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={cerrarAgregarModal}>
                        Cerrar
                    </Button>
                    <Button variant="primary" onClick={crearUsuario}>
                        Guardar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default App;
