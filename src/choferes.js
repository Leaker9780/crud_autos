import { useState, useEffect } from 'react';
import { addChofer, updateChoferes, deleteChoferes, subscribeToChoferes } from './FirebaseService';
import { Table, Button, Container, Modal, ModalBody, ModalHeader, FormGroup, ModalFooter, Input } from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import './App.css';


function Choferes() {

  const [choferes, setChoferes] = useState([]);
  const [newChofer, setNewChofer] = useState({ DNI: '', Nombre: '', telefono: '', direccion: '', razon_social: '', carnet_conducir: '' });
  const [editChofer, setEditChofer] = useState(null);

  const [modalInsertarChofer, setModalInsertarChofer] = useState(false);
  const [modalEditarChofer, setModalEditarChofer] = useState(false);


  const handleChange = (e) => {
    const { name, value } = e.target;

    if (editChofer) {
      setEditChofer((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    } else if (modalInsertarChofer) {
      setNewChofer((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  useEffect(() => {

    const unsuscribeC = subscribeToChoferes((updatedChoferes) => {
      setChoferes(updatedChoferes);
      console.log('hola');
      console.log(updateChoferes);
    })
    return () => {

      unsuscribeC();
    }
  }, []);

  const mostrarModalEditarChofer = (Registro) => {
    setModalEditarChofer(true);
    setEditChofer(Registro);
  }

  const mostrarModalInsertarChofer = () => {
    setModalInsertarChofer(true);
  }

  const ocultarModalEditarChofer = () => {
    setModalEditarChofer(false);
  }

  const ocultarModalInsertarChofer = () => {
    setModalInsertarChofer(false);
  }

  const handleAddChoferes = async () => {
    await addChofer(newChofer);
    setNewChofer({ DNI: '', Nombre: '', telefono: '', direccion: '', razon_social: '', carnet_conducir: '' })
    setModalInsertarChofer(false);
  }


  const handleUpdateChoferes = async () => {
    if (editChofer) {
      await updateChoferes(editChofer.id, { DNI: editChofer.DNI, Nombre: editChofer.Nombre, telefono: editChofer.telefono, direccion: editChofer.direccion, razon_social: editChofer.razon_social, carnet_conducir: editChofer.carnet_conducir })
      setEditChofer(null);
      setModalEditarChofer(false);
    }
  }


  const handleDeleteChoferes = async (id) => {
    await deleteChoferes(id);
  };


  return (
    <>
    <Container>
          <br />
          <Button color='success' onClick={mostrarModalInsertarChofer}>Insertar Chofer</Button>
          <br />
          <Table>
            <thead>
              <tr>
                <th>Id</th>
                <th>DNI</th>
                <th>Nombre</th>
                <th>Telefono</th>
                <th>Razon social</th>
                <th>Carnet de conducir</th>
              </tr>
            </thead>
            <tbody>
              {choferes.map((elemento) => (
                <tr key={elemento.id}>
                  <td>{elemento.id}</td>
                  <td>{elemento.DNI}</td>
                  <td>{elemento.Nombre}</td>
                  <td>{elemento.telefono}</td>
                  <td>{elemento.razon_social}</td>
                  <td>{elemento.carnet_conducir}</td>
                  <td>
                    <Button color='primary' onClick={() => mostrarModalEditarChofer(elemento)}>Editar</Button>
                    <Button color="danger" onClick={() => handleDeleteChoferes(elemento.id)}>Eliminar</Button>

                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Container>




        <Modal isOpen={modalInsertarChofer}>
          <ModalHeader>
            <div>
              <h3>Insertar Chofer</h3>
            </div>
          </ModalHeader>

          <ModalBody>
            <FormGroup>
              <label>Id:</label>
              <input className='form-control' readOnly type="text" value={choferes.length + 1} />
            </FormGroup>

            <FormGroup>
              <label>DNI:</label>
              <Input
                className="form-control"
                name="DNI"
                type="number"
                onChange={handleChange}
              />
            </FormGroup>

            <FormGroup>
              <label>Nombre:</label>
              <Input
                className="form-control"
                name="Nombre"
                type="text"
                onChange={handleChange}
              />
            </FormGroup>

            <FormGroup>
              <label>Telefono:</label>
              <Input
                className="form-control"
                name="telefono"
                type="number"
                onChange={handleChange}
              />
            </FormGroup>

            <FormGroup>
              <label>Razon social:</label>
              <Input
                className="form-control"
                name="razon_social"
                type="text"
                onChange={handleChange}
              />
            </FormGroup>

            <FormGroup>
              <label>Carnet de conducir:</label>
              <Input
                className="form-control"
                name="carnet_conducir"
                type="text"
                onChange={handleChange}
              />
            </FormGroup>
          </ModalBody>

          <ModalFooter>
            <Button color="primary" onClick={handleAddChoferes}>Añadir</Button>
            <Button color="danger" onClick={ocultarModalInsertarChofer}>Cancelar</Button>
          </ModalFooter>
        </Modal>



        <Modal isOpen={modalEditarChofer}>
          <ModalHeader>
            <div>
              <h3>Editar Chofer</h3>
            </div>
          </ModalHeader>

          <ModalBody>
            <FormGroup>
              <label>Id:</label>
              <input className='form-control' readOnly type="text" value={editChofer?.id || ''} />
            </FormGroup>

            <FormGroup>
              <label>DNI:</label>
              <Input
                className="form-control"
                name="DNI"
                type="number"
                value={editChofer?.DNI || ''}
                onChange={handleChange}
              />
            </FormGroup>

            <FormGroup>
              <label>Nombre:</label>
              <Input
                className="form-control"
                name="Nombre"
                type="text"
                value={editChofer?.Nombre || ''}
                onChange={handleChange}
              />
            </FormGroup>

            <FormGroup>
              <label>Telefono:</label>
              <Input
                className="form-control"
                name="telefono"
                type="number"
                value={editChofer?.telefono || ''}
                onChange={handleChange}
              />
            </FormGroup>

            <FormGroup>
              <label>Razon social:</label>
              <Input
                className="form-control"
                name="razon_social"
                type="text"
                value={editChofer?.razon_social || ''}
                onChange={handleChange}
              />
            </FormGroup>

            <FormGroup>
              <label>Carnet de conducir:</label>
              <Input
                className="form-control"
                name="carnet_conducir"
                type="text"
                value={editChofer?.carnet_conducir || ''}
                onChange={handleChange}
              />
            </FormGroup>
          </ModalBody>

          <ModalFooter>
            <Button color="primary" onClick={editChofer ? handleUpdateChoferes : handleAddChoferes}>{editChofer ? 'Actualizar' : 'Añadir'}</Button>
            <Button color="danger" onClick={ocultarModalEditarChofer}>Cancelar</Button>
          </ModalFooter>
        </Modal>

    </>


  )
}


export default Choferes;