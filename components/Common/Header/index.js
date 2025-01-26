import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Container, Nav, Navbar, Button, Badge, Dropdown } from 'react-bootstrap';
import { useRouter } from 'next/router';
import headerMenu from "@/static/components/header";
import { icons } from '@/static/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './index.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { clearUser, setUser } from '@/redux/userSlice';
import Cookies from 'js-cookie';
import { getNotificationCount, getNotifications } from '@/services/notificationApi';
import { getDemandCount, getDemands } from '@/services/demandApi';
import { useTranslations } from 'next-intl';
import { setUserSettings } from '@/redux/settingsSlice';
import { createUserSettings } from '@/services/userSettingsApi';

const Header = ({ toggleSidebar }) => {
    const t = useTranslations();
    const router = useRouter();
    const dispatch = useDispatch();

    const loggedInUser = useSelector(state => state.user.user);
    const theme = useSelector(state => state.settings.userSettings.theme)
    const token = Cookies.get('token');

    const [notificationCount, setNotificationCount] = useState(0);
    const [notifications, setNotifications] = useState([]);
    const [loadingNotifications, setLoadingNotifications] = useState(false);

    const [demandCount, setDemandsCount] = useState(0);
    const [demands, setDemands] = useState([]);
    const [loadingDemands, setLoadingDemands] = useState(false);

    useEffect(() => {
        if (token) {
            fetchNotificationCount();
            fetchNotifications();
            fetchDemandCount();
            fetchDemands();

            const interval = setInterval(() => {
                fetchNotificationCount();
                fetchNotifications();
                fetchDemandCount();
                fetchDemands();
            }, 5 * 60 * 1000);

            return () => clearInterval(interval);
        }
    }, [token]);

    useEffect(() => {
        document.documentElement.setAttribute("data-bs-theme", theme == 'dark' ? "dark" : "light");
    }, [theme]);

    let profileText = loggedInUser ? loggedInUser.email : "Profile";

    // Toggle theme
    const toggleTheme = async (theme) => {
        const result = await createUserSettings({ theme: theme });

        if (result.success) {
            dispatch(setUserSettings({
                theme: theme
            }))
        } else {
            dispatch(setUserSettings({
                theme: "light"
            }))
        }
    }

    // Change language
    const changeLanguage = async (lang) => {
        const result = await createUserSettings({ language: lang });

        if (result.success) {
            dispatch(setUserSettings({
                language: lang
            }))
        } else {
            dispatch(setUserSettings({
                language: "en"
            }))
        }
        router.push(router.asPath, router.asPath, { locale: lang });
    };

    // Get notifications
    const fetchNotifications = async () => {
        setLoadingNotifications(true);
        const result = await getNotifications({ type: 2, page: 1, limit: 3 });
        setLoadingNotifications(false);
        if (result.success) {
            setNotifications(result.data);
        }
    };

    // Get notification count
    const fetchNotificationCount = async () => {
        const result = await getNotificationCount(token);
        if (result.success) {
            setNotificationCount(result.data);
        }
    };

    // Get demands
    const fetchDemands = async () => {
        setLoadingDemands(true);
        const result = await getDemands({ page: 1, limit: 3, status: loggedInUser.role == 1 ? 0 : 1 });
        setLoadingDemands(false);
        if (result.success) {
            setDemands(result.data);
        }
    };

    // Get demand count
    const fetchDemandCount = async () => {
        const result = await getDemandCount(token);
        if (result.success) {
            setDemandsCount(result.data);
        }
    };

    // Logout
    const handleLogout = () => {
        Cookies.remove('token');
        dispatch(clearUser());
        router.push('/login');
    };


    if (!loggedInUser || !token) {
        return null;
    }

    return (
        <>
            <Navbar expand="lg" className={styles.header}>
                <Button variant="success" className="m-2" onClick={toggleSidebar}>
                    <FontAwesomeIcon icon={icons.faChevronRight} />
                </Button>
                <Container>
                    <Navbar.Brand as={Link} href="/">MyApp</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />

                    <Navbar.Collapse id="basic-navbar-nav">
                        {/* Left Menu */}
                        {headerMenu
                            .filter(menu => menu.id <= 2)
                            .map(menu => (
                                <Nav key={menu.id} className={styles.menuItem}>
                                    <Nav.Link as={Link} href={menu.link}>
                                        {t(menu.name)}
                                    </Nav.Link>
                                </Nav>
                            ))
                        }

                        {/* Right Menu */}
                        <Nav className="ms-auto d-flex align-items-center">
                            {/* THEME */}
                            <label className={styles.toggleSwitch}>
                                <input
                                    type="checkbox"
                                    checked={theme === "dark"}
                                    onChange={() => toggleTheme(theme === "dark" ? "light" : "dark")}
                                />
                                <span className={styles.slider}>
                                    <FontAwesomeIcon icon={icons.faMoon} className={styles.iconMoon} />
                                    <FontAwesomeIcon icon={icons.faSun} className={styles.iconSun} />
                                </span>
                            </label>

                            {/* LANGUAGE */}
                            <Button
                                variant="link"
                                onClick={() => changeLanguage(router.locale === 'en' ? 'tr' : 'en')}
                                className={styles.languageSwitch}
                            >
                                {router.locale === 'en' ? 'EN' : 'TR'}
                            </Button>

                            {/* NOTIFICATIONS & DEMANDS */}
                            {headerMenu
                                .filter(menu => menu.id > 2)
                                .map(menu => (
                                    <Nav key={menu.id} className={styles.menuItem}>
                                        {menu.name === "Notifications" ? (
                                            notificationCount > 0 ? (
                                                <Dropdown>
                                                    <Dropdown.Toggle as={Nav.Link}>
                                                        <FontAwesomeIcon icon={icons[menu.icon]} />
                                                        {notificationCount > 0 && (
                                                            <Badge bg="danger" pill className={styles.notificationBadge}>
                                                                {notificationCount}
                                                            </Badge>
                                                        )}
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu>
                                                        {loadingNotifications ? (
                                                            <Dropdown.Item disabled>Loading</Dropdown.Item>
                                                        ) : notifications.length > 0 ? (
                                                            <>
                                                                {notifications.map((notification, index) => (
                                                                    <Dropdown.Item
                                                                        key={index}
                                                                        as={Link}
                                                                        href={notification.group ? '/notifications/group-notifications' : '/notifications/personal-notifications'}
                                                                    >
                                                                        {notification.title}
                                                                    </Dropdown.Item>
                                                                ))}
                                                                <Dropdown.Item as={Link} href="/notifications" className={styles.viewMore}>
                                                                    View More
                                                                </Dropdown.Item>
                                                            </>
                                                        ) : (
                                                            <Dropdown.Item>No notifications</Dropdown.Item>
                                                        )}
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            ) : (
                                                <Nav.Link as={Link} href="/notifications">
                                                    <FontAwesomeIcon icon={icons[menu.icon]} />
                                                </Nav.Link>
                                            )
                                        ) : menu.name === "Demands" ? (
                                            demandCount > 0 ? (
                                                <Dropdown>
                                                    <Dropdown.Toggle as={Nav.Link}>
                                                        <FontAwesomeIcon icon={icons[menu.icon]} />
                                                        {demandCount > 0 && (
                                                            <Badge bg="danger" pill className={styles.notificationBadge}>
                                                                {demandCount}
                                                            </Badge>
                                                        )}
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu>
                                                        {loadingDemands ? (
                                                            <Dropdown.Item disabled>Loading</Dropdown.Item>
                                                        ) : demands.length > 0 ? (
                                                            <>
                                                                {demands.map((demand, index) => (
                                                                    <Dropdown.Item
                                                                        key={index}
                                                                        as={Link}
                                                                        href="/demands/view-demands"
                                                                    >
                                                                        {demand.title}
                                                                    </Dropdown.Item>
                                                                ))}
                                                                <Dropdown.Item as={Link} href="/demands/view-demands" className={styles.viewMore}>
                                                                    View More
                                                                </Dropdown.Item>
                                                            </>
                                                        ) : (
                                                            <Dropdown.Item>No demands</Dropdown.Item>
                                                        )}
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            ) : (
                                                <Nav.Link as={Link} href="/demands/view-demands">
                                                    <FontAwesomeIcon icon={icons[menu.icon]} />
                                                </Nav.Link>
                                            )
                                        ) : (
                                            <Nav.Link as={Link} href={menu.link}>
                                                {t(menu.name)}
                                            </Nav.Link>
                                        )}
                                    </Nav>
                                ))
                            }

                            {/* LOGOUT */}
                            {loggedInUser ? (
                                <>
                                    <Nav.Link as={Link} href="/profile" className={styles.menuItem}>{profileText}</Nav.Link>
                                    <Nav.Link as="span" onClick={handleLogout} className={styles.logout}>
                                        <FontAwesomeIcon icon={icons.faRightFromBracket} />
                                    </Nav.Link>
                                </>
                            ) : (
                                <Nav.Link as={Link} href="/login">Login</Nav.Link>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    );
};

export default Header;
