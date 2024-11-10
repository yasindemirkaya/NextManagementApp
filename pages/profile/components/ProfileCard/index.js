import { useEffect, useState } from 'react';
import { Card, Button, Spinner } from 'react-bootstrap';
import styles from './index.module.scss';
import axios from 'axios';
import { mobileFormatter } from '@/helpers/mobileFormatter';


const ProfileCard = ({ onEdit }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('/api/public/users/get-user', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setUser(response.data.user);
                setLoading(false);
            } catch (err) {
                setError('Kullanıcı verileri alınırken bir hata oluştu.');
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    // Format user account
    const formatAccountRole = (role) => {
        switch (role) {
            case 0:
                return 'Standard User'
            case 1:
                return 'Admin'
            case 2:
                return 'Super Admin'
            default:
                return 'Undefined Role'
        }
    }

    const formatAccountStatus = (status) => {
        switch (status) {
            case 0:
                return 'Not Active'
            case 1:
                return 'Active'
            default:
                return 'Undefined Status'
        }
    }

    const formatAccountVerification = (verification) => {
        switch (verification) {
            case 0:
                return 'Not Verified'
            case 1:
                return 'Verified'
            default:
                return 'Undefined Verification'
        }
    }


    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <Card className={styles.profileCard}>
            <Card.Body>
                <Card.Title>Profile Information</Card.Title>
                <div className={styles.profileInfo}>
                    <p><strong>Name:</strong> {user.first_name}</p>
                    <p><strong>Surname:</strong> {user.last_name}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Mobile:</strong> {mobileFormatter(user.mobile)}</p>
                    <p><strong>Account Status:</strong> {formatAccountStatus(user.is_active)}</p>
                    <p><strong>Verification Status:</strong> {formatAccountVerification(user.is_active)}</p>
                    <p><strong>Account Role:</strong> {formatAccountRole(user.role)}</p>
                </div>
                <Button variant="primary" onClick={onEdit}>Edit</Button>
            </Card.Body>
        </Card>
    );
};

export default ProfileCard;