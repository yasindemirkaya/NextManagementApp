import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Container, Nav, Navbar, Button, Badge } from 'react-bootstrap';
import { useRouter } from 'next/router';
import headerMenu from "@/static/components/header";
import { icons } from '@/static/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './index.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { clearUser } from '@/redux/userSlice';
import Cookies from 'js-cookie';
import { getNotificationCount } from '@/services/notificationApi';

const Header = ({ toggleSidebar }) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const loggedInUser = useSelector(state => state.user.user);
    const token = Cookies.get('token')

    const [notificationCount, setNotificationCount] = useState(0);

    useEffect(() => {
        if (token) {
            // Get Notification Count
            const fetchNotificationCount = async () => {
                const result = await getNotificationCount(token);
                if (result.success) {
                    setNotificationCount(result.data);
                }
            };
            fetchNotificationCount();
        }
    }, [token]);

    let profileText = loggedInUser ? loggedInUser.email : "Profile";

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
            <Navbar bg="light" expand="lg" className={styles.header}>
                <Button variant="secondary" className="m-2" onClick={toggleSidebar}>
                    <FontAwesomeIcon icon={icons.faChevronRight} />
                </Button>
                <Container>
                    {/* Brand */}
                    <Navbar.Brand as={Link} href="/">MyApp</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />

                    <Navbar.Collapse id="basic-navbar-nav">
                        {/* Menu */}
                        {headerMenu
                            .filter(menu => menu.id <= 2)
                            .map(menu => (
                                <Nav key={menu.id} className={styles.menuItem}>
                                    <Nav.Link as={Link} href={menu.link}>{menu.name}</Nav.Link>
                                </Nav>
                            ))
                        }

                        <Nav className="ms-auto">
                            {headerMenu
                                .filter(menu => menu.id > 2)
                                .map(menu => (
                                    <Nav key={menu.id} className={styles.menuItem}>
                                        <Nav.Link as={Link} href={menu.link}>
                                            <FontAwesomeIcon icon={icons[menu.icon]} />
                                            {menu.name === "Notifications" && notificationCount > 0 && (
                                                <Badge bg="danger" pill className={styles.notificationBadge}>
                                                    {notificationCount}
                                                </Badge>
                                            )}
                                        </Nav.Link>
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