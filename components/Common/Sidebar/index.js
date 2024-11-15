import { useState } from "react";
import { Button, Offcanvas, Nav } from "react-bootstrap";
import Link from "next/link";
import sidebarMenu from "@/static/components/sidebar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icons } from '@/static/icons';
import styles from "./index.module.scss";

const Sidebar = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    const [isSidebarVisible, setSidebarVisible] = useState(false);
    const [activeMenuId, setActiveMenuId] = useState(null);

    const toggleSidebar = () => setSidebarVisible(!isSidebarVisible);

    // Token yoksa, Sidebar'ı render etme
    if (!token) {
        return null;
    }

    const handleMenuClick = (menuId, link) => {
        // Menü tıklandığında alt menü açma/kapatma durumu
        setActiveMenuId(prevActiveId => prevActiveId === menuId ? null : menuId);

        // Alt menü yoksa ana menüye yönlendirme yap
        if (!sidebarMenu.find(menu => menu.id === menuId).subMenus.length) {
            window.location.href = link;
        }
    };

    return (
        <>
            {/* Sidebar açma butonu */}
            <Button
                variant="primary"
                onClick={toggleSidebar}
                className={styles.sidebarToggle}
            >
                Menu
            </Button>

            {/* Offcanvas Sidebar */}
            <Offcanvas
                show={isSidebarVisible}
                onHide={toggleSidebar}
                placement="start"
                className={styles.sidebar}
            >
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Sidebar Menu</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Nav className="flex-column">
                        {sidebarMenu.map(menu => (
                            <div key={menu.id}>
                                <Nav.Link
                                    className={`text-dark fw-bold ${styles.mainMenu}`}
                                    as="button"
                                    onClick={() => handleMenuClick(menu.id, menu.link)}
                                >
                                    {menu.name}

                                    {/* Menüde alt menüler varsa ikon göster */}
                                    {menu.subMenus.length > 0 && (
                                        <FontAwesomeIcon
                                            icon={icons[menu.iconPrimary || menu.iconSecondary]}
                                            className={`${styles.chevron} ms-2`}
                                            style={{
                                                transform: activeMenuId === menu.id ? "rotate(180deg)" : "rotate(0deg)",
                                                transition: "transform 0.3s ease-in-out"
                                            }}
                                        />
                                    )}
                                </Nav.Link>

                                {/* Alt menüler açık mı? */}
                                {menu.subMenus.length > 0 && activeMenuId === menu.id && (
                                    <Nav className="ms-3 flex-column">
                                        {menu.subMenus.map(subMenu => (
                                            <Nav.Link className={`text-primary fw-bold ${styles.subMenu}`} key={subMenu.id} as={Link} href={subMenu.link} passHref>
                                                <FontAwesomeIcon icon={icons[subMenu.iconPrimary || subMenu.iconSecondary]} className="me-2" />
                                                {subMenu.name}
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
