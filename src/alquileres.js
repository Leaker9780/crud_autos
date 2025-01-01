import { useState, useEffect } from 'react';
import { addAlquiler, getAllAlquileres, subscribeToAlquileres } from './FirebaseService';
import { getAllAutos } from './FirebaseService';
import { getAllChoferes } from './FirebaseService';
import { Table, Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Input, Container } from "reactstrap";

function Alquileres() {
    const [alquileres, setAlquileres] = useState([]);
    const [autos, setAutos] = useState([]);
    const [choferes, setChoferes] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [nuevoAlquiler, setNuevoAlquiler] = useState({
        idAuto: '',
        idChofer: '',
        fechaInicio: '',
        fechaFin: '',
    });

    useEffect(() => {
        // Cargar autos, choferes y alquileres
        getAllAutos().then(setAutos);
        getAllChoferes().then(setChoferes);

        const unsubscribe = subscribeToAlquileres(setAlquileres);
        return () => unsubscribe();
    }, []);

    const handleAddAlquiler = async () => {
        if (nuevoAlquiler.idAuto && nuevoAlquiler.idChofer && nuevoAlquiler.fechaInicio) {
            await addAlquiler(nuevoAlquiler);
            setModalOpen(false);
            setNuevoAlquiler({ idAuto: '', idChofer: '', fechaInicio: '', fechaFin: '' });
        } else {
            alert("Por favor completa todos los campos requeridos.");
        }
    };

    return (
        <div>
          <Container>
            <br/>
                <Button color="success" onClick={() => setModalOpen(true)}>insertar Alquiler</Button>
            <br/>
            <Table>
                <thead>
                    <tr>
                    <th>Fecha Inicio</th>
                    <th>Fecha Fin</th>
                    <th>Auto</th>
                    <th>Chofer</th>
                       
                    </tr>
                </thead>
                <tbody>
                    {alquileres.map((alquiler) => (
                        <tr key={alquiler.id}>
                            <td>{alquiler.fechaInicio}</td>
                            <td>{alquiler.fechaFin || 'Activo'}</td>
                            <td>{autos.find(auto => auto.id === alquiler.idAuto)?.placa || 'Desconocido'}</td>
                            <td>{choferes.find(chofer => chofer.id === alquiler.idChofer)?.Nombre || 'Desconocido'}</td>
                      
                        </tr>
                    ))}
                </tbody>
            </Table>
            </Container>
            
            <Modal isOpen={modalOpen} toggle={() => setModalOpen(!modalOpen)}>
                <ModalHeader toggle={() => setModalOpen(!modalOpen)}>Añadir Alquiler</ModalHeader>
                <ModalBody>
                    <FormGroup>
                        <label>Auto:</label>
                        <Input
                            type="select"
                            value={nuevoAlquiler.idAuto}
                            onChange={(e) => setNuevoAlquiler({ ...nuevoAlquiler, idAuto: e.target.value })}
                        >
                            <option value="">Seleccionar</option>
                            {autos.map((auto) => (
                                <option key={auto.id} value={auto.id}>{auto.placa}-{auto.marca}</option>
                            ))}
                        </Input>
                    </FormGroup>
                    <FormGroup>
                        <label>Chofer:</label>
                        <Input
                            type="select"
                            value={nuevoAlquiler.idChofer}
                            onChange={(e) => setNuevoAlquiler({ ...nuevoAlquiler, idChofer: e.target.value })}
                        >
                            <option value="">Seleccionar</option>
                            {choferes.map((chofer) => (
                                <option key={chofer.id} value={chofer.id}>{chofer.Nombre}</option>
                            ))}
                        </Input>
                    </FormGroup>
                    <FormGroup>
                        <label>Fecha de Inicio:</label>
                        <Input
                            type="date"
                            value={nuevoAlquiler.fechaInicio}
                            onChange={(e) => setNuevoAlquiler({ ...nuevoAlquiler, fechaInicio: e.target.value })}
                        />
                    </FormGroup>
                    <FormGroup>
                        <label>Fecha de Fin:</label>
                        <Input
                            type="date"
                            value={nuevoAlquiler.fechaFin}
                            onChange={(e) => setNuevoAlquiler({ ...nuevoAlquiler, fechaFin: e.target.value })}
                        />
                    </FormGroup>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={handleAddAlquiler}>Guardar</Button>
                    <Button color="secondary" onClick={() => setModalOpen(false)}>Cancelar</Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}

export default Alquileres;
