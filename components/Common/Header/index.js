import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Container, Nav, Navbar, Button, Badge, Dropdown } from 'react-bootstrap';
import { useRouter } from 'next/router';
import headerMenu from "@/static/components/header";
import { icons } from '@/static/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './index.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { clearUser } from '@/redux/userSlice';
import Cookies from 'js-cookie';
import { getNotificationCount, getNotifications } from '@/services/notificationApi';
import { useTranslations } from 'next-intl';

const Header = ({ toggleSidebar }) => {
    const t = useTranslations()
    const router = useRouter()
    const dispatch = useDispatch()
    const loggedInUser = useSelector(state => state.user.user)
    const token = Cookies.get('token')

    const [notificationCount, setNotificationCount] = useState(0)
    const [notifications, setNotifications] = useState([])
    const [loading, setLoading] = useState(false)

    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem("theme");
        return savedTheme ? savedTheme === "dark" : false;
    });

    const toggleTheme = () => setIsDarkMode(prevMode => !prevMode);

    const changeLanguage = (lang) => {
        router.push(router.asPath, router.asPath, { locale: lang });
    };

    let profileText = loggedInUser ? loggedInUser.email : "Profile";

    useEffect(() => {
        if (token) {
            // İlk yüklemede veriyi alalım
            fetchNotificationCount();
            fetchNotifications();

            // Call these endpoints for every 5 mins
            const interval = setInterval(() => {
                fetchNotificationCount();
                fetchNotifications();
            }, 5 * 60 * 1000);

            return () => clearInterval(interval);
        }
    }, [token]);

    useEffect(() => {
        document.documentElement.setAttribute("data-bs-theme", isDarkMode ? "dark" : "light");
        localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    }, [isDarkMode]);

    // Get all notifications
    const fetchNotifications = async () => {
        setLoading(true);
        const result = await getNotifications({ type: 2, page: 1, limit: 3 });
        setLoading(false);
        if (result.success) {
            setNotifications(result.data);
        }
    };

    // Get Notification Count
    const fetchNotificationCount = async () => {
        const result = await getNotificationCount(token);
        if (result.success) {
            setNotificationCount(result.data);
        }
    };

    // Handle logout
    const handleLogout = () => {
        Cookies.remove('token')
        dispatch(clearUser());
        router.push('/login');
    };

    // Login olmuş user yoksa, Header'ı render etme
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
                    {/* Brand */}
                    <Navbar.Brand as={Link} href="/">MyApp</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />

                    <Navbar.Collapse id="basic-navbar-nav">
                        {/* Left Menu */}
                        {headerMenu
                            .filter(menu => menu.id <= 2)
                            .map(menu => (
                                <Nav key={menu.id} className={styles.menuItem}>
                                    <Nav.Link as={Link} href={menu.link}>{menu.name}</Nav.Link>
                                </Nav>
                            ))
                        }

                        {/* Right Menu */}
                        <Nav className="ms-auto d-flex align-items-center">
                            {/* Theme Toggle Button */}
                            <label className={styles.toggleSwitch}>
                                <input
                                    type="checkbox"
                                    checked={isDarkMode}
                                    onChange={toggleTheme}
                                />
                                <span className={styles.slider}>
                                    <FontAwesomeIcon icon={icons.faMoon} className={styles.iconMoon} />
                                    <FontAwesomeIcon icon={icons.faSun} className={styles.iconSun} />
                                </span>
                            </label>

                            {/* Language Switch */}
                            <Button
                                variant="link"
                                onClick={() => changeLanguage(router.locale === 'en' ? 'tr' : 'en')}
                                className={styles.languageSwitch}
                            >
                                {router.locale === 'en' ? 'TR' : 'EN'}
                            </Button>

                            {headerMenu
                                .filter(menu => menu.id > 2)
                                .map(menu => (
                                    <Nav key={menu.id} className={styles.menuItem}>
                                        {/* Notifications */}
                                        {menu.name === "Notifications" ? (
                                            notificationCount > 0 ? (
                                                <Dropdown>
                                                    <Dropdown.Toggle as={Nav.Link} className={styles.menuItem}>
                                                        <FontAwesomeIcon icon={icons[menu.icon]} />

                                                        {/* Notification Count */}
                                                        {notificationCount > 0 && (
                                                            <Badge bg="danger" pill className={styles.notificationBadge}>
                                                                {notificationCount}
                                                            </Badge>
                                                        )}
                                                    </Dropdown.Toggle>

                                                    <Dropdown.Menu>
                                                        {loading ? (
                                                            <Dropdown.Item disabled>{t("Loading")}</Dropdown.Item>
                                                        ) : notifications.length > 0 ? (
                                                            <>
                                                                {/* Show only first 3 */}
                                                                {notifications.map((notification, index) => (
                                                                    <Dropdown.Item
                                                                        key={index}
                                                                        as={Link}
                                                                        href={notification.group ? '/notifications/group-notifications' : '/notifications/personal-notifications'}
                                                                    >
                                                                        {notification.title}
                                                                    </Dropdown.Item>
                                                                ))}

                                                                {/* "View More..." butonu */}
                                                                <Dropdown.Item as={Link} href="/notifications" className={styles.viewMore}>
                                                                    {t("View More")}
                                                                </Dropdown.Item>
                                                            </>
                                                        ) : (
                                                            <Dropdown.Item>{t("No notifications")}</Dropdown.Item>
                                                        )}
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            ) : (
                                                <Nav.Link as={Link} href="/notifications">
                                                    <FontAwesomeIcon icon={icons[menu.icon]} />
                                                </Nav.Link>
                                            )
                                        ) : (
                                            <Nav.Link as={Link} href={menu.link}>
                                                <FontAwesomeIcon icon={icons[menu.icon]} />
                                            </Nav.Link>
                                        )}
                                    </Nav>
                                ))
                            }

                            {/* Profile / Log Out */}
                            {loggedInUser ? (
                                <>
                                    <Nav.Link as={Link} href="/profile" className={styles.menuItem}>{profileText}</Nav.Link>
                                    <Nav.Link as="span" onClick={handleLogout} className={styles.logout}>
                                        <FontAwesomeIcon icon={icons.faRightFromBracket} />
                                    </Nav.Link>
                                </>
                            ) : (
                                <Nav.Link as={Link} href="/login">{t("Login")}</Nav.Link>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    );
};

export async function getStaticProps(context) {
    const commonMessages = await import(`../../../public/locales/common/${context.locale}.json`);

    return {
        props: {
            messages: {
                ...commonMessages.default,
            },
        },
    };
}

export default Header;