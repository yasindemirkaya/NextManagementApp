import { useEffect, useState } from 'react';
import { Card, Button, Spinner, Alert } from 'react-bootstrap';
import { formatAccountStatus } from '@/helpers/formatAccountItems';
import styles from './index.module.scss';
import axios from '@/utils/axios';
import { useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import Link from 'next/link';

const GroupProfileCard = ({ userGroup, loading, error, from }) => {
    console.log(userGroup)
    const [isEditing, setIsEditing] = useState(false);
    const [membersInfo, setMembersInfo] = useState([]);
    const loggedInUser = useSelector(state => state.user.user);

    useEffect(() => {
        if (userGroup && userGroup.members && userGroup.members.length > 0) {
            fetchMembers();
        }
    }, [userGroup]);

    // Get User Group Members
    const fetchMembers = async () => {
        try {
            const memberPromises = userGroup.members.map(id =>
                axios.get('/private/user/get-user-by-id', {
                    params: { id },
                })
            );

            const responses = await Promise.all(memberPromises);

            const successfulMembers = responses
                .filter(response => response.code === 1)
                .map(response => response.user);

            setMembersInfo(successfulMembers);
        } catch (err) {
            console.warn('Error when fetching group members.', err);
        }
    };

    // Handle Edit
    const handleEditClick = () => setIsEditing(true);

    const editButtonDisplayer = (loggedInUser) => {
        if (loggedInUser && loggedInUser.role !== 0) {
            return true;
        }
        return false;
    };

    if (loading) {
        return <div className={styles.loadingContainer}><Spinner animation="border" variant="primary" /></div>;
    }

    if (error || !userGroup) {
        return <Alert variant="warning">User data is not available. Please try again later.</Alert>;
    }

    return (
        <div className={styles.profileContainer}>
            {!isEditing ? (
                <Card className={styles.profileCard}>
                    <Card.Body>
                        <Card.Title>User Group Information</Card.Title>
                        <div className={styles.profileInfo}>
                            {/* Group Name */}
                            <p><strong>Group Name:</strong> {userGroup.group_name}</p>
                            {/* Description */}
                            <p><strong>Description:</strong> {userGroup.description}</p>
                            {/* Group Leader */}
                            <p><strong>Group Leader:</strong> {userGroup.group_leader}</p>
                            {/* Group Status */}
                            <p><strong>Group Status:</strong> {formatAccountStatus(userGroup.is_active)}</p>
                            {/* Group Type */}
                            <p><strong>Group Type:</strong> {userGroup.type}</p>
                            {/* Group Members */}
                            <div className={styles.groupMembers}>
                                <strong>Group Members:</strong>
                                {loading ? (
                                    <Spinner animation="border" />
                                ) : error ? (
                                    <Alert variant="danger">{error}</Alert>
                                ) : membersInfo.length > 0 ? (
                                    <ul>
                                        {membersInfo.map(member => (
                                            <li key={member.id}>
                                                <Link
                                                    href={`/user-management/view-users/${member.first_name.toLowerCase()}-${member.last_name.toLowerCase()}-${member.id}`}
                                                    className={styles.memberLink}
                                                >
                                                    <strong>{member.first_name + ' ' + member.last_name}</strong> ({member.email})
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>No members in this group.</p>
                                )}
                            </div>

                            {/* Created By */}
                            <p className={styles.infoText}>*This user group is created by {userGroup.created_by}</p>
                            {/* Updated By */}
                            {
                                userGroup.updated_by ?
                                    (<p className={styles.infoText}>*The last update for this account is made by {userGroup.updated_by}</p>)
                                    : null
                            }
                        </div>
                        {editButtonDisplayer(loggedInUser) ? (<Button variant="primary" onClick={handleEditClick}>Edit</Button>) : null}
                    </Card.Body>
                </Card>
            ) : (
                <div className={styles.editProfileContainer}>
                    <EditProfileCard userData={user} onCancel={handleCancelClick} />
                </div>
            )}
        </div>
    )
}

export default GroupProfileCard