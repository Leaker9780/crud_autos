import { useState, useEffect } from 'react';
import { addAuto, updateAutos, deleteAutos, subscribeToAutos } from './FirebaseService';
import { Table, Button, Container, Modal, ModalBody, ModalHeader, FormGroup, ModalFooter, Input} from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import './App.css';

function Autos() {
const [autos, setAutos] = useState([]);
const [newAuto, setNewAuto] = useState({ placa: '', marca: '', modelo: '', kilometraje: '', mantenimiento: '', comentarios: ''});
const [editAuto, setEditAuto] = useState(null);


const [modalInsertarAuto, setModalInsertarAuto] = useState(false);
const [modalEditarAuto, setModalEditarAuto] = useState(false);


const handleChange = (e) => {
    const { name, value } = e.target;
  
    if (editAuto) {
      setEditAuto((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    } else if (modalInsertarAuto) {
      setNewAuto((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    } 
  };

  useEffect(() =>{
  
    const unsuscribeA = subscribeToAutos((updatedAutos) => {
      setAutos(updatedAutos);
      console.log('hola');
            console.log(updateAutos);
    });
  
   
    return () => {
      unsuscribeA();
    }
  }, []);
  
  
const mostrarModalEditarAuto = (Registro) => {
    setModalEditarAuto(true);
    setEditAuto(Registro);
  }
  const mostrarModalInsertarAuto = () => {
    setModalInsertarAuto(true);
  }
  const ocultarModalEditarAuto = () => {
    setModalEditarAuto(false);
  }
  const ocultarModalInsertarAuto = () => {
    setModalInsertarAuto(false);
  }


const handleAddAutos = async() => {
    await addAuto(newAuto);
    setNewAuto({placa: '', marca: '', modelo: '', kilometraje: '', mantenimiento: '', comentarios: ''})
    ocultarModalInsertarAuto();
}

const handleUpdateAutos = async() => {
  if (editAuto) {
    await updateAutos(editAuto.id, {placa: editAuto.placa, marca: editAuto.marca, modelo: editAuto.modelo , kilometraje: editAuto.kilometraje, mantenimiento: editAuto.mantenimiento, comentarios: editAuto.comentarios})
    setEditAuto(null);
    ocultarModalEditarAuto();
  }
}

const handleDeleteAutos = async (id) => {
    await deleteAutos(id);
  };


  return ( 
    <>
     <Container>
      <br/>
        <Button  color='success' onClick={mostrarModalInsertarAuto}>Insertar un Auto</Button>
      <br/>
      <Table>
        <thead>
          <tr>
            <th>Placa</th>
            <th>Marca</th>
            <th>Modelo</th>
            <th>Kilometraje</th>
            <th>Fecha ultimo Mantenimiento</th>
            <th>Comentarios</th>
          </tr>
        </thead>
        <tbody>
          {autos.map((elemento) => (
            <tr key={elemento.id}>
              <td>{elemento.placa}</td>
              <td>{elemento.marca}</td>
              <td>{elemento.modelo}</td>
              <td>{elemento.kilometraje}</td>
              <td>{elemento.mantenimiento}</td>
              <td>{elemento.comentarios}</td>
              <td>
                <Button color='primary' onClick={() => mostrarModalEditarAuto(elemento)}>Editar</Button>
                <Button color="danger" onClick={() => handleDeleteAutos(elemento.id)}>Eliminar</Button>

              </td>
            </tr>
          ))}
        </tbody>
      </Table>

    </Container>



    <Modal isOpen={modalEditarAuto}>
          <ModalHeader>
            <div>
              <h3>Editar Auto</h3>
            </div>
          </ModalHeader>

          <ModalBody>
            <FormGroup>
              <label>Id:</label>
              <input className='form-control' readOnly type="text" value={editAuto?.id || ''} />
            </FormGroup>

            <FormGroup>
              <label>Placa:</label>
              <Input
                className="form-control"
                name="placa"
                type="text"
                value={editAuto?.placa || ''} 
                onChange={handleChange}
              />
            </FormGroup>

            <FormGroup>
              <label>Marca:</label>
              <Input
                className="form-control"
                name="marca"
                type="text"
                value={editAuto?.marca || ''}
                onChange={handleChange}
              />
            </FormGroup>

            <FormGroup>
              <label>Modelo:</label>
              <Input
                className="form-control"
                name="modelo"
                type="text"
                value={editAuto?.modelo || ''}
                onChange={handleChange}
              />
            </FormGroup>


            <FormGroup>
              <label>Kilometraje:</label>
              <Input
                className="form-control"
                name="kilometraje"
                type="number"
                value={editAuto?.kilometraje || ''}
                onChange={handleChange}
              />
            </FormGroup>

            <FormGroup>
              <label>Mantenimiento:</label>
              <Input
                className="form-control"
                name="mantenimiento"
                type="text"
                value={editAuto?.mantenimiento || ''}
                onChange={handleChange}
              />
            </FormGroup>

            <FormGroup>
              <label>Comentarios:</label>
              <Input
                className="form-control"
                name="comentarios"
                type="text"
                value={editAuto?.comentarios || ''}
                onChange={handleChange}
              />
            </FormGroup>
          </ModalBody>

          <ModalFooter>
            <Button color="primary" onClick={editAuto ? handleUpdateAutos: handleAddAutos}>{editAuto ? 'Actualizar' : 'Añadir'}</Button>
            <Button color="danger" onClick={ocultarModalEditarAuto}>Cancelar</Button>          
          </ModalFooter>
    </Modal>



    <Modal isOpen={modalInsertarAuto}>
          <ModalHeader>
            <div>
              <h3>Insertar Auto</h3>
            </div>
          </ModalHeader>

          <ModalBody>
            <FormGroup>
              <label>Id:</label>
              <input className='form-control' readOnly type="text" value={autos.length + 1} />
            </FormGroup>

            <FormGroup>
              <label>Placa:</label>
              <Input
                className="form-control"
                name="placa"
                type="text"
                onChange={handleChange}
              />
            </FormGroup>

            <FormGroup>
              <label>Marca:</label>
              <Input
                className="form-control"
                name="marca"
                type="text"
                onChange={handleChange}
              />
            </FormGroup>

            <FormGroup>
              <label>Modelo:</label>
              <Input
                className="form-control"
                name="modelo"
                type="text"
                value={editAuto?.modelo || ''}
                onChange={handleChange}
              />
            </FormGroup>

            <FormGroup>
              <label>Kilometraje:</label>
              <Input
                className="form-control"
                name="kilometraje"
                type="number"
                onChange={handleChange}
              />
            </FormGroup>

            <FormGroup>
              <label>Mantenimiento:</label>
              <Input
                className="form-control"
                name="mantenimiento"
                type="text"
                onChange={handleChange}
              />
            </FormGroup>

            <FormGroup>
              <label>Comentarios:</label>
              <Input
                className="form-control"
                name="comentarios"
                type="text"
                onChange={handleChange}
              />
            </FormGroup>
          </ModalBody>

          <ModalFooter>
            <Button color="primary" onClick={handleAddAutos}>Añadir</Button>
            <Button color="danger" onClick={ocultarModalInsertarAuto}>Cancelar</Button>          
          </ModalFooter>
    </Modal>
    </>
  )
}

export default Autos;

