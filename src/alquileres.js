import { useState, useEffect } from 'react';
import { addAlquiler, getAllAlquileres, subscribeToAlquileres, updateAlquiler, deleteAlquiler } from './FirebaseService';
import { getAllAutos } from './FirebaseService';
import { getAllChoferes } from './FirebaseService';
import { Table, Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Input, Container } from "reactstrap";

function Alquileres() {
    const [alquileres, setAlquileres] = useState([]);
    const [autos, setAutos] = useState([]);
    const [choferes, setChoferes] = useState([]);

    const [modalOpen, setModalOpen] = useState(false);

    const [modalEditarAlquiler, setModalEditarAlquiler] = useState(false);

    const [editAlquiler, setEditAlquiler] = useState(null);
    const [nuevoAlquiler, setNuevoAlquiler] = useState({
        idAuto: '',
        idChofer: '',
        fechaInicio: '',
        fechaFin: '',
        importe: '',
        garantia: '',
        comentarios: '',
    });

    useEffect(() => {
        getAllAutos().then(setAutos);
        getAllChoferes().then(setChoferes);

        const unsubscribe = subscribeToAlquileres(setAlquileres);
        return () => unsubscribe();
    }, []);

    const handleAddAlquiler = async () => {
        if (nuevoAlquiler.idAuto && nuevoAlquiler.idChofer && nuevoAlquiler.fechaInicio) {
            await addAlquiler(nuevoAlquiler);
            setModalOpen(false);
            setNuevoAlquiler({ idAuto: '', idChofer: '', fechaInicio: '', fechaFin: '', importe: '', garantia: '', comentarios: '' });
        } else {
            alert("Por favor completa todos los campos requeridos.");
        }
    };

    const handleUpdateAlquiler = async () => {

        if (!editAlquiler || !editAlquiler.id) {
            await updateAlquiler(editAlquiler.id, { idAuto: editAlquiler.idAuto, idChofer: editAlquiler.idChofer, fechaInicio: editAlquiler.fechaInicio, fechaFin: editAlquiler.fechaFin, importe: editAlquiler.importe, garantia: editAlquiler.garantia, comentarios: editAlquiler.comentarios });
            setEditAlquiler(null);
            setModalEditarAlquiler(false);
        }
    }

    const handleDeleteAlquiler = async (id) => {
        await deleteAlquiler(id);
    };


    return (
        <div>
            <Container>
                <br />
                <Button color="success" onClick={() => setModalOpen(true)}>insertar Alquiler</Button>
                <br />
                <Table>
                    <thead>
                        <tr>
                            <th>Fecha Inicio</th>
                            <th>Fecha Fin</th>
                            <th>Auto</th>
                            <th>Chofer</th>
                            <th>Importe de alquiler</th>
                            <th>Garantia</th>
                            <th>Comentarios</th>
                        </tr>
                    </thead>
                    <tbody>
                        {alquileres.map((alquiler) => (
                            <tr key={alquiler.id}>
                                <td>{alquiler.fechaInicio}</td>
                                <td>{alquiler.fechaFin || 'Activo'}</td>
                                <td>{autos.find(auto => auto.id === alquiler.idAuto)?.placa || 'Desconocido'}</td>
                                <td>{choferes.find(chofer => chofer.id === alquiler.idChofer)?.Nombre || 'Desconocido'}</td>
                                <td>{'S/' + alquiler.importe}</td>
                                <td>{'S/' + alquiler.garantia}</td>
                                <td>{alquiler.comentarios}</td>
                                <td>

                                    <Button
                                        color="primary"
                                        onClick={() => {
                                            setEditAlquiler(alquiler);
                                            setModalEditarAlquiler(true);
                                        }}
                                    >
                                        Editar
                                    </Button>

                                    <Button color="danger" onClick={() => handleDeleteAlquiler(alquiler.id)}>Eliminar</Button>
                                </td>
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

                    <FormGroup>
                        <label>Importe de alquiler:</label>
                        <Input
                            type="number"
                            value={nuevoAlquiler.importe}
                            onChange={(e) => setNuevoAlquiler({ ...nuevoAlquiler, importe: e.target.value })}
                        />
                    </FormGroup>

                    <FormGroup>
                        <label>Garantia:</label>
                        <Input
                            type="number"
                            value={nuevoAlquiler.garantia}
                            onChange={(e) => setNuevoAlquiler({ ...nuevoAlquiler, garantia: e.target.value })}
                        />
                    </FormGroup>
                    
                    <FormGroup>
                        <label>Comentarios:</label>
                        <Input
                            type="text"
                            value={nuevoAlquiler.comentarios}
                            onChange={(e) => setNuevoAlquiler({ ...nuevoAlquiler, comentarios: e.target.value })}
                        />
                    </FormGroup>

                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={handleAddAlquiler}>Guardar</Button>
                    <Button color="secondary" onClick={() => setModalOpen(false)}>Cancelar</Button>
                </ModalFooter>
            </Modal>



            <Modal isOpen={modalEditarAlquiler} toggle={() => setModalEditarAlquiler(!modalEditarAlquiler)}>
                <ModalHeader toggle={() => setModalEditarAlquiler(!modalEditarAlquiler)}>Editar Alquiler</ModalHeader>
                <ModalBody>
                    <FormGroup>
                        <label>Auto:</label>
                        <Input
                            type="select"
                            value={editAlquiler?.idAuto}
                            onChange={(e) => setEditAlquiler({ ...editAlquiler, idAuto: e.target.value })}
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
                            value={editAlquiler?.idChofer}
                            onChange={(e) => setEditAlquiler({ ...editAlquiler, idChofer: e.target.value })}
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
                            value={editAlquiler?.fechaInicio}
                            onChange={(e) => setEditAlquiler({ ...editAlquiler, fechaInicio: e.target.value })}
                        />
                    </FormGroup>
                    <FormGroup>
                        <label>Fecha de Fin:</label>
                        <Input
                            type="date"
                            value={editAlquiler?.fechaFin}
                            onChange={(e) => setEditAlquiler({ ...editAlquiler, fechaFin: e.target.value })}
                        />
                    </FormGroup>

                    <FormGroup>
                        <label>Importe de alquiler:</label>
                        <Input
                            type="number"
                            value={editAlquiler?.importe}
                            onChange={(e) => setEditAlquiler({ ...editAlquiler, importe: e.target.value })}
                        />
                    </FormGroup>

                    <FormGroup>
                        <label>Garantia:</label>
                        <Input
                            type="number"
                            value={editAlquiler?.garantia}
                            onChange={(e) => setEditAlquiler({ ...editAlquiler, garantia: e.target.value })}
                        />
                    </FormGroup>
                    
                    <FormGroup>
                        <label>Comentarios:</label>
                        <Input
                            type="text"
                            value={editAlquiler?.comentarios}
                            onChange={(e) => setEditAlquiler({ ...editAlquiler, comentarios: e.target.value })}
                        />
                    </FormGroup>

                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={handleUpdateAlquiler}>Actualizar</Button>
                    <Button color="secondary" onClick={() => setModalEditarAlquiler(false)}>Cancelar</Button>
                </ModalFooter>
            </Modal>

        </div>
    );
}

export default Alquileres;
