import { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';
import axios from '@/utils/axios';

const ChangePassword = ({ show, onHide }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const validateField = (name, value) => {
        let error = '';

        switch (name) {
            case 'currentPassword':
                if (!value) error = 'Current password is required';
                break;
            case 'newPassword':
                if (!value) error = 'New password is required';
                else if (value.length < 6) error = 'New password must be at least 6 characters';
                break;
            case 'confirmPassword':
                if (!value) error = 'Please confirm your new password';
                else if (value !== newPassword) error = 'Passwords do not match';
                break;
            default:
                break;
        }

        // Hata mesajını güncellerken, direkt olarak errors state'ini update et
        setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();

        // Alanları doğrula
        validateField('currentPassword', currentPassword);
        validateField('newPassword', newPassword);
        validateField('confirmPassword', confirmPassword);

        // Eğer herhangi bir input boşsa servise gitme
        if (!currentPassword || !newPassword || !confirmPassword) {
            return;
        }

        // Hataları kontrol et, hata varsa servise gitme
        if (Object.values(errors).some(error => error !== '')) {
            return;
        }

        // Hata yoksa servise git
        try {
            const payload = {
                currentPassword,
                newPassword,
                confirmPassword
            };
            const token = localStorage.getItem('token');
            const response = await axios.patch('/private/user/change-password', payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.code === 1) {
                Swal.fire({
                    title: 'Password Changed',
                    icon: 'success',
                    text: response.message,
                });
                onHide();
            } else {
                Swal.fire({
                    title: 'Error',
                    icon: 'error',
                    text: response.message,
                });
            }
        } catch (error) {
            console.error('Error changing password:', error);
            Swal.fire({
                title: 'Error',
                icon: 'error',
                text: 'An error occurred. Please try again.',
            });
        }
    };

    const handleClose = () => {
        // Modal kapandığında inputları ve hata mesajlarını sıfırla
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setErrors({
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        });
        onHide(); // onHide'ı çağırarak modalı kapat
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Change Password</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleChangePassword}>
                    {/* Current Password */}
                    <Form.Group className="mb-3">
                        <Form.Label>Current Password</Form.Label>
                        <Form.Control
                            type="password"
                            value={currentPassword}
                            onChange={(e) => {
                                setCurrentPassword(e.target.value);
                                validateField('currentPassword', e.target.value);
                            }}
                            onBlur={() => validateField('currentPassword', currentPassword)}
                            isInvalid={!!errors.currentPassword}
                        />
                        <Form.Control.Feedback type="invalid">{errors.currentPassword}</Form.Control.Feedback>
                    </Form.Group>
                    {/* New Password */}
                    <Form.Group className="mb-3">
                        <Form.Label>New Password</Form.Label>
                        <Form.Control
                            type="password"
                            value={newPassword}
                            onChange={(e) => {
                                setNewPassword(e.target.value);
                                validateField('newPassword', e.target.value);
                            }}
                            onBlur={() => validateField('newPassword', newPassword)}
                            isInvalid={!!errors.newPassword}
                        />
                        <Form.Control.Feedback type="invalid">{errors.newPassword}</Form.Control.Feedback>
                    </Form.Group>
                    {/* Confirm Password */}
                    <Form.Group className="mb-3">
                        <Form.Label>Confirm New Password</Form.Label>
                        <Form.Control
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => {
                                setConfirmPassword(e.target.value);
                                validateField('confirmPassword', e.target.value);
                            }}
                            onBlur={() => validateField('confirmPassword', confirmPassword)}
                            isInvalid={!!errors.confirmPassword}
                        />
                        <Form.Control.Feedback type="invalid">{errors.confirmPassword}</Form.Control.Feedback>
                    </Form.Group>
                    {/* Submit Button */}
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit">
                            Change Password
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default ChangePassword;
