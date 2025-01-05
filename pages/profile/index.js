import ProfileCard from '@/components/UserManagement/ViewUsers/UserProfile/ProfileCard';
import { Container, Row, Col } from 'react-bootstrap';
import styles from './index.module.scss';
import { useEffect, useState } from 'react';
import { getUser } from '@/services/userApi';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            const response = await getUser();
            setUser(response.user);
            setLoading(false);
            setError(null);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    }

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

export async function getStaticProps(context) {
    const formMessages = await import(`../../public/locales/form/${context.locale}.json`);
    const commonMessages = await import(`../../public/locales/common/${context.locale}.json`);
    const validationMessages = await import(`../../public/locales/validation/${context.locale}.json`);
    const responseMessages = await import(`../../public/locales/response/${context.locale}.json`);

    return {
        props: {
            messages: {
                ...formMessages.default,
                ...commonMessages.default,
                ...validationMessages.default,
                ...responseMessages.default,
            },
        },
    };
}


export default Profile;