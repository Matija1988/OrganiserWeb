import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { RoutesNames } from '../constants';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'

import './NavBar.css';
import useAuth from '../hooks/useAuth';

function NavBar() {

const navigate = useNavigate();

const {logout} = useAuth();

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
              <NavDropdown.Item onClick={()=> navigate (RoutesNames.ACTIVITIES_READ)}>
                Activities</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={()=> navigate (RoutesNames.PROOFS_READ)}>
                Proofs of delivery
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
        <Navbar.Collapse className='justify-content-end'>
          <Nav.Link className='linkToMain' target='_blank' href={RoutesNames.MAIN_PANEL} >MAIN</Nav.Link>
          <Nav.Link className='linkToMain' onClick={logout}>LOGOUT</Nav.Link>
          <Nav.Link target="_blank" href="https://matijapavkovic-001-site1.itempurl.com/swagger/index.html">API documentation</Nav.Link>

        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;