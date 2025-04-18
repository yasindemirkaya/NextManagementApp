import { useEffect, useState } from 'react';
import { Card, Button, Spinner, Alert } from 'react-bootstrap';
import { formatAccountStatus } from '@/helpers/formatAccountItems';
import styles from './index.module.scss';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import EditGroupProfileCard from '../EditGroup';
import { getUserById } from '@/services/userApi';
import { useTranslations } from 'next-intl';

const GroupProfileCard = ({ userGroup, loading, error, getUserGroupDetails }) => {
    const t = useTranslations();
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
            const memberPromises = userGroup.members.map(id => getUserById(id));

            const responses = await Promise.all(memberPromises);

            const successfulMembers = responses
                .filter(response => response.success)
                .map(response => response.data);

            setMembersInfo(successfulMembers);
        } catch (err) {
            console.warn('Error when fetching group members.', err);
        }
    };

    // Handle Edit
    const handleEditClick = () => setIsEditing(true);

    // Handle Cancle
    const handleCancelClick = () => {
        getUserGroupDetails(userGroup._id);
        fetchMembers()
        setIsEditing(false);
    };

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
        return <Alert variant="warning">{t("User data is not available Please try again later")}</Alert>;
    }

    return (
        <div className={styles.profileContainer}>
            {!isEditing ? (
                <Card className={styles.profileCard}>
                    <Card.Body>
                        <Card.Title>{t("User Group Information")}</Card.Title>
                        <div className={styles.profileInfo}>
                            {/* Group Name */}
                            <p><strong>{t("Group Name")}:</strong> {userGroup.group_name}</p>
                            {/* Description */}
                            <p><strong>{t("Description")}:</strong> {userGroup.description}</p>
                            {/* Group Leader */}
                            <p><strong>{t("Group Leader")}:</strong> {userGroup.group_leader}</p>
                            {/* Group Status */}
                            <p><strong>{t("Group Status")}:</strong> {formatAccountStatus(userGroup.is_active)}</p>
                            {/* Group Type */}
                            <p><strong>{t("Group Type")}:</strong> {userGroup.type}</p>
                            {/* Group Members */}
                            <div className={styles.groupMembers}>
                                <strong>{t("Group Members")}:</strong>
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
                                    <p>{t("No members in this group")}</p>
                                )}
                            </div>

                            {/* Created By */}
                            <p className={styles.infoText}>*{t("This user group is created by")} <b>{userGroup.created_by}</b></p>
                            {/* Updated By */}
                            {
                                userGroup.updated_by ?
                                    (<p className={styles.infoText}>*{t("The last update for this account is made by")} <b>{userGroup.updated_by}</b></p>)
                                    : null
                            }
                        </div>
                        {editButtonDisplayer(loggedInUser) ? (<Button variant="primary" onClick={handleEditClick}>{t("Edit")}</Button>) : null}
                    </Card.Body>
                </Card>
            ) : (
                <div className={styles.editProfileContainer}>
                    <EditGroupProfileCard userGroupData={userGroup} onCancel={handleCancelClick} />
                </div>
            )}
        </div>
    )
}

export default GroupProfileCard