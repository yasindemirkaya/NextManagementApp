import { useState } from 'react';
import { Card, Button, Spinner, Alert } from 'react-bootstrap';
import styles from './index.module.scss';
import EditProfileCard from '../EditProfile';
import { useSelector } from 'react-redux';

const ProfileCard = ({ groupType, loading, error, fetchGroupTypeById }) => {
    console.log(groupType)
    const [isEditing, setIsEditing] = useState(false);
    const loggedInUser = useSelector(state => state.user.user);

    // Handle Edit
    const handleEditClick = () => setIsEditing(true);

    // Handle Cancle
    const handleCancelClick = () => {
        fetchGroupTypeById(groupType.id)
        setIsEditing(false);
    };

    const editButtonDisplayer = (loggedInUser) => {
        // Sadece Super Admin'ler grup düzenleyebilir
        if (loggedInUser && loggedInUser.role == 2) {
            return true
        }
    }

    if (loading) {
        return <div className={styles.loadingContainer}><Spinner animation="border" variant="primary" /></div>;
    }

    if (error || !groupType) {
        return <Alert variant="warning">Group Type data is not available. Please try again later.</Alert>;
    }

    return (
        <div className={styles.profileContainer}>
            {!isEditing ? (
                <Card className={styles.profileCard}>
                    <Card.Body>
                        <Card.Title>Group Type Information</Card.Title>
                        <div className={styles.profileInfo}>
                            <p className='mt-3'><strong>Type Name:</strong> {groupType.type_name}</p>
                            <p className={styles.infoText}>*This account is created by {groupType.created_by}</p>
                            <p className={styles.infoText}>*The last update for this account is made by {groupType.updated_by}</p>
                        </div>
                        {editButtonDisplayer(loggedInUser) ? (<Button variant="primary" onClick={handleEditClick}>Edit</Button>) : null}
                    </Card.Body>
                </Card>
            ) : (
                <div className={styles.editProfileContainer}>
                    <EditProfileCard groupTypeData={groupType} onCancel={handleCancelClick} />
                </div>
            )}
        </div>
    );
};

export default ProfileCard;
