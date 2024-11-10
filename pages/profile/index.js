import ProfileCard from './components/ProfileCard';
import { Container, Row, Col } from 'react-bootstrap';
import styles from './index.module.scss';

const Profile = () => {
    return (
        <Container className={styles.profilePage}>
            <Row className="d-flex justify-content-center h-100">
                <Col md={4}>
                    <ProfileCard />
                </Col>
            </Row>
        </Container>
    );
};

export default Profile;