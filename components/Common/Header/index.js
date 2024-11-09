import Link from 'next/link';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { useRouter } from 'next/router';
import styles from './index.module.scss';

const Header = () => {
    const router = useRouter();
    const token = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/login');
    };

    // Token yoksa, Header'ı render etme
    if (!token) {
        return null;
    }

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
                    <Nav className="ms-auto">
                        {token ? (
                            <Nav.Link as="button" onClick={handleLogout}>Log Out</Nav.Link>
                        ) : (
                            <Nav.Link as={Link} href="/login">Log In</Nav.Link>
                        )}
                        <Nav.Link as={Link} href="/profile">Profile</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Header;