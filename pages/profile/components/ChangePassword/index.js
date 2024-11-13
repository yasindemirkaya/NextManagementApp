import { useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import axios from '@/utils/axios';

const ChangePassword = ({ show, onHide }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setError,
        watch
    } = useForm();

    const onSubmit = async (data) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.patch('/private/user/change-password', data, {
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
                reset();
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
        reset();
        onHide();
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Change Password</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    {/* Current Password */}
                    <Form.Group className="mb-3">
                        <Form.Label>Current Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Enter current password"
                            isInvalid={!!errors.currentPassword}
                            {...register("currentPassword", {
                                required: "Current password is required"
                            })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.currentPassword?.message}
                        </Form.Control.Feedback>
                    </Form.Group>

                    {/* New Password */}
                    <Form.Group className="mb-3">
                        <Form.Label>New Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Enter new password"
                            isInvalid={!!errors.newPassword}
                            {...register("newPassword", {
                                required: "New password is required",
                                minLength: {
                                    value: 6,
                                    message: "New password must be at least 6 characters"
                                }
                            })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.newPassword?.message}
                        </Form.Control.Feedback>
                    </Form.Group>

                    {/* Confirm Password */}
                    <Form.Group className="mb-3">
                        <Form.Label>Confirm New Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Confirm new password"
                            isInvalid={!!errors.confirmPassword}
                            {...register("confirmPassword", {
                                required: "Please confirm your new password",
                                validate: (value) =>
                                    value === watch("newPassword") || "Passwords do not match"
                            })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.confirmPassword?.message}
                        </Form.Control.Feedback>
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
