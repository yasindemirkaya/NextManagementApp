import { useState } from "react";
import { Button } from "react-bootstrap";
import Link from "next/link";
import { Offcanvas, Nav } from "react-bootstrap";
import sidebarMenu from "@/static/components/sidebar";
import styles from "./index.module.scss";

const Sidebar = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    const [show, setShow] = useState(false);
    const [activeSubMenu, setActiveSubMenu] = useState(null); // Alt menü durumunu tutan state

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    // Token yoksa, Sidebar'ı render etme
    if (!token) {
        return null;
    }

    const handleMenuClick = (menuId, link) => {
        // Eğer tıklanan menüde alt menüler varsa, yönlendirme yapılmasın
        if (menuId === activeSubMenu) {
            setActiveSubMenu(null); // Eğer zaten aktifse, alt menüleri gizle
        } else {
            setActiveSubMenu(menuId); // Alt menüleri göster
        }

        // Eğer alt menü yoksa, sayfaya yönlendir
        if (!sidebarMenu.find((menu) => menu.id === menuId).subMenus.length) {
            window.location.href = link; // Yönlendirme
        }
    };

    return (
        <>
            {/* Sidebar açma butonu */}
            <Button
                variant="primary"
                onClick={handleShow}
                className={styles.sidebarToggle}
            >
                Menu
            </Button>

            {/* Offcanvas Sidebar */}
            <Offcanvas
                show={show}
                onHide={handleClose}
                placement="start"
                className={styles.sidebar}
            >
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Sidebar Menu</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Nav className="flex-column">
                        {sidebarMenu.map((menu) => (
                            <div key={menu.id}>
                                <Nav.Link className={`text-dark fw-bold ${styles.mainMenu}`} as="button" onClick={() => handleMenuClick(menu.id, menu.link)}>
                                    {menu.name}
                                </Nav.Link>
                                {menu.subMenus.length > 0 && activeSubMenu === menu.id && (
                                    <Nav className="ms-3 flex-column">
                                        {menu.subMenus.map((subMenu) => (
                                            <Nav.Link className={`text-primary fw-bold ${styles.subMenu}`} key={subMenu.id} as={Link} href={subMenu.link} passHref>
                                                - {subMenu.name}
                                            </Nav.Link>
                                        ))}
                                    </Nav>
                                )}
                            </div>
                        ))}
                    </Nav>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
};

export default Sidebar;
