import Link from 'next/link';
import { Container, Nav, Navbar, Button } from 'react-bootstrap';
import { useRouter } from 'next/router';
import headerMenu from "@/static/components/header";
import { icons } from '@/static/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './index.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { clearUser } from '@/redux/userSlice';
import Cookies from 'js-cookie';

const Header = ({ toggleSidebar }) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const loggedInUser = useSelector(state => state.user.user);

    let profileText = loggedInUser ? loggedInUser.email : "Profile";

    const handleLogout = () => {
        Cookies.remove('token')
        dispatch(clearUser());
        router.push('/login');
    };

    // Login olmuş user yoksa, Header'ı render etme
    if (!loggedInUser) {
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
                        {headerMenu.map(menu => (
                            <Nav key={menu.id}>
                                <Nav.Link as={Link} href={menu.link}>{menu.name}</Nav.Link>
                            </Nav>
                        ))}

                        <Nav className="ms-auto">
                            {loggedInUser ? (
                                <>
                                    <Nav.Link as={Link} href="/profile">{profileText}</Nav.Link>
                                    <Nav.Link as="span" onClick={handleLogout} className={styles.logout}>
                                        Log Out
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