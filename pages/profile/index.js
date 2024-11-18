import ProfileCard from '@/components/UserManagement/ViewUsers/UserProfile/ProfileCard';
import { Container, Row, Col } from 'react-bootstrap';
import styles from './index.module.scss';
import { useEffect, useState } from 'react';
import { isTokenExpiredClient } from '@/helpers/tokenVerifier';
import axios from '@/utils/axios';
import { isSuperAdmin } from '@/helpers/authorityDetector';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    useEffect(() => {
        if (token && !isTokenExpiredClient(token)) {
            getUser();
        }
    }, []);

    const getUser = () => {
        axios.get('/private/user/get-user', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
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
                    <ProfileCard user={user} loading={loading} error={error} isSuperAdmin={isSuperAdmin(token)} from={'profile'} getUser={getUser} />
                </Col>
            </Row>
        </Container>
    );
};

export default Profile;