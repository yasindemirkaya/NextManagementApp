import { useState } from 'react';
import { Card, Button, Spinner, Alert } from 'react-bootstrap';
import styles from './index.module.scss';
import { mobileFormatter } from '@/helpers/mobileFormatter';
import { formatAccountRole, formatAccountStatus, formatAccountVerification } from '@/helpers/formatAccountItems';
import EditProfileCard from '../EditProfile';
import { isSelf } from '@/helpers/authorityDetector';

const ProfileCard = ({ user, loading, error, isSuperAdmin, from, getUser }) => {
    const [isEditing, setIsEditing] = useState(false);

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    const handleEditClick = () => setIsEditing(true);

    const handleCancelClick = () => {
        getUser();
        setIsEditing(false);
    };

    if (loading) {
        return <div className={styles.loadingContainer}><Spinner animation="border" variant="primary" /></div>;
    }

    if (error || !user) {
        return <Alert variant="warning">User data is not available. Please try again later.</Alert>;
    }

    return (
        <div className={styles.profileContainer}>
            {!isEditing ? (
                <Card className={styles.profileCard}>
                    <Card.Body>
                        <Card.Title>Profile Information</Card.Title>
                        <div className={styles.profileInfo}>
                            <p><strong>Name:</strong> {user.first_name}</p>
                            <p><strong>Surname:</strong> {user.last_name}</p>
                            <p><strong>Email:</strong> {user.email}</p>
                            <p><strong>Mobile:</strong> {mobileFormatter(user.mobile)}</p>
                            <p><strong>Account Status:</strong> {formatAccountStatus(user.is_active)}</p>
                            <p><strong>Verification Status:</strong> {formatAccountVerification(user.is_verified)}</p>
                            <p><strong>Account Role:</strong> {formatAccountRole(user.role)}</p>
                        </div>
                        {/* Kullanıcı kendini görüyorsa, super adminse ya da profil sayfasından geldiyse düzenleme aktif */}
                        {isSelf(token, user.id) || isSuperAdmin || from == 'profile' ? (<Button variant="primary" onClick={handleEditClick}>Edit</Button>) : null}
                    </Card.Body>
                </Card>
            ) : (
                <div className={styles.editProfileContainer}>
                    <EditProfileCard userData={user} onCancel={handleCancelClick} />
                </div>
            )}
        </div>
    );
};

export default ProfileCard;
