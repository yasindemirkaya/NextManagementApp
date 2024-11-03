import Link from 'next/link';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { useSession, signOut } from 'next-auth/react';
import styles from './index.module.scss';

const Header = () => {
    const { data: session } = useSession();

    //    Logout user
    const handleLogout = async () => {
        await signOut({ callbackUrl: '/' });
        localStorage.removeItem('token');
    }

    // Session yoksa Headerı gösterme. Sadece login kullanıcılar için Header gösterilmeli.
    if (!session) return null;

    return (
        <Navbar bg="light" expand="lg" className={styles.header}>
            <Container>
                <Navbar.Brand as={Link} href="/">
                    Your Company
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} href="/">Home</Nav.Link>
                        <Nav.Link as={Link} href="/about">About Us</Nav.Link>
                        <Nav.Link as={Link} href="/contact">Contact</Nav.Link>
                        <Nav.Link as={Link} href="/privacy">Privacy Policy</Nav.Link>
                    </Nav>
                    <Nav className="ms-auto">
                        {session ? (
                            <Nav.Link as={Link} href="/profile">My Profile</Nav.Link>
                        ) : (
                            ''
                        )}
                        {session ? (
                            <Nav.Link onClick={handleLogout}>
                                Logout
                            </Nav.Link>
                        ) : (
                            <Nav.Link as={Link} href="/login">Login</Nav.Link>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Header;