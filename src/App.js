import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container'; // Importación corregida
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import './App.css';
import Autos from './autos';
import Choferes from './choferes';
import Alquileres from './alquileres';
import Pagos from './pagos';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  return (
    <Router>
      <Navbar expand="lg" className={`${isDarkMode ? 'navbar-dark bg-dark' : 'navbar-light bg-light'}`}>

        <Container>
          <Navbar.Brand href="#home">Alquiler Autos</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to='/autos'>Autos</Nav.Link>
              <Nav.Link as={Link} to='/choferes'>Choferes</Nav.Link>
              <Nav.Link as={Link} to='/alquileres'>Alquileres</Nav.Link>
              <Nav.Link as={Link} to='/pagos'>Depositos</Nav.Link>
            </Nav>
            <button onClick={toggleDarkMode} className="btn btn-outline-secondary">
              {isDarkMode ? 'Modo Claro' : 'Modo Oscuro'}
            </button>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Routes>
        <Route path="/autos" element={<Autos />} />
        <Route path="/choferes" element={<Choferes />} />
        <Route path="/alquileres" element={<Alquileres />} />
        <Route path="/pagos" element={<Pagos />} />
      </Routes>
    </Router>
  );
}

export default App;
