import Link from 'next/link';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { useRouter } from 'next/router';
import headerMenu from "@/static/components/header";
import styles from './index.module.scss';

const Header = () => {
    const router = useRouter();
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/login');
    };

    // Token yoksa, Header'ı render etme
    if (!token) {
        return null;
    }

    return (
        <>
            <Navbar bg="light" expand="lg" className={styles.header}>
                <Container>
                    {/* Brand */}
                    <Navbar.Brand as={Link} href="/">MyApp</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />

                    <Navbar.Collapse id="basic-navbar-nav">
                        {/* Menu */}
                        {headerMenu.map(menu => (
                            <Nav>
                                <Nav.Link as={Link} href={menu.link}>{menu.name}</Nav.Link>
                            </Nav>
                        ))}

                        <Nav className="ms-auto">
                            {token ? (<Nav.Link as={Link} href="/profile">Profile</Nav.Link>) : null}
                            {token ? (
                                <Nav.Link as="span" onClick={handleLogout} className={styles.logout}>
                                    Log Out
                                </Nav.Link>
                            ) : (
                                <Nav.Link as={Link} href="/login">Log In</Nav.Link>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    );
};

export default Header;