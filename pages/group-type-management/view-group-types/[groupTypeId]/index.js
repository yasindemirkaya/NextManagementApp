import { useRouter } from "next/router";
import styles from './index.module.scss';
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import ProfileCard from "@/components/GroupTypeManagement/ViewGroupTypes/UserProfile/ProfileCard";
import { getUserById } from "@/services/userApi";

const UserDetailPage = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const router = useRouter();
    const { userId } = router.query;


    useEffect(() => {
        const userDataFromQuery = queryFormatter(userId)
        if (userDataFromQuery.id) {
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
    const getUserDetails = async (userId) => {
        setLoading(true);

        const result = await getUserById(userId);

        if (result.success) {
            setUser(result.data);
            setError(null);
        } else {
            setError(result.error);
            setUser(null);
        }

        setLoading(false);
    };

    return (
        <Container className={styles.profilePage}>
            <Row className="d-flex justify-content-center h-100">
                <Col md={4}>
                    <ProfileCard
                        user={user}
                        loading={loading}
                        error={error}
                        from={'view-users'}
                        getUserDetails={getUserDetails}
                    />
                </Col>
            </Row>
        </Container>
    );
};

export default UserDetailPage;
