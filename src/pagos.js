import { useState, useEffect } from 'react';
import { addPagos, updatePagos, deletePagos, subscribeToPagos } from './FirebaseService';
import { Table, Button, Container, Modal, ModalBody, ModalHeader, FormGroup, ModalFooter, Input } from "reactstrap";
import { getAllAlquileres, getAllAutos } from './FirebaseService';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import './App.css';

function Pagos() {

    const [placaFiltro, setPlacaFiltro] = useState('');

    const [pagos, setPagos] = useState([]);
    const [alquileres, setAlquileres] = useState([]);
    const [autos, setAutos] = useState([]);

    const [modalInsertarPago, setModalInsertarPago] = useState(false);
    const [modalEditarPago, setModalEditarPago] = useState(false);

    const [nuevoPago, setNuevoPago] = useState({
        idAlquiler: '',
        fechaPago: '',
        importe_pago: '',
        pago_realizado: '',
        metodo_pago: '',
    });
    const [editPago, setEditPago] = useState(null);

    useEffect(() => {
        getAllAlquileres().then(setAlquileres);
        getAllAutos().then(setAutos);

        const unsubscribe = subscribeToPagos(setPagos);
        return () => unsubscribe();
    }, [])

    const handleAddPago = async () => {
        if (nuevoPago.idAlquiler && nuevoPago.fechaPago && nuevoPago.importe_pago && nuevoPago.metodo_pago) {
            await addPagos(nuevoPago);
            setModalInsertarPago(false);
            setNuevoPago({ idAlquiler: '', fechaPago: '', importe_pago: '', pago_realizado: '', metodo_pago: '' });
        } else {
            alert("Por favor completa todos los campos requeridos.");
        }
    };

    const handleDeletePago = async (id) => {
        await deletePagos(id);
    };

    const handleUpdatePago = async () => {
        if (editPago.idAlquiler && editPago.fechaPago && editPago.importe_pago && editPago.metodo_pago) {
            await updatePagos(editPago.id, { idAlquiler: editPago.idAlquiler, fechaPago: editPago.fechaPago, importe_pago: editPago.importe_pago, pago_realizado: editPago.pago_realizado, metodo_pago: editPago.metodo_pago });
            setEditPago(null);
            setModalEditarPago(false);
        } else {
            alert("Por favor completa todos los campos requeridos.");

        }
    };

    const pagosFiltrados = placaFiltro
        ? pagos.filter((pago) => {
            const auto = autos.find((auto) => auto.id === pago.idAlquiler);
            return auto?.placa === placaFiltro;
        })
        : pagos;


    const totalPagosRealizados = pagosFiltrados.reduce(
        (total, pago) => total + (parseFloat(pago.pago_realizado) || 0),
        0
    );

    return (
        <div>
            <Container>
                <br />
                <Button color="success" onClick={() => setModalInsertarPago(true)}>insertar Pago</Button>
                <br />
                <FormGroup>
                    <label>Filtrar por Placa:</label>
                    <Input
                        type="select"
                        value={placaFiltro}
                        onChange={(e) => setPlacaFiltro(e.target.value)}
                    >
                        <option value="">Todas</option>
                        {autos.map((auto) => (
                            <option key={auto.id} value={auto.placa}>{auto.placa}</option>
                        ))}
                    </Input>
                </FormGroup>

                <div>
                    <strong>Total Pagos Realizados:</strong> S/{totalPagosRealizados.toFixed(2)}
                </div>

                <br />
                <Table>
                    <thead>
                        <tr>
                            <th>Auto alquilado</th>
                            <th>Fecha de pago</th>
                            <th>Pago a Realizar</th>
                            <th>Pago realizado</th>
                            <th>metodo de pago</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pagosFiltrados.map((pago) => (
                            <tr key={pago.id}>
                                <td>{autos.find(auto => auto.id === pago.idAlquiler)?.placa || 'Desconocido'}</td>
                                <td>{pago.fechaPago}</td>
                                <td>{pago.importe_pago}</td>
                                <td>{pago.pago_realizado}</td>
                                <td>{pago.metodo_pago}</td>
                                <td>
                                    <Button
                                        color='primary'
                                        onClick={() => {
                                            setEditPago(pago);
                                            setModalEditarPago(true);
                                        }}
                                    >
                                        Editar
                                    </Button>
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
                            {autos.map((auto) => (
                                <option key={auto.id} value={auto.id}>{auto.placa}</option>
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
                        <label>Pago a Realizar:</label>
                        <Input
                            type="number"
                            value={nuevoPago.importe_pago}
                            onChange={(e) => setNuevoPago({ ...nuevoPago, importe_pago: e.target.value })}
                        />
                    </FormGroup>
                    <FormGroup>
                        <label>Pago Realizado:</label>
                        <Input
                            type="number"
                            value={nuevoPago.pago_realizado}
                            onChange={(e) => setNuevoPago({ ...nuevoPago, pago_realizado: e.target.value })}
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


            <Modal isOpen={modalEditarPago} toggle={() => setModalEditarPago(!modalEditarPago)}>
                <ModalHeader toggle={() => setModalEditarPago(!modalEditarPago)}>Editar Pago</ModalHeader>
                <ModalBody>
                    <FormGroup>
                        <label>Auto:</label>
                        <Input
                            type="select"
                            value={editPago?.idAlquiler || ''}
                            onChange={(e) => setEditPago({ ...editPago, idAlquiler: e.target.value })}
                        >
                            <option value="">Seleccionar</option>
                            {autos.map((auto) => (
                                <option key={auto.id} value={auto.id}>{auto.placa}</option>
                            ))}
                        </Input>
                    </FormGroup>
                    <FormGroup>
                        <label>Fecha de Pago:</label>
                        <Input
                            type="date"
                            value={editPago?.fechaPago || ''}
                            onChange={(e) => setEditPago({ ...editPago, fechaPago: e.target.value })}
                        />
                    </FormGroup>
                    <FormGroup>
                        <label>Importe de pago:</label>
                        <Input
                            type="number"
                            value={editPago?.importe_pago || ''}
                            onChange={(e) => setEditPago({ ...editPago, importe_pago: e.target.value })}
                        />
                    </FormGroup>
                    <FormGroup>
                        <label>Pago Realizado:</label>
                        <Input
                            type="number"
                            value={editPago?.pago_realizado || ''}
                            onChange={(e) => setEditPago({ ...editPago, pago_realizado: e.target.value })}
                        />
                    </FormGroup>
                    <FormGroup>
                        <label>Metodo de pago:</label>
                        <Input
                            type="text"
                            value={editPago?.metodo_pago || ''}
                            onChange={(e) => setEditPago({ ...editPago, metodo_pago: e.target.value })}
                        />
                    </FormGroup>

                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={handleUpdatePago}>Actualizar</Button>
                    <Button color="secondary" onClick={() => setModalEditarPago(false)}>Cancelar</Button>
                </ModalFooter>
            </Modal>


        </div>
    );
}

export default Pagos;