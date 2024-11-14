import { useEffect, useState } from 'react';
import { Card, Button, Spinner, Alert, Badge } from 'react-bootstrap';
import styles from './index.module.scss';
import axios from "@/utils/axios";
import { mobileFormatter } from '@/helpers/mobileFormatter';
import EditProfileCard from '../EditProfile/index';

const ProfileCard = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (token) getUser();
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

    const handleEditClick = () => setIsEditing(true);

    const handleCancelClick = () => {
        getUser();
        setIsEditing(false);
    };

    const formatAccountRole = (role) => (
        <Badge bg={
            role === 0 ? "primary" : role === 1 ? "success" : role === 2 ? "danger" : "warning"
        }>
            {role === 0 ? "Standard User" : role === 1 ? "Admin" : role === 2 ? "Super Admin" : "Undefined Role"}
        </Badge>
    );

    const formatAccountStatus = (status) => (
        <Badge bg={status === 1 ? "success" : "danger"}>
            {status === 1 ? "Active" : "Not Active"}
        </Badge>
    );

    const formatAccountVerification = (verification) => (
        <Badge bg={verification === 1 ? "success" : "danger"}>
            {verification === 1 ? "Verified" : "Not Verified"}
        </Badge>
    );

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
                        <Button variant="primary" onClick={handleEditClick}>Edit</Button>
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
