import { Card, Button } from 'react-bootstrap';
import styles from './index.module.scss';

const ProfileCard = ({ user, onEdit }) => {
    return (
        <Card className={styles.profileCard}>
            <Card.Body>
                <Card.Title>Profile Information</Card.Title>
                <div className={styles.profileInfo}>
                    <p><strong>Ad:</strong> {user.firstName}</p>
                    <p><strong>Soyad:</strong> {user.lastName}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Telefon Numarası:</strong> {user.phone}</p>
                    <p><strong>Hesap Durumu:</strong> {user.isActive ? "Aktif" : "Pasif"}</p>
                    <p><strong>Doğrulama Durumu:</strong> {user.isVerified ? "Doğrulandı" : "Doğrulanmadı"}</p>
                    <p><strong>Rol:</strong> {user.role}</p>
                </div>
                <Button variant="primary" onClick={onEdit}>Düzenle</Button>
            </Card.Body>
        </Card>
    );
};

export default ProfileCard;