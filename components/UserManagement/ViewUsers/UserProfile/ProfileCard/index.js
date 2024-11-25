import { useState } from 'react';
import { Card, Button, Spinner, Alert } from 'react-bootstrap';
import styles from './index.module.scss';
import { mobileFormatter } from '@/helpers/mobileFormatter';
import { formatAccountRole, formatAccountStatus, formatAccountVerification } from '@/helpers/formatAccountItems';
import EditProfileCard from '../EditProfile';
import { isSelf } from '@/helpers/authorityDetector';

const ProfileCard = ({ user, loading, error, isStandardUser, from, getUser, getUserDetails }) => {
    const [isEditing, setIsEditing] = useState(false);
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    // Handle Edit
    const handleEditClick = () => setIsEditing(true);

    // Handle Cancle
    const handleCancelClick = () => {
        // Eğer component profil sayfasında kullanıldıysa o zaman ProfileCard'a back yapıldığında kullanıcının kendisinin bilgileri setlemeliyiz.
        if (from == 'profile') {
            getUser();
        }
        // Eğer component viewUsers sayfasından bir başkasının profilini görüntülemek için kullanıldıysa o zaman back yapıldığında yine o kullanıcının bilgilerini setlemeliyiz, login olan kişininkini değil!
        else if (from == 'viewUsers') {
            getUserDetails(user.id)
        }
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
                        {isSelf(token, user.id) || !isStandardUser || from == 'profile' ? (<Button variant="primary" onClick={handleEditClick}>Edit</Button>) : null}
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
