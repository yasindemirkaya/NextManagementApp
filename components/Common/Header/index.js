import Link from 'next/link';
import { Container, Nav, Navbar } from 'react-bootstrap';
import styles from './index.module.scss';

const Header = () => {
    return (
        <Navbar bg="light" expand="lg" className={styles.header}>
            <Container>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} href="/">Home</Nav.Link>
                        <Nav.Link as={Link} href="/about">About Us</Nav.Link>
                        <Nav.Link as={Link} href="/contact">Contact</Nav.Link>
                        <Nav.Link as={Link} href="/privacy">Privacy Policy</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Header;