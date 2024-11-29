import ProfileCard from '@/components/UserManagement/ViewUsers/UserProfile/ProfileCard';
import { Container, Row, Col } from 'react-bootstrap';
import styles from './index.module.scss';
import { useEffect, useState } from 'react';
import axios from '@/utils/axios';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getUser();
    }, []);

    const getUser = () => {
        axios.get('/private/user/get-user')
            .then(response => {
                setUser(response.user);
                setLoading(false);
                setError(null);
            })
            .catch(error => {
                setError(error.message);
                setLoading(false);
            });
    };

    return (
        <Container className={styles.profilePage}>
            <Row className="d-flex justify-content-center h-100">
                <Col md={4}>
                    <ProfileCard
                        user={user}
                        loading={loading}
                        error={error}
                        from={'profile'}
                        getUser={getUser}
                    />
                </Col>
            </Row>
        </Container>
    );
};

export default Profile;