import { useRouter } from "next/router";
import axios from '@/utils/axios';
import styles from './index.module.scss';
import { useEffect, useState } from "react";
import { isTokenExpiredClient } from "@/helpers/tokenVerifier";
import { Col, Container, Row } from "react-bootstrap";
import ProfileCard from "@/components/UserManagement/ViewUsers/UserProfile/ProfileCard";

const UserDetailPage = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const router = useRouter();
    const { userId } = router.query;

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    useEffect(() => {
        const userDataFromQuery = queryFormatter(userId)
        if (token && !isTokenExpiredClient(token) && userDataFromQuery.id) {
            getUserDetails(userDataFromQuery.id)
        }
    }, [userId])

    // Formatter fonksiyonu
    const queryFormatter = (userId) => {
        if (userId) {
            // userId örneği: "kevin-owens-41642312-bc53-45ee-ad38-8e45930da129"
            const parts = userId.split('-');

            const name = parts[0];
            const surname = parts[1];
            const id = parts.slice(2).join('-');

            return { name, surname, id };
        }
        return {};
    };

    // Get User By ID
    const getUserDetails = (id) => {
        setLoading(true)

        axios.get('/private/user/get-user-by-id', {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                id,
            },
        })
            .then((response) => {
                if (response.code === 1) {
                    setUser(response.user)
                    setLoading(false)
                } else {
                    setLoading(false)
                    setError(response.message)
                }
            })
            .catch((error) => {
                setLoading(false)
                setError('An error occured when receiving user data. Please try again later.')
            })
    }

    return (
        <Container className={styles.profilePage}>
            <Row className="d-flex justify-content-center h-100">
                <Col md={4}>
                    <ProfileCard
                        user={user}
                        loading={loading}
                        error={error}
                        from={'viewUsers'}
                        getUserDetails={getUserDetails}
                    />
                </Col>
            </Row>
        </Container>
    );
};

export default UserDetailPage;
