import { Modal, Button, Form, InputGroup } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import axios from '@/utils/axios';
import Cookies from 'js-cookie';
import { useDispatch } from 'react-redux';
import { clearUser } from '@/redux/userSlice';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { icons } from '@/static/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { changePassword, changePasswordById } from '@/services/userApi';

const ChangePassword = ({ show, onHide, isSelf, userId }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch
    } = useForm();

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const togglePasswordVisibility = (type) => {
        if (type === 'current') {
            setShowCurrentPassword((prev) => !prev);
        } else if (type === 'new') {
            setShowNewPassword((prev) => !prev);
        } else if (type === 'confirm') {
            setShowConfirmPassword((prev) => !prev);
        }
    };

    const dispatch = useDispatch();
    const router = useRouter();

    // Kullanıcının kendi şifresini güncellediği servis
    const handleChangePassword = async (data) => {
        try {
            const response = await changePassword(data);

            if (response.code === 1) {
                Swal.fire({
                    title: 'Password Changed',
                    icon: 'success',
                    text: response.message,
                });
                onHide();
                reset();

                // Kullanıcı şifresini değiştirdikten sonra logout edilir
                setTimeout(() => {
                    Swal.close();
                    Cookies.remove('token');
                    dispatch(clearUser());
                    router.push('/login');
                }, 2000);
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

    // Yöneticilerin diğer kullanıcıların şifrelerini güncellediği servis
    const handleChangePasswordById = async (data) => {
        try {
            const response = await changePasswordById(data, userId);

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
    }

    const onSubmit = async (data) => {
        if (isSelf) {
            handleChangePassword(data)
        } else {
            handleChangePasswordById(data)
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
                    {/* Current Password (Only visible when updating yourself) */}
                    {isSelf ? (
                        <Form.Group className="mb-3">
                            <Form.Label>Current Password</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    type={showCurrentPassword ? "text" : "password"}
                                    placeholder="Enter current password"
                                    isInvalid={!!errors.currentPassword}
                                    {...register("currentPassword", {
                                        required: "Current password is required"
                                    })}
                                />
                                <InputGroup.Text
                                    onClick={() => togglePasswordVisibility('current')}
                                    style={{ cursor: "pointer" }}
                                >
                                    <FontAwesomeIcon icon={showCurrentPassword ? icons.faEyeSlash : icons.faEye} />
                                </InputGroup.Text>
                            </InputGroup>
                            <Form.Control.Feedback type="invalid">
                                {errors.currentPassword?.message}
                            </Form.Control.Feedback>
                        </Form.Group>
                    ) : null}
                    {/* New Password */}
                    <Form.Group className="mb-3">
                        <Form.Label>New Password</Form.Label>
                        <InputGroup>
                            <Form.Control
                                type={showNewPassword ? "text" : "password"}
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
                            <InputGroup.Text
                                onClick={() => togglePasswordVisibility('new')}
                                style={{ cursor: "pointer" }}
                            >
                                <FontAwesomeIcon icon={showNewPassword ? icons.faEyeSlash : icons.faEye} />
                            </InputGroup.Text>
                        </InputGroup>
                        <Form.Control.Feedback type="invalid">
                            {errors.newPassword?.message}
                        </Form.Control.Feedback>
                    </Form.Group>

                    {/* Confirm Password */}
                    <Form.Group className="mb-3">
                        <Form.Label>Confirm New Password</Form.Label>
                        <InputGroup>
                            <Form.Control
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm new password"
                                isInvalid={!!errors.confirmPassword}
                                {...register("confirmPassword", {
                                    required: "Please confirm your new password",
                                    validate: (value) =>
                                        value === watch("newPassword") || "Passwords do not match"
                                })}
                            />
                            <InputGroup.Text
                                onClick={() => togglePasswordVisibility('confirm')}
                                style={{ cursor: "pointer" }}
                            >
                                <FontAwesomeIcon icon={showConfirmPassword ? icons.faEyeSlash : icons.faEye} />
                            </InputGroup.Text>
                        </InputGroup>
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
