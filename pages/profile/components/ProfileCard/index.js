import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, setLoading, setError } from '@/redux/user';
import { Card, Button, Spinner, Alert, Badge } from 'react-bootstrap';
import styles from './index.module.scss';
import axios from "@/utils/axios"
import { mobileFormatter } from '@/helpers/mobileFormatter';

import EditProfileCard from '../EditProfile/index';

const ProfileCard = () => {
    const dispatch = useDispatch();

    // Get user info from user store
    const user = useSelector(state => state.user.user);
    const loading = useSelector(state => state.user.loading);
    const error = useSelector(state => state.user.error);

    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        // If user data is not available in the Redux store, send a request to the service.
        if (!user) {
            dispatch(setLoading(true));
            const token = localStorage.getItem('token');

            if (token) {
                axios.get('/private/user/get-user', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }).then(response => {
                    dispatch(setUser(response.user));
                    dispatch(setLoading(false));
                }).catch(error => {
                    dispatch(setError(error.message));
                    dispatch(setLoading(false));
                });
            }
        }
    }, [user, dispatch]); // Only fetch data if user is not already in the store

    // Activate edit mode
    const handleEditClick = () => {
        setIsEditing(true);
    };

    // Deactivate edit mode
    const handleCancelClick = () => {
        setIsEditing(false);
    };

    // Format user account role
    const formatAccountRole = (role) => {
        switch (role) {
            case 0:
                return <Badge bg="primary">Standard User</Badge>;
            case 1:
                return <Badge bg="success">Admin</Badge>;
            case 2:
                return <Badge bg="danger">Super Admin</Badge>;
            default:
                return <Badge bg="warning">Undefined Role</Badge>;
        }
    };

    // Format user status
    const formatAccountStatus = (status) => {
        switch (status) {
            case 0:
                return <Badge bg="danger">Not Active</Badge>;
            case 1:
                return <Badge bg="success">Active</Badge>;
            default:
                return <Badge bg="warning">Undefined Status</Badge>;
        }
    };

    // Format user verification status
    const formatAccountVerification = (verification) => {
        switch (verification) {
            case 0:
                return <Badge bg="danger">Not Verified</Badge>;
            case 1:
                return <Badge bg="success">Verified</Badge>;
            default:
                return <Badge bg="warning">Verification Unknown</Badge>;
        }
    };

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    // Check if user is null or undefined before trying to access user data
    if (!user || error) {
        return (
            <Alert variant="warning">
                User data is not available. Please try again later.
            </Alert>
        );
    }

    return (
        <div className={styles.profileContainer}>
            {!isEditing && (
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
            )}

            {isEditing && (
                <div className={styles.editProfileContainer}>
                    <EditProfileCard userData={user} onCancel={handleCancelClick} />
                </div>
            )}
        </div>
    );
};

export default ProfileCard;