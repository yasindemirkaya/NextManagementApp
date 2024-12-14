import { useState } from "react";
import { Offcanvas, Nav } from "react-bootstrap";
import Link from "next/link";
import sidebarMenu from "@/static/components/sidebar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icons } from '@/static/icons';
import styles from "./index.module.scss";
import { useSelector } from 'react-redux';

const Sidebar = ({ isSidebarVisible, toggleSidebar }) => {
    const loggedInUser = useSelector(state => state.user.user);

    const [activeMenuId, setActiveMenuId] = useState(null);
    const [activeSubMenuId, setActiveSubMenuId] = useState(null);

    if (!loggedInUser) {
        return null;
    }

    const userRole = loggedInUser.role || '';

    const hasPermission = (menuPermission) => {
        return userRole >= menuPermission;
    };

    const handleMenuClick = (menuId, link) => {
        setActiveMenuId(prevActiveId => (prevActiveId === menuId ? null : menuId));

        const menu = sidebarMenu.find(menu => menu.id === menuId);
        if (menu && (!menu.subMenus || !menu.subMenus.length)) {
            toggleSidebar();
            window.location.href = link;
        }
    };

    const handleSubMenuClick = (subMenuId, link) => {
        setActiveSubMenuId(prevActiveId => (prevActiveId === subMenuId ? null : subMenuId));
        window.location.href = link;
    };

    const renderMenu = (menu, level = 0) => (
        <div key={menu.id} className={level === 0 ? styles.mainMenuWrapper : styles.subMenuWrapper}>
            {/* Ana menüler */}
            <Nav.Link
                className={`text-primary fw-bold ${styles.mainMenu} ${level > 0 ? styles.subMenu : ''} ${activeMenuId === menu.id ? styles.activeMenu : ''}`}
                as="button"
                onClick={() => {
                    if (!menu.subMenus || !menu.subMenus.length) {
                        handleMenuClick(menu.id, menu.link);
                    } else {
                        setActiveMenuId(menu.id); // Alt menüsünü aç
                    }
                }}
            >
                {/* Ana menü adı */}
                {menu.name}

                {/* Ana menünün alt menüsü varsa ok işareti ekle */}
                {menu.subMenus && menu.subMenus.length > 0 && (
                    <FontAwesomeIcon
                        icon={icons[menu.iconPrimary || menu.iconSecondary]}
                        className={`${styles.chevron} ms-2`}
                        style={{
                            transform: activeMenuId === menu.id ? "rotate(180deg)" : "rotate(0deg)",
                            transition: "transform 0.3s ease-in-out",
                        }}
                    />
                )}
            </Nav.Link>

            {/* Alt menüler */}
            {menu.subMenus && activeMenuId === menu.id && (
                <Nav className="ms-3 flex-column">
                    {menu.subMenus
                        .filter((subMenu) => hasPermission(subMenu.permission))
                        .map((subMenu) => (
                            <div key={subMenu.id}>
                                <Nav.Link
                                    className={`text-dark ${styles.subMenuItem}`}
                                    as="button"
                                    onClick={() => {
                                        if (!subMenu.subMenus || !subMenu.subMenus.length) {
                                            handleSubMenuClick(subMenu.id, subMenu.link);
                                        } else {
                                            setActiveSubMenuId(subMenu.id);
                                        }
                                    }}
                                >
                                    {/* Alt menü ikon */}
                                    <FontAwesomeIcon
                                        icon={icons[subMenu.iconPrimary || subMenu.iconSecondary]}
                                        className="me-2"
                                    />
                                    {/* Alt menü adı */}
                                    {subMenu.name}

                                    {/* Alt menü ok işareti */}
                                    {subMenu.subMenus && subMenu.subMenus.length > 0 && (
                                        <FontAwesomeIcon
                                            icon={icons.faChevronUp}
                                            className={`${styles.chevron} ms-2`}
                                            style={{
                                                transform: activeSubMenuId === subMenu.id ? "rotate(180deg)" : "rotate(0deg)",
                                                transition: "transform 0.3s ease-in-out",
                                            }}
                                        />
                                    )}
                                </Nav.Link>

                                {/* Alt menülerin alt menüleri */}
                                {subMenu.subMenus && activeSubMenuId === subMenu.id && (
                                    <Nav className="ms-3 flex-column">
                                        {subMenu.subMenus
                                            .filter((subSubMenu) => hasPermission(subSubMenu.permission))
                                            .map((subSubMenu) => (
                                                <div key={subSubMenu.id}>
                                                    <Nav.Link
                                                        className={`text-dark ${styles.subMenuItem}`}
                                                        as="button"
                                                        onClick={() => {
                                                            if (!subSubMenu.subMenus || !subSubMenu.subMenus.length) {
                                                                handleSubMenuClick(subSubMenu.id, subSubMenu.link);
                                                            } else {
                                                                setActiveSubMenuId(subSubMenu.id);
                                                            }
                                                        }}
                                                    >
                                                        {/* Alt menülerin alt menüsü ikon */}
                                                        <FontAwesomeIcon
                                                            icon={icons[subSubMenu.iconPrimary || subSubMenu.iconSecondary]}
                                                            className="me-2"
                                                        />
                                                        {/* Alt menülerin alt menüsü adı */}
                                                        {subSubMenu.name}
                                                    </Nav.Link>
                                                </div>
                                            ))}
                                    </Nav>
                                )}
                            </div>
                        ))}
                </Nav>
            )}
        </div>
    );

    return (
        <Offcanvas
            show={isSidebarVisible}
            onHide={toggleSidebar}
            placement="start"
            className={styles.sidebar}
        >
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Menu</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <Nav className="flex-column">
                    {sidebarMenu
                        .filter((menu) => hasPermission(menu.permission))
                        .map((menu) => renderMenu(menu))}
                </Nav>
            </Offcanvas.Body>
        </Offcanvas>
    );
};

export default Sidebar;
