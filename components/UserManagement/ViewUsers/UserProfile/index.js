import { Card, Button, Spinner, Alert, Badge } from 'react-bootstrap';
import styles from './index.module.scss';

const ProfileCard = ({ user, loading, error }) => {
    if (loading) {
        return <div className={styles.loadingContainer}><Spinner animation="border" variant="primary" /></div>;
    }

    return (
        <div className={styles.profileContainer}>
            {user ? (
                <Card className={styles.profileCard}>
                    <Card.Body>
                        <Card.Title>Profile Information</Card.Title>
                        <div className={styles.profileInfo}>
                            <p><strong>Name:</strong> {user.first_name}</p>
                            <p><strong>Surname:</strong> {user.last_name}</p>
                            <p><strong>Email:</strong> {user.email}</p>
                            <p><strong>Mobile:</strong> {user.mobile}</p>
                            <p><strong>Account Status:</strong> {user.is_active}</p>
                            <p><strong>Verification Status:</strong> {user.is_verified}</p>
                            <p><strong>Account Role:</strong> {user.role}</p>
                        </div>
                    </Card.Body>
                </Card>
            ) : (
                <div className={styles.editProfileContainer}>
                    <Alert variant="warning">User data is not available. Please try again later.</Alert>
                </div>
            )}
        </div>
    );
};

export default ProfileCard;