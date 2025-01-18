import { useState } from 'react';
import { Container, Card, Button, Spinner, Alert } from 'react-bootstrap';
import styles from './index.module.scss';
import { mobileFormatter } from '@/helpers/mobileFormatter';
import { formatAccountRole, formatAccountStatus, formatAccountVerification } from '@/helpers/formatAccountItems';
import EditProfileCard from '../EditProfile';
import { isSelf } from '@/helpers/isSelf';
import { useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import { useTranslations } from 'use-intl';

const ProfileCard = ({ user, loading, error, from, getUser, getUserDetails }) => {
    const t = useTranslations();
    const [isEditing, setIsEditing] = useState(false);
    const token = Cookies.get('token');
    const loggedInUser = useSelector(state => state.user.user);
    const language = useSelector(state => state.settings.userSettings.language)

    // Handle Edit
    const handleEditClick = () => setIsEditing(true);

    // Handle Cancle
    const handleCancelClick = () => {
        // Eğer component profil sayfasında kullanıldıysa o zaman ProfileCard'a back yapıldığında kullanıcının kendisinin bilgileri setlemeliyiz.
        if (from == 'profile') {
            getUser();
        }
        // Eğer component viewUsers sayfasından bir başkasının profilini görüntülemek için kullanıldıysa o zaman back yapıldığında yine o kullanıcının bilgilerini setlemeliyiz, login olan kişininkini değil!
        else if (from == 'view-users') {
            getUserDetails(user.id)
        }
        setIsEditing(false);
    };

    const editButtonDisplayer = (loggedInUser, token, userId, from) => {
        // Kullanıcı kendini güncelliyorsa edit butonunu görmeli
        if (isSelf(token, userId)) {
            return true
        }

        if (loggedInUser && loggedInUser.role !== 0) {
            return true
        }

        if (from == 'profile') {
            return true
        }
    }

    if (loading) {
        return <div className={styles.loadingContainer}><Spinner animation="border" variant="primary" /></div>;
    }

    if (error || !user) {
        return <Alert variant="warning">{t("User data is not available Please try again later")}</Alert>;
    }

    return (
        <Container>
            {!isEditing ? (
                <Card className={styles.profileContainer}>
                    <Card.Body>
                        <Card.Title>{t("Profile Information")}</Card.Title>
                        <div className={styles.profileInfo}>
                            <p><strong>{t("Name")}:</strong> {user.first_name}</p>
                            <p><strong>{t("Surname")}:</strong> {user.last_name}</p>
                            <p><strong>{t("Email")}:</strong> {user.email}</p>
                            <p><strong>{t("Mobile")}:</strong> {mobileFormatter(user.mobile)}</p>
                            <p><strong>{t("Account Status")}:</strong> {formatAccountStatus(user.is_active, language)}</p>
                            <p><strong>{t("Verification Status")}:</strong> {formatAccountVerification(user.is_verified, language)}</p>
                            <p><strong>{t("Account Role")}:</strong> {formatAccountRole(user.role, language)}</p>
                            <p className={styles.infoText}>*{t("This account is created by")} <b>{' ' + user.created_by}</b></p>
                            {user.updated_by && <p className={styles.infoText}>*{t("The last update for this account is made by")} <b>{user.updated_by}</b></p>}
                        </div>
                        {editButtonDisplayer(loggedInUser, token, user.id, from) ? (<Button variant="primary" onClick={handleEditClick}>{t("Edit")}</Button>) : null}
                    </Card.Body>
                </Card>
            ) : (
                <div className={styles.editProfileContainer}>
                    <EditProfileCard userData={user} onCancel={handleCancelClick} />
                </div>
            )}
        </Container>
    );
};


export default ProfileCard;
