import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/actions/authActions';
import { Navbar, Nav, Button, Container } from 'react-bootstrap';

const AppNavbar = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const onLogout = () => {
    dispatch(logout());
  };

  const authLinks = (
    <>
      <Nav.Link as={Link} to="/dashboard">
        Dashboard
      </Nav.Link>
      <Nav.Link as={Link} to="/projects">
        Projects
      </Nav.Link>
      <Nav.Link as={Link} to="/tasks">
        Tasks
      </Nav.Link>

    {/* Conditionally show greeting */}
    {user?.name && (
      <Nav.Item className="d-flex align-items-center ms-3">
        <span className="text-white me-2">
          Hi, {user.name.split(' ')[0]}
        </span>
      </Nav.Item>
    )}


    {/* Always show Logout for authenticated users */}
    <Nav.Item className="d-flex align-items-center ms-3">
      <Button variant="outline-light" size="sm" onClick={onLogout}>
        Logout
      </Button>
    </Nav.Item>
  

   

    </>
  );

  const guestLinks = (
    <>
      <Nav.Link as={Link} to="/login">
        Login
      </Nav.Link>
      <Nav.Link as={Link} to="/">
        Register
      </Nav.Link>
    </>
  );

  return (
    <Navbar bg="primary" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/">
          PMS
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {isAuthenticated ? authLinks : guestLinks}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
