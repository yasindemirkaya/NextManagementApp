import { useState, useEffect } from 'react';
import { Card, Button, Form, Row, Col } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import InputMask from 'react-input-mask';
import styles from './index.module.scss';
import axios from '@/utils/axios';
import ChangePassword from '../ChangePassword';
import { isSelf } from '@/helpers/isSelf';
import { useDispatch, useSelector } from 'react-redux';
import { clearUser } from '@/redux/userSlice';

const EditProfileCard = ({ userData, onCancel }) => {
    const loggedInUser = useSelector(state => state.user.user);
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    const changePasswordText = !isSelf(token, userData.id) ? "Change this user's password." : "I want to change my password."
    const deleteAccountText = !isSelf(token, userData.id) ? "Delete this user's account." : "I want to delete my account."

    const router = useRouter();
    const dispatch = useDispatch();
    const { register, handleSubmit, formState: { errors }, setValue } = useForm({
        defaultValues: {
            firstName: userData.first_name,
            lastName: userData.last_name,
            email: userData.email,
            mobile: userData.mobile,
            isActive: userData.is_active === 1,
            isVerified: userData.is_verified === 1,
            role: userData.role || 0,
        }
    });

    const [isActive, setIsActive] = useState(userData.is_active === 1);
    const [isVerified, setIsVerified] = useState(userData.is_verified === 1);
    const [role, setRole] = useState(userData.role || 0);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const formattedMobile = userData.mobile.replace(/^(\d{3})(\d{3})(\d{4})$/, "($1) $2-$3");
        setValue("mobile", formattedMobile);
    }, [userData.mobile, setValue]);

    // Kullanıcının kendi profilini güncellediği servis
    const updateUser = async (data) => {
        const formattedMobile = data.mobile.replace(/\D/g, '');

        const updatedData = {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            mobile: formattedMobile,
            isActive: isActive ? 1 : 0,
            isVerified: isVerified ? 1 : 0,
        };

        // Kullanıcı kendini güncellediği için updatedBy kısmına kendi ID'sini geçiyoruz.
        updatedData.updatedBy = loggedInUser.id;

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
    }

    // Kullanıcının bir başka profili güncellediği servis
    const updateUserById = async (data) => {
        const formattedMobile = data.mobile.replace(/\D/g, '');

        const updatedData = {};

        // Kullanıcı verilerini güncellenmesi
        updatedData.first_name = data.firstName;
        updatedData.last_name = data.lastName;
        updatedData.email = data.email;
        updatedData.mobile = formattedMobile;
        updatedData.is_active = isActive ? 1 : 0;

        // Sadece super admin yetkisine sahip kullanıcılar buradan hesap verify edebilir
        if (loggedInUser.role === 2) {
            updatedData.is_verified = isVerified ? 1 : 0;
        }

        // Super Admin ve Adminler bir başkasının rolünü güncelleyebilir
        if (loggedInUser.role !== 0) {
            updatedData.role = role
        }

        // Güncellemeyi yapan kişinin ID'sini updated_by olarak gönderiyoruz
        updatedData.updated_by = loggedInUser.id;

        // Güncellenen kişinin ID'sini de requeste ekliyoruz
        updatedData.id = userData.id

        try {
            const response = await axios.put(`/private/user/update-user-by-id`, updatedData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.code === 1) {
                Swal.fire({
                    title: response.message,
                    icon: 'success'
                });
            } else {
                Swal.fire({
                    title: response.message,
                    icon: 'error'
                });
            }
        } catch (error) {
            console.error('Error updating user by ID:', error);
            Swal.fire({
                title: 'User could not be updated.',
                icon: 'error',
                text: 'An error occurred. Please try again.'
            });
        }
    }

    // Kullanıcının kendi profilini sildiği servis
    const deleteUser = async () => {
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
                    dispatch(clearUser());
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
    }

    // Kullanıcının bir başka profili sildiği servis
    const deleteUserById = async (userId) => {
        const confirmation = await Swal.fire({
            title: 'Are you sure?',
            text: "This user account will be permanently deleted and cannot be recovered.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        });

        if (confirmation.isConfirmed) {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.delete('/private/user/delete-user-by-id', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    data: {
                        userId: userId,
                    },
                });

                if (response.code === 1) {
                    Swal.fire({
                        title: 'Account Deleted',
                        text: 'The user account has been deleted successfully.',
                        icon: 'success'
                    });
                    setTimeout(() => {
                        router.push('/user-management/view-users')
                    }, 1000);
                } else {
                    Swal.fire({
                        title: 'Error',
                        text: response.message || 'User account could not be deleted. Please try again.',
                        icon: 'error'
                    });
                }
            } catch (error) {
                console.error('Error deleting user by ID:', error);
                Swal.fire({
                    title: 'Error',
                    text: 'An error occurred while deleting the user. Please try again later.',
                    icon: 'error'
                });
            }
        }
    };

    const handleSave = async (data) => {
        if (isSelf(token, userData.id)) {
            updateUser(data)
        } else {
            updateUserById(data)
        }
    };

    const handleDeleteAccount = async () => {
        if (isSelf(token, userData.id)) {
            deleteUser()
        } else {
            deleteUserById(userData.id)
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
    const roleDisplayer = (loggedInUser, token, userData) => {
        // Kendini güncellerken role alanı görünmez. Çünkü kullanıcı kendi rolünü değiştiremez
        if (isSelf(token, userData.id)) {
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
    const deleteAccountDisplayer = (loggedInUser, token, userData) => {
        // Kullanıcını kendini düzenlerken hesap silme özelliğini görebilir
        if (isSelf(token, userData.id)) {
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
        <Card className={styles.profileEditCard}>
            <Card.Body>
                <Card.Title>Edit Profile</Card.Title>
                <Form onSubmit={handleSubmit(handleSave)}>
                    {/* Name */}
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

                    {/* Surname */}
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

                    {/* Email */}
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

                    {/* Mobile */}
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

                    {/* Role (Sadece adminler başkasını güncellerken görünür. Kullanıcı kendi rolünü değiştiremez */}
                    {roleDisplayer(loggedInUser, token, userData) ? (
                        <Form.Group className="mb-3">
                            <Form.Label>Role</Form.Label>
                            <div>
                                <Form.Check
                                    type="radio"
                                    label="Standard User"
                                    name="role"
                                    value="0"
                                    checked={role === 0}
                                    onChange={(e) => setRole(parseInt(e.target.value))}
                                />
                                <Form.Check
                                    type="radio"
                                    label="Admin"
                                    name="role"
                                    value="1"
                                    checked={role === 1}
                                    onChange={(e) => setRole(parseInt(e.target.value))}
                                />
                                {/* Only Super Admins can see this */}
                                {loggedInUser && loggedInUser.role == 2 ? (
                                    <Form.Check
                                        type="radio"
                                        label="Super Admin"
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
                        <Form.Label>Account Status</Form.Label>
                        <Form.Check
                            type="switch"
                            id="isActive"
                            name="isActive"
                            checked={isActive}
                            onChange={(e) => setIsActive(e.target.checked)}
                        />
                    </Form.Group>

                    {/* Account Verification */}
                    {visibleForSuperAdmins(loggedInUser) ? (
                        <Form.Group className="mb-3">
                            <Form.Label>Account Verification</Form.Label>
                            <Form.Check
                                type="switch"
                                id="isVerified"
                                name="isVerified"
                                checked={isVerified}
                                onChange={(e) => setIsVerified(e.target.checked)}
                            />
                        </Form.Group>
                    ) : null}

                    <Button variant="primary" type="submit">Save</Button>
                    <Button variant="secondary" className="ms-2" onClick={onCancel}>Back</Button>
                </Form>

                <Row className="mt-3">
                    <Col md={12}>
                        <div onClick={() => setShowModal(true)} className={styles.link}>
                            <p className="text-primary">{changePasswordText}</p>
                        </div>
                    </Col>

                    {/* Bir admin sadece kendisinin ve rolü 0 olan bir kullanıcının hesabını silebilir */}
                    {deleteAccountDisplayer(loggedInUser, token, userData) ? (
                        <Col md={12}>
                            <div onClick={handleDeleteAccount} className={styles.link}>
                                <p className="text-danger">{deleteAccountText}</p>
                            </div>
                        </Col>
                    ) : null}
                </Row>

                <ChangePassword show={showModal} onHide={() => setShowModal(false)} />
            </Card.Body>
        </Card>
    );
};

export default EditProfileCard;
