import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { RoutesNames } from '../constants';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'

import './NavBar.css';

function NavBar() {

const navigate = useNavigate();

  return (
    <Navbar expand="lg" className="bg-body-tertiary"  data-bs-theme="dark">
      <Container>
        <Navbar.Brand className='navbar1' 
        onClick={()=>navigate(RoutesNames.HOME)}
        >
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
          
            <NavDropdown title="MENU" id="basic-nav-dropdown">
              <NavDropdown.Item onClick={()=>navigate(RoutesNames.PROJECTS_READ)}
              >Projects
              </NavDropdown.Item>
              <NavDropdown.Item onClick={()=>navigate(RoutesNames.MEMBERS_READ)}>
                Members
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Separated link
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
        <Navbar.Collapse className='justify-content-end'>
          <Nav.Link target="_blank" href="https://matijapavkovic-001-site1.itempurl.com/swagger/index.html">API documentation</Nav.Link>

        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;