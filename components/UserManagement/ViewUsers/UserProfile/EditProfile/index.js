import { useState, useEffect } from 'react';
import { Card, Button, Form, Row, Col } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import InputMask from 'react-input-mask';
import styles from './index.module.scss';
import axios from '@/utils/axios';
import ChangePassword from '../ChangePassword';
import { isSuperAdmin } from '@/helpers/authorityDetector';

const EditProfileCard = ({ userData, onCancel }) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const changePasswordText = isSuperAdmin(token) ? "Change this user's password." : "I want to change my password."
    const deleteAccountText = isSuperAdmin(token) ? "Delete this user's account." : "I want to delete my account."

    const router = useRouter();
    const { register, handleSubmit, formState: { errors }, setValue } = useForm({
        defaultValues: {
            firstName: userData.first_name,
            lastName: userData.last_name,
            email: userData.email,
            mobile: userData.mobile,
        }
    });

    const [isActive, setIsActive] = useState(userData.is_active === 1);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const formattedMobile = userData.mobile.replace(/^(\d{3})(\d{3})(\d{4})$/, "($1) $2-$3");
        setValue("mobile", formattedMobile);
    }, [userData.mobile, setValue]);

    const handleSave = async (data) => {
        const formattedMobile = data.mobile.replace(/\D/g, '');

        const updatedData = {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            mobile: formattedMobile,
            isActive: isActive ? 1 : 0
        };

        try {
            const token = localStorage.getItem('token');
            const response = await axios.put('/private/user/update-user', updatedData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.code === 1) {
                Swal.fire({
                    title: response.message,
                    icon: 'success'
                });
            } else {
                Swal.fire({
                    title: response.message,
                    icon: 'error',
                });
            }
        } catch (error) {
            console.error('Error updating user data:', error);
            Swal.fire({
                title: 'User could not be updated.',
                icon: 'error',
                text: 'An error occurred. Please try again.'
            });
        }
    };

    const handleDeleteAccount = async () => {
        const confirmation = await Swal.fire({
            title: 'Are you sure?',
            text: "Your account will be permanently deleted and cannot be recovered.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        });

        if (confirmation.isConfirmed) {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.delete('/private/user/delete-user', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (response.code === 1) {
                    Swal.fire({
                        title: 'Account Deleted',
                        text: 'Your account has been deleted successfully.',
                        icon: 'success'
                    });
                    localStorage.removeItem('token')
                    router.push('/login');
                } else {
                    Swal.fire({
                        title: 'Error',
                        text: response.message || 'Account could not be deleted. Please try again.',
                        icon: 'error'
                    });
                }
            } catch (error) {
                console.error('Error deleting account:', error);
                Swal.fire({
                    title: 'Error',
                    text: 'An error occurred while deleting the account. Please try again later.',
                    icon: 'error'
                });
            }
        }
    };

    return (
        <Card className={styles.profileEditCard}>
            <Card.Body>
                <Card.Title>Edit Profile</Card.Title>
                <Form onSubmit={handleSubmit(handleSave)}>
                    <Form.Group className="mb-3">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter your first name"
                            {...register("firstName", {
                                required: "Name is required",
                                minLength: { value: 2, message: "Name must be at least 2 characters" },
                                pattern: { value: /^[a-zA-Z\s]*$/, message: "Name cannot contain numeric characters" },
                            })}
                            isInvalid={!!errors.firstName}
                        />
                        <Form.Control.Feedback type="invalid">{errors.firstName?.message}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Surname</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter your last name"
                            {...register("lastName", {
                                required: "Surname is required",
                                minLength: { value: 2, message: "Surname must be at least 2 characters" },
                                pattern: { value: /^[a-zA-Z\s]*$/, message: "Surname cannot contain numeric characters" },
                            })}
                            isInvalid={!!errors.lastName}
                        />
                        <Form.Control.Feedback type="invalid">{errors.lastName?.message}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter your email"
                            {...register("email", {
                                required: "Email is required",
                                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email format" },
                            })}
                            isInvalid={!!errors.email}
                        />
                        <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Mobile</Form.Label>
                        <InputMask
                            mask="(999) 999-9999"
                            {...register("mobile", {
                                required: "Mobile number is required",
                                pattern: { value: /^\(\d{3}\) \d{3}-\d{4}$/, message: "Invalid mobile format" },
                            })}
                        >
                            {(inputProps) => (
                                <Form.Control
                                    {...inputProps}
                                    type="tel"
                                    placeholder="Enter your mobile number"
                                    isInvalid={!!errors.mobile}
                                />
                            )}
                        </InputMask>
                        <Form.Control.Feedback type="invalid">{errors.mobile?.message}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Account Status</Form.Label>
                        <Form.Check
                            type="switch"
                            id="isActive"
                            name="isActive"
                            checked={isActive}
                            onChange={(e) => setIsActive(e.target.checked)}
                        />
                    </Form.Group>

                    <Button variant="primary" type="submit">Save</Button>
                    <Button variant="secondary" className="ms-2" onClick={onCancel}>Back</Button>
                </Form>

                <Row className="mt-3">
                    <Col md={12}>
                        <div onClick={() => setShowModal(true)} className={styles.link}>
                            <p className="text-primary">{changePasswordText}</p>
                        </div>
                    </Col>
                    <Col md={12}>
                        <div onClick={handleDeleteAccount} className={styles.link}>
                            <p className="text-danger">{deleteAccountText}</p>
                        </div>
                    </Col>
                </Row>

                <ChangePassword show={showModal} onHide={() => setShowModal(false)} />
            </Card.Body>
        </Card>
    );
};

export default EditProfileCard;
