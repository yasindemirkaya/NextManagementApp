import { useState } from 'react';
import { Card, Button, Form } from 'react-bootstrap';
import styles from './index.module.scss';

const ProfileEditCard = ({ user, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        isActive: user.isActive,
        isVerified: user.isVerified,
        role: user.role,
    });

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = () => {
        // Kaydetme işlemini burada yapacağız (API çağrısı vb.)
        onSave(formData);
    };

    return (
        <Card className={styles.profileEditCard}>
            <Card.Body>
                <Card.Title>Profil Düzenle</Card.Title>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Ad</Form.Label>
                        <Form.Control
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Soyad</Form.Label>
                        <Form.Control
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Telefon Numarası</Form.Label>
                        <Form.Control
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Check
                            type="checkbox"
                            label="Hesap Aktif"
                            name="isActive"
                            checked={formData.isActive}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Check
                            type="checkbox"
                            label="Hesap Doğrulandı"
                            name="isVerified"
                            checked={formData.isVerified}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Rol</Form.Label>
                        <Form.Control
                            type="text"
                            name="role"
                            value={formData.role}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                    <Button variant="primary" onClick={handleSubmit}>
                        Kaydet
                    </Button>
                    <Button variant="secondary" onClick={onCancel} className="ms-2">
                        İptal
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default ProfileEditCard;