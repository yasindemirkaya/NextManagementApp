import { useState, useEffect } from 'react';
import { Card, Button, Form, Row, Col } from 'react-bootstrap';
import Swal from 'sweetalert2';
import toast from '@/utils/toastify';
import { ToastContainer } from 'react-toastify';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import InputMask from 'react-input-mask';
import styles from './index.module.scss';
import ChangePassword from '../ChangePassword';
import { isSelf } from '@/helpers/isSelf';
import { useDispatch, useSelector } from 'react-redux';
import { clearUser } from '@/redux/userSlice';
import Cookies from 'js-cookie';
import { deleteUser, deleteUserById, updateUser, updateUserById } from '@/services/userApi';
import { useTranslations } from 'next-intl';

const EditProfileCard = ({ userData, onCancel }) => {
    const t = useTranslations()
    const loggedInUser = useSelector(state => state.user.user);

    const router = useRouter();
    const dispatch = useDispatch();
    const { register, handleSubmit, formState: { errors }, setValue } = useForm({
        defaultValues: {
            firstName: userData.first_name,
            lastName: userData.last_name,
            email: userData.email,
            mobile: userData.mobile,
            isActive: userData.is_active === true,
            isVerified: userData.is_verified === true,
            role: userData.role || 0,
        }
    });

    const [isActive, setIsActive] = useState(userData.is_active === true);
    const [isVerified, setIsVerified] = useState(userData.is_verified === true);
    const [role, setRole] = useState(userData.role || 0);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const formattedMobile = userData.mobile.replace(/^(\d{3})(\d{3})(\d{4})$/, "($1) $2-$3");
        setValue("mobile", formattedMobile);
    }, [userData.mobile, setValue]);

    // Kullanıcının kendi profilini güncellediği servis
    const handleUpdateUser = async (data) => {
        const formattedMobile = data.mobile.replace(/\D/g, '');

        const updatedData = {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            mobile: formattedMobile,
            isActive: isActive ? 1 : 0,
            isVerified: isVerified ? 1 : 0,
            updatedBy: loggedInUser.id, // Kullanıcı kendini güncellediği için kendi ID'si
        };

        try {
            const response = await updateUser(updatedData);

            if (response.code === 1) {
                toast('SUCCESS', response.message)
            } else {
                toast('ERROR', response.message)
            }
        } catch (error) {
            toast('ERROR', error.message)
        }
    };

    // Kullanıcının bir başka profili güncellediği servis
    const handleUpdateUserById = async (data) => {
        const formattedMobile = data.mobile.replace(/\D/g, '');

        const updatedData = {
            first_name: data.firstName,
            last_name: data.lastName,
            email: data.email,
            mobile: formattedMobile,
            is_active: isActive ? 1 : 0,
            updated_by: loggedInUser.id, // Güncelleyen kişinin ID'si
            id: userData.id, // Güncellenen kullanıcının ID'si
        };

        // Sadece super admin yetkisine sahip kullanıcılar buradan hesap verify edebilir
        if (loggedInUser.role === 2) {
            updatedData.is_verified = isVerified ? 1 : 0;
        }

        // Super Admin ve Adminler bir başkasının rolünü güncelleyebilir
        if (loggedInUser.role !== 0) {
            updatedData.role = role;
        }

        try {
            const response = await updateUserById(updatedData);

            if (response.code === 1) {
                toast('SUCCESS', response.message)
            } else {
                toast('ERROR', response.message)
            }
        } catch (error) {
            toast('SUCCESS', error.message)
        }
    };

    // Kullanıcının kendi profilini sildiği servis
    const handleDeleteUser = async () => {
        const confirmation = await Swal.fire({
            title: t('Are you sure?'),
            text: t('Your account will be permanently deleted and cannot be recovered'),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: t('Delete'),
            cancelButtonColor: '#3085d6',
            cancelButtonText: t('Cancel')
        });

        if (confirmation.isConfirmed) {
            try {
                const response = await deleteUser();

                if (response.code === 1) {
                    toast('SUCCESS', response.message || t('Your account has been deleted successfully.'))
                    Cookies.remove('token');
                    dispatch(clearUser());
                    router.push('/login');
                } else {
                    toast('ERROR', response.message || t('Account could not be deleted Please try again.'))
                }
            } catch (error) {
                toast('ERROR', t('An error occurred while deleting the account Please try again later'))
            }
        }
    };

    // Kullanıcının bir başka profili sildiği servis
    const handleDeleteUserById = async (userId) => {
        const confirmation = await Swal.fire({
            title: t('Are you sure?'),
            text: t('This account will be permanently deleted and cannot be recovered'),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: t('Delete'),
            cancelButtonColor: '#3085d6',
            cancelButtonText: t('Cancel')
        });

        if (confirmation.isConfirmed) {
            try {
                const response = await deleteUserById(userId);

                if (response.code === 1) {
                    toast('SUCCESS', response.message || t('The user account has been deleted successfully'))
                    setTimeout(() => {
                        router.push('/user-management/view-users');
                    }, 1000);
                } else {
                    toast('ERROR', response.message || t('User Account could not be deleted Please try again'))
                }
            } catch (error) {
                toast('ERROR', error.message || t('An error occurred while deleting the user Please try again later'))

            }
        }
    };

    const handleSave = async (data) => {
        if (isSelf((loggedInUser ? loggedInUser.id : null), userData.id)) {
            handleUpdateUser(data)
        } else {
            handleUpdateUserById(data)
        }
    };

    const handleDeleteAccount = async () => {
        if (isSelf((loggedInUser ? loggedInUser.id : null), userData.id)) {
            handleDeleteUser()
        } else {
            handleDeleteUserById(userData.id)
        }
    };

    // Account Verification hangi durumlarda ekranda gösterilecek
    const visibleForSuperAdmins = (loggedInUser) => {
        if (loggedInUser && loggedInUser.role == 2) {
            return true
        } else {
            return false
        }
    }

    // Role hangi durumlarda ekranda gösterilecek
    const roleDisplayer = (loggedInUser, userData) => {
        // Kendini güncellerken role alanı görünmez. Çünkü kullanıcı kendi rolünü değiştiremez
        if (isSelf((loggedInUser ? loggedInUser.id : null), userData.id)) {
            return false
        } else {
            // Bir başkasını güncellerken role alanını sadece Adminler görür, standart kullanıcı zaten bir başkasını güncelleyemiyor.
            if (loggedInUser && loggedInUser.role != 0) {
                return true
            } else {
                return false
            }
        }
    }

    // Account silme özelliği hangi durumlarda hangi kullanıcılara gösterilecek
    const deleteAccountDisplayer = (loggedInUser, userData) => {
        // Kullanıcını kendini düzenlerken hesap silme özelliğini görebilir
        if (isSelf((loggedInUser ? loggedInUser.id : null), userData.id)) {
            return true
        }

        // Standard kullanıcılar bir başkasını güncelleyemediği için zaten bu alanı göremez
        if (loggedInUser && loggedInUser.role !== 0) {
            // Eğer düzenlemeyi yapan kişi Admin ise sadece bir standard userın hesabını silebilir. Admin ya da Super Admin hesabı silemez
            if (loggedInUser.role === 1) {
                if (userData.role === 0) {
                    return true
                } else {
                    return false
                }
            } else {
                return true
            }
        } else {
            return false
        }
    }

    return (
        <>
            <Card className={styles.editProfileContainer}>
                <Card.Body>
                    <Card.Title>{t("Edit Profile")}</Card.Title>
                    <Form onSubmit={handleSubmit(handleSave)}>
                        {/* Name */}
                        <Form.Group className="mb-3">
                            <Form.Label>{t("Name")}</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder={t("Enter your first name")}
                                {...register("firstName", {
                                    required: t("Name is required"),
                                    minLength: { value: 2, message: t("Name must be at least 2 characters") },
                                    pattern: { value: /^[a-zA-Z\s]*$/, message: t("Name cannot contain numeric characters") },
                                })}
                                isInvalid={!!errors.firstName}
                            />
                            <Form.Control.Feedback type="invalid">{errors.firstName?.message}</Form.Control.Feedback>
                        </Form.Group>

                        {/* Surname */}
                        <Form.Group className="mb-3">
                            <Form.Label>{t("Surname")}</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder={t("Enter your last name")}
                                {...register("lastName", {
                                    required: t("Surname is required"),
                                    minLength: { value: 2, message: t("Surname must be at least 2 characters") },
                                    pattern: { value: /^[a-zA-Z\s]*$/, message: t("Surname cannot contain numeric characters") },
                                })}
                                isInvalid={!!errors.lastName}
                            />
                            <Form.Control.Feedback type="invalid">{errors.lastName?.message}</Form.Control.Feedback>
                        </Form.Group>

                        {/* Email */}
                        <Form.Group className="mb-3">
                            <Form.Label>{t("Email")}</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder={t("Enter your email")}
                                {...register("email", {
                                    required: t("Email is required"),
                                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: t("Invalid email format") },
                                })}
                                isInvalid={!!errors.email}
                            />
                            <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
                        </Form.Group>

                        {/* Mobile */}
                        <Form.Group className="mb-3">
                            <Form.Label>{t("Mobile")}</Form.Label>
                            <InputMask
                                mask="(999) 999-9999"
                                {...register("mobile", {
                                    required: t("Mobile is required"),
                                    pattern: { value: /^\(\d{3}\) \d{3}-\d{4}$/, message: t("Invalid mobile format") },
                                })}
                            >
                                {(inputProps) => (
                                    <Form.Control
                                        {...inputProps}
                                        type="tel"
                                        placeholder={t("Enter your mobile number")}
                                        isInvalid={!!errors.mobile}
                                    />
                                )}
                            </InputMask>
                            <Form.Control.Feedback type="invalid">{errors.mobile?.message}</Form.Control.Feedback>
                        </Form.Group>

                        {/* Role (Sadece adminler başkasını güncellerken görünür. Kullanıcı kendi rolünü değiştiremez */}
                        {roleDisplayer(loggedInUser, userData) ? (
                            <Form.Group className="mb-3">
                                <Form.Label>{t("Role")}</Form.Label>
                                <div>
                                    <Form.Check
                                        type="radio"
                                        label={t("Standard User")}
                                        name="role"
                                        value="0"
                                        checked={role === 0}
                                        onChange={(e) => setRole(parseInt(e.target.value))}
                                    />
                                    <Form.Check
                                        type="radio"
                                        label={t("Admin")}
                                        name="role"
                                        value="1"
                                        checked={role === 1}
                                        onChange={(e) => setRole(parseInt(e.target.value))}
                                    />
                                    {/* Only Super Admins can see this */}
                                    {loggedInUser && loggedInUser.role == 2 ? (
                                        <Form.Check
                                            type="radio"
                                            label={t("Super Admin")}
                                            name="role"
                                            value="2"
                                            checked={role === 2}
                                            onChange={(e) => setRole(parseInt(e.target.value))}
                                        />
                                    ) : null}
                                </div>
                            </Form.Group>
                        ) : null}

                        {/* Account Status */}
                        <Form.Group className="mb-3">
                            <Form.Label>{t("Account Status")}</Form.Label>
                            <Form.Check
                                type="switch"
                                id="isActive"
                                name="isActive"
                                checked={isActive}
                                className={styles.formCheck}
                                onChange={(e) => setIsActive(e.target.checked)}
                            />
                        </Form.Group>

                        {/* Account Verification */}
                        {visibleForSuperAdmins(loggedInUser) ? (
                            <Form.Group className="mb-3">
                                <Form.Label>{t("Account Verification")}</Form.Label>
                                <Form.Check
                                    type="switch"
                                    id="isVerified"
                                    name="isVerified"
                                    checked={isVerified}
                                    className={styles.formCheck}
                                    onChange={(e) => setIsVerified(e.target.checked)}
                                />
                            </Form.Group>
                        ) : null}

                        <Button variant="primary" type="submit">{t("Save")}</Button>
                        <Button variant="secondary" className="ms-2" onClick={onCancel}>{t("Back")}</Button>
                    </Form>

                    <Row className="mt-3">
                        <Col md={12}>
                            <div onClick={() => setShowModal(true)} className={styles.link}>
                                <p className="text-success">{!isSelf(loggedInUser?.id, userData?.id) ? t("Change this user's password") : t("I want to change my password")}</p>
                            </div>
                        </Col>

                        {/* Bir admin sadece kendisinin ve rolü 0 olan bir kullanıcının hesabını silebilir */}
                        {deleteAccountDisplayer(loggedInUser, userData) ? (
                            <Col md={12}>
                                <div onClick={handleDeleteAccount} className={styles.link}>
                                    <p className="text-danger">{!isSelf(loggedInUser?.id, userData?.id) ? t("Delete this user's account") : t("I want to delete my account")}</p>
                                </div>
                            </Col>
                        ) : null}
                    </Row>

                    <ChangePassword show={showModal} onHide={() => setShowModal(false)} isSelf={isSelf((loggedInUser ? loggedInUser.id : null), userData.id)} userId={userData.id} />
                </Card.Body>
            </Card>
            <ToastContainer />
        </>

    );
};

export default EditProfileCard;
