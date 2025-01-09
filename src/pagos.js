import { useState, useEffect } from 'react';
import { addPagos, updatePagos, deletePagos, subscribeToPagos } from './FirebaseService';
import { Table, Button, Container, Modal, ModalBody, ModalHeader, FormGroup, ModalFooter, Input } from "reactstrap";
import { getAllAlquileres, getAllAutos } from './FirebaseService';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import './App.css';

function Pagos() {

    const [placaFiltro, setPlacaFiltro] = useState('');
    const [mesFiltro, setMesFiltro] = useState('');

    const [pagos, setPagos] = useState([]);
    const [alquileres, setAlquileres] = useState([]);
    const [autos, setAutos] = useState([]);

    const [modalInsertarPago, setModalInsertarPago] = useState(false);
    const [modalEditarPago, setModalEditarPago] = useState(false);

    const [nuevoPago, setNuevoPago] = useState({
        idAlquiler: '',
        fechaPago: '',
        diaPago: '',
        comentario: '',
        importe_pago: '',
        pago_realizado: '',
        metodo_pago: '',
        kilometraje: '',
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
            setNuevoPago({ idAlquiler: '', fechaPago: '', diaPago: '', comentario: '', importe_pago: '', pago_realizado: '', metodo_pago: '', kilometraje: '' });
        } else {
            alert("Por favor completa todos los campos requeridos.");
        }
    };

    const obtenerMes = (fecha) => {
        const fechaObj = new Date(fecha);
        return fechaObj.getMonth(); 
    };

    const handleDeletePago = async (id) => {
        await deletePagos(id);
    };

    const handleUpdatePago = async () => {
        if (editPago.idAlquiler && editPago.fechaPago && editPago.importe_pago && editPago.metodo_pago) {
            await updatePagos(editPago.id, { idAlquiler: editPago.idAlquiler, fechaPago: editPago.fechaPago, diaPago: editPago.diaPago, comentario: editPago.comentario, importe_pago: editPago.importe_pago, pago_realizado: editPago.pago_realizado, metodo_pago: editPago.metodo_pago, kilometraje: editPago.kilometraje });
            setEditPago(null);
            setModalEditarPago(false);
        } else {
            alert("Por favor completa todos los campos requeridos.");

        }
    };

    const pagosFiltrados = pagos.filter((pago) => {
        const auto = autos.find((auto) => auto.id === pago.idAlquiler);
        const mesPago = obtenerMes(pago.fechaPago);

        const filtroPlaca = placaFiltro ? auto?.placa === placaFiltro : true;
        const filtroMes = mesFiltro !== '' ? mesPago === parseInt(mesFiltro) : true;

        return filtroPlaca && filtroMes;
    });


    const totalPagosRealizados = pagosFiltrados.reduce(
        (total, pago) => total + (parseFloat(pago.pago_realizado) || 0),
        0
    );

    const totalDepositosARecibir = pagosFiltrados.reduce(
        (total, pago) => total + (parseFloat(pago.importe_pago) || 0),
        0
    );

    const obtenerDiaSemana = (fecha) => {
        const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
        const fechaObj = new Date(fecha);
        return dias[fechaObj.getDay()];
    };

    const handleFechaChange = (e) => {
        const fechaSeleccionada = e.target.value;
        const diaCorrespondiente = obtenerDiaSemana(fechaSeleccionada);

        setNuevoPago({
            ...nuevoPago,
            fechaPago: fechaSeleccionada,
            diaPago: diaCorrespondiente,
        });
    };

    const handleFechaChangeUpdate = (e) => {
        const fechaSeleccionada = e.target.value;
        const diaCorrespondiente = obtenerDiaSemana(fechaSeleccionada);

        setEditPago({
            ...editPago,
            fechaPago: fechaSeleccionada,
            diaPago: diaCorrespondiente,
        });
    };

    return (
        <div>
            <Container>
                <br />
                <Button color="success" onClick={() => setModalInsertarPago(true)}>insertar Deposito</Button>
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

                <FormGroup>
                    <label>Filtrar por Mes:</label>
                    <Input
                        type="select"
                        value={mesFiltro}
                        onChange={(e) => setMesFiltro(e.target.value)}
                    >
                        <option value="">Todos</option>
                        {['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'].map((mes, index) => (
                            <option key={index} value={index}>{mes}</option>
                        ))}
                    </Input>
                </FormGroup>

                <div>
                    <strong>Total de Depositos Realizados:</strong> S/{totalPagosRealizados.toFixed(2)}
                </div>

                <div>
                    <strong>Total de Depositos a Recibir:</strong> S/{totalDepositosARecibir.toFixed(2)}
                </div>

                <br />
                <Table>
                    <thead>
                        <tr>
                            <th>Auto alquilado</th>
                            <th>Fecha de Deposito</th>
                            <th>Dia del Deposito</th>
                            <th>Comentarios</th>
                            <th>Deposito a Realizar</th>
                            <th>Deposito realizado</th>
                            <th>Metodo de Deposito</th>
                            <th>Kilometraje</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pagosFiltrados.map((pago) => (
                            <tr key={pago.id}>
                                <td>{autos.find(auto => auto.id === pago.idAlquiler)?.placa || 'Desconocido'}</td>
                                <td>{pago.fechaPago}</td>
                                <td>{pago.diaPago}</td>
                                <td>{pago.comentario}</td>
                                <td>{'S/' + pago.importe_pago}</td>
                                <td>{'S/' + pago.pago_realizado}</td>
                                <td>{pago.metodo_pago}</td>
                                <td>{pago.kilometraje}</td>
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
                        <label>Fecha de Deposito:</label>
                        <Input
                            type="date"
                            value={nuevoPago.fechaPago}
                            onChange={handleFechaChange}
                        />
                    </FormGroup>
                    <FormGroup>
                        <label>Dia del Deposito</label>
                        <Input
                            type='text'
                            value={nuevoPago.diaPago}
                            readOnly

                        />
                    </FormGroup>
                    <FormGroup>
                        <label>Comentario</label>
                        <Input
                            type='text'
                            value={nuevoPago.comentario}
                            onChange={(e) => setNuevoPago({ ...nuevoPago, comentario: e.target.value })}
                        />
                    </FormGroup>
                    <FormGroup>
                        <label>Deposito a Realizar:</label>
                        <Input
                            type="number"
                            value={nuevoPago.importe_pago}
                            onChange={(e) => setNuevoPago({ ...nuevoPago, importe_pago: e.target.value })}
                        />
                    </FormGroup>
                    <FormGroup>
                        <label>Deposito Realizado:</label>
                        <Input
                            type="number"
                            value={nuevoPago.pago_realizado}
                            onChange={(e) => setNuevoPago({ ...nuevoPago, pago_realizado: e.target.value })}
                        />
                    </FormGroup>
                    <FormGroup>
                        <label>Metodo de Deposito:</label>
                        <Input
                            type="text"
                            value={nuevoPago.metodo_pago}
                            onChange={(e) => setNuevoPago({ ...nuevoPago, metodo_pago: e.target.value })}
                        />
                    </FormGroup>

                    <FormGroup>
                        <label>Kilometraje Recorrido:</label>
                        <Input
                            type="number"
                            value={nuevoPago.kilometraje || ''}
                            onChange={(e) => setNuevoPago({ ...nuevoPago, kilometraje: e.target.value })}
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
                        <label>Fecha de Deposito:</label>
                        <Input
                            type="date"
                            value={editPago?.fechaPago || ''}
                            onChange={handleFechaChangeUpdate}
                        />
                    </FormGroup>
                    <FormGroup>
                        <label>Dia del Deposito</label>
                        <Input
                            type='text'
                            value={editPago?.diaPago || ''}
                            readOnly

                        />
                    </FormGroup>
                    <FormGroup>
                        <label>Comentario</label>
                        <Input
                            type='text'
                            value={editPago?.comentario}
                            onChange={(e) => setEditPago({ ...editPago, comentario: e.target.value })}
                        />
                    </FormGroup>
                    <FormGroup>
                        <label>Deposito a Realizar:</label>
                        <Input
                            type="number"
                            value={editPago?.importe_pago || ''}
                            onChange={(e) => setEditPago({ ...editPago, importe_pago: e.target.value })}
                        />
                    </FormGroup>
                    <FormGroup>
                        <label>Deposito Realizado:</label>
                        <Input
                            type="number"
                            value={editPago?.pago_realizado || ''}
                            onChange={(e) => setEditPago({ ...editPago, pago_realizado: e.target.value })}
                        />
                    </FormGroup>
                    <FormGroup>
                        <label>Metodo de Deposito:</label>
                        <Input
                            type="text"
                            value={editPago?.metodo_pago || ''}
                            onChange={(e) => setEditPago({ ...editPago, metodo_pago: e.target.value })}
                        />
                    </FormGroup>

                    <FormGroup>
    <label>Kilometraje Recorrido:</label>
    <Input
        type="number"
        value={editPago?.kilometraje || ''}
        onChange={(e) => setEditPago({ ...editPago, kilometraje: e.target.value })}
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