import { useState, useEffect } from 'react';
import { addAuto, updateAutos, deleteAutos, subscribeToAutos } from './FirebaseService';
import { addChofer, updateChoferes, deleteChoferes, subscribeToChoferes } from './FirebaseService';
import { Table, Button, Container, Modal, ModalBody, ModalHeader, FormGroup, ModalFooter, Input } from "reactstrap";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import './App.css';
import Autos from './autos';
import Choferes from './choferes';
import Alquileres from './alquileres';

function App() {


  return (
 <Router>
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="#home">Alquiler autos</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to='/autos'>Autos</Nav.Link>
            <Nav.Link as={Link} to ='/choferes'>Choferes</Nav.Link>
            <Nav.Link as={Link} to='/alquileres'>Alquileres</Nav.Link>
            <Nav.Link as={Link} to ='/pagos'>Pagos</Nav.Link>
            
          </Nav>
        </Navbar.Collapse>
      </Container>
      
    </Navbar>

    <Routes>
        <Route path="/autos" element={<Autos />} />
        <Route path="/choferes" element={<Choferes />} />
        <Route path="/alquileres" element={<Alquileres />} />
      </Routes>
  </Router>
  );
}

export default App;
