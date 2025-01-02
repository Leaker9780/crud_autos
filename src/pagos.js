import { useState, useEffect } from 'react';
import { addPagos, updatePagos, deletePagos, subscribeToPagos } from './FirebaseService';
import { Table, Button, Container, Modal, ModalBody, ModalHeader, FormGroup, ModalFooter, Input } from "reactstrap";
import { getAllAlquileres } from './FirebaseService';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import './App.css';

function Pagos() {

    const [pagos, setPagos] = useState([]);
    const [alquileres, setAlquileres] = useState([]);

    const [modalInsertarPago, setModalInsertarPago] = useState(false);
    const [modalEditarPago, setModalEditarPago] = useState(false);

    const [nuevoPago, setNuevoPago] = useState({
        idAlquiler: '',
        fechaPago: '',
        importe_pago: '',
        metodo_pago: '',
    });

    useEffect(() => {
        getAllAlquileres().then(setAlquileres);

        const unsubscribe = subscribeToPagos(setPagos);
        return () => unsubscribe();
    }, [])

    const handleAddPago = async () => {
        if (nuevoPago.idAlquiler && nuevoPago.fechaPago && nuevoPago.importe_pago && nuevoPago.metodo_pago) {
            await addPagos(nuevoPago);
            setModalInsertarPago(false);
            setNuevoPago({ idAlquiler: '', fechaPago: '', importe_pago: '', metodo_pago: '' });
        } else {
            alert("Por favor completa todos los campos requeridos.");
        }
    };

    const handleDeletePago = async (id) => {
        await deletePagos(id);
    };


    return (
        <div>
            <Container>
                <br />
                <Button color="success" onClick={() => setModalInsertarPago(true)}>insertar Pago</Button>
                <br />
                <Table>
                    <thead>
                        <tr>
                            <th>Auto alquilado</th>
                            <th>Fecha de pago</th>
                            <th>Importe de pago</th>
                            <th>metodo de pago</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pagos.map((pago) => (
                            <tr key={pago.id}>
                                <td>{alquileres.find(alquiler => alquiler.id === Pagos.idAlquiler)?.idAuto || 'Desconocido'}</td>
                                <td>{pago.fechaPago}</td>
                                <td>{pago.importe_pago}</td>
                                <td>{pago.metodo_pago}</td>
                                <td>
                                    <Button color='primary' onClick={() => setModalEditarPago(true)}>Editar</Button>
                                    <Button color="danger" onClick={() => handleDeletePago(pago.id)}>Eliminar</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Container>

            <Modal isOpen={modalInsertarPago} toggle={() => setModalInsertarPago(!modalInsertarPago)}>
                <ModalHeader toggle={() => setModalInsertarPago(!modalInsertarPago)}>Añadir Pago</ModalHeader>
                <ModalBody>
                    <FormGroup>
                        <label>Auto:</label>
                        <Input
                            type="select"
                            value={nuevoPago.idAlquiler}
                            onChange={(e) => setNuevoPago({ ...nuevoPago, idAlquiler: e.target.value })}
                        >
                            <option value="">Seleccionar</option>
                            {alquileres.map((auto) => (
                                <option key={auto.id} value={auto.id}>{auto.idAuto}</option>
                            ))}
                        </Input>
                    </FormGroup>
                    <FormGroup>
                        <label>Fecha de Pago:</label>
                        <Input
                            type="date"
                            value={nuevoPago.fechaPago}
                            onChange={(e) => setNuevoPago({ ...nuevoPago, fechaPago: e.target.value })}
                        />
                    </FormGroup>
                    <FormGroup>
                        <label>Importe de pago:</label>
                        <Input
                            type="number"
                            value={alquileres.importe}
                            onChange={(e) => setNuevoPago({ ...nuevoPago, importe_pago: e.target.value })}
                        />
                    </FormGroup>

                    <FormGroup>
                        <label>Metodo de pago:</label>
                        <Input
                            type="text"
                            value={nuevoPago.metodo_pago}
                            onChange={(e) => setNuevoPago({ ...nuevoPago, metodo_pago: e.target.value })}
                        />
                    </FormGroup>

                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={handleAddPago}>Guardar</Button>
                    <Button color="secondary" onClick={() => setModalInsertarPago(false)}>Cancelar</Button>
                </ModalFooter>
            </Modal>



           
        </div>
    );
}

export default Pagos;