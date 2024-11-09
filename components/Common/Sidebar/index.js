import { useState } from "react";
import { Button } from "react-bootstrap";
import Link from "next/link";
import { Offcanvas, Nav } from "react-bootstrap";
import styles from './index.module.scss';

const Sidebar = () => {
    const token = localStorage.getItem('token');

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    // Token yoksa, Sidebar'ı render etme
    if (!token) {
        return null;
    }

    return (
        <>
            {/* Sidebar açma butonu */}
            <Button variant="primary" onClick={handleShow} className={styles.sidebarToggle}>Menu</Button>

            {/* Offcanvas Sidebar */}
            <Offcanvas show={show} onHide={handleClose} placement="start" className={styles.sidebar}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Sidebar Menu</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Nav className="flex-column">
                        <Nav.Link as={Link} href="/" passHref>
                            Home
                        </Nav.Link>
                        <Nav.Link as={Link} href="/about" passHref>
                            About
                        </Nav.Link>
                        <Nav.Link as={Link} href="/services" passHref>
                            Services
                        </Nav.Link>
                        <Nav.Link as={Link} href="/contact" passHref>
                            Contact
                        </Nav.Link>
                        <Nav.Link as={Link} href="/profile" passHref>
                            Profile
                        </Nav.Link>
                    </Nav>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
};

export default Sidebar;