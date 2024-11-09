import { useState } from 'react';
import ProfileCard from './components/ProfileCard';
import EditProfile from './components/EditProfile';
import { Container, Row, Col } from 'react-bootstrap';
import styles from './index.module.scss';

const Profile = () => {
    const [user, setUser] = useState({
        firstName: "John",
        lastName: "Doe",
        email: "johndoe@example.com",
        phone: "555-1234",
        isActive: true,
        isVerified: true,
        role: "Admin"
    });

    const [isEditing, setIsEditing] = useState(false);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = (updatedData) => {
        setUser(updatedData);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    return (
        <Container className={styles.profilePage}>
            <Row>
                <Col md={4}>
                    <ProfileCard user={user} onEdit={handleEdit} />
                </Col>
                <Col md={8}>
                    {isEditing && (
                        <EditProfile
                            user={user}
                            onSave={handleSave}
                            onCancel={handleCancel}
                        />
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default Profile;