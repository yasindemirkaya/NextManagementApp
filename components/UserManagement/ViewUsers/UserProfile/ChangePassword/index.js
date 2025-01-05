import { Modal, Button, Form, InputGroup } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import toast from '@/utils/toastify';
import { ToastContainer } from 'react-toastify';
import Cookies from 'js-cookie';
import { useDispatch } from 'react-redux';
import { clearUser } from '@/redux/userSlice';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { icons } from '@/static/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { changePassword, changePasswordById } from '@/services/userApi';
import styles from './index.module.scss'
import { useTranslations } from 'next-intl';

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

    const t = useTranslations();
    const dispatch = useDispatch();
    const router = useRouter();

    // Kullanıcının kendi şifresini güncellediği servis
    const handleChangePassword = async (data) => {
        try {
            const response = await changePassword(data);

            if (response.code === 1) {
                toast('SUCCESS', response.message)
                onHide();
                reset();

                // Kullanıcı şifresini değiştirdikten sonra logout edilir
                setTimeout(() => {
                    Cookies.remove('token');
                    dispatch(clearUser());
                    router.push('/login');
                }, 2000);
            } else {
                toast('ERROR', response.message)
            }
        } catch (error) {
            toast('ERROR', 'An error occurred. Please try again.')
        }
    };

    // Yöneticilerin diğer kullanıcıların şifrelerini güncellediği servis
    const handleChangePasswordById = async (data) => {
        try {
            const response = await changePasswordById(data, userId);

            if (response.code === 1) {
                toast('SUCCESS', response.message)
                onHide();
                reset();
            } else {
                toast('ERROR', response.message)
            }
        } catch (error) {
            toast('ERROR', response.message)
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
        <>
            <Modal show={show} onHide={handleClose} centered className={styles.modalContainer}>
                <Modal.Header closeButton>
                    <Modal.Title>{t("Change Password")}</Modal.Title>
                </Modal.Header>
                <Modal.Body className={styles.modalContainer}>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        {/* Current Password (Only visible when updating yourself) */}
                        {isSelf ? (
                            <Form.Group className="mb-3">
                                <Form.Label>Current Password</Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        type={showCurrentPassword ? "text" : "password"}
                                        placeholder={t("Enter current password")}
                                        isInvalid={!!errors.currentPassword}
                                        {...register("currentPassword", {
                                            required: t("Current password is required")
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
                            <Form.Label>{t("New Password")}</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    type={showNewPassword ? "text" : "password"}
                                    placeholder={t("Enter new password")}
                                    isInvalid={!!errors.newPassword}
                                    {...register("newPassword", {
                                        required: t("New password is required"),
                                        minLength: {
                                            value: 6,
                                            message: t("New password must be at least 6 characters")
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
                            <Form.Label>{t("Confirm New Password")}</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm new password"
                                    isInvalid={!!errors.confirmPassword}
                                    {...register("confirmPassword", {
                                        required: t("Please confirm your new password"),
                                        validate: (value) =>
                                            value === watch("newPassword") || t("Passwords do not match")
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
                                {t("Cancel")}
                            </Button>
                            <Button variant="primary" type="submit">
                                {t("Change Password")}
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal.Body>
            </Modal>
            <ToastContainer />
        </>
    );
};

export default ChangePassword;
