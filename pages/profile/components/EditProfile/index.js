import { useState, useRef } from 'react';
import { Card, Button, Form, Row } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux';
import { clearUser } from '@/redux/user';
import InputMask from 'react-input-mask';
import styles from './index.module.scss';

const EditProfileCard = ({ userData, onCancel }) => {
    const dispatch = useDispatch()
    const router = useRouter()
    const mobileInputRef = useRef(null);

    // DATA
    const [firstName, setFirstName] = useState(userData.first_name);
    const [lastName, setLastName] = useState(userData.last_name);
    const [email, setEmail] = useState(userData.email);
    const [mobile, setMobile] = useState(userData.mobile);
    const [isActive, setIsActive] = useState(userData.is_active === 1);

    const [errors, setErrors] = useState({
        firstName: '',
        lastName: '',
        email: '',
        mobile: ''
    });

    // METHODS
    const validateField = (name, value) => {
        let error = '';

        switch (name) {
            case 'firstName':
                if (!value.trim()) error = 'Name is required';
                else if (value.length < 2) error = 'Name must be at least 2 characters';
                else if (/[^a-zA-Z\s]/.test(value)) error = 'Name cannot contain numeric characters';
                break;
            case 'lastName':
                if (!value.trim()) error = 'Surname is required';
                else if (value.length < 2) error = 'Surname must be at least 2 characters';
                else if (/[^a-zA-Z\s]/.test(value)) error = 'Surname cannot contain numeric characters';
                break;
            case 'email':
                if (!value) error = 'Email is required';
                else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Invalid email format';
                break;
            case 'mobile':
                if (!value) error = 'Mobile number is required';
                else if (!/^\d+$/.test(value)) error = 'Mobile number should contain only digits';
                break;
            default:
                break;
        }

        setErrors(prevErrors => ({ ...prevErrors, [name]: error }));
    };

    const handleSave = () => {
        // Form validation before saving
        validateField('firstName', firstName);
        validateField('lastName', lastName);
        validateField('email', email);
        validateField('mobile', mobile);

        // If there are no errors, proceed with save
        if (!Object.values(errors).some(error => error !== '')) {
            const updatedData = {
                first_name: firstName,
                last_name: lastName,
                email: email,
                mobile: mobile,
                is_active: isActive ? 1 : 0
            };

            // Save updated data (API call or other logic)
            console.log("Updated Data:", updatedData);
        }
    };

    const handleDeleteAccount = () => {
        Swal.fire({
            title: 'Are you sure you want to permanently delete your account?',
            text: "This action cannot be reverted.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire('Your account has been deleted.', 'Your account has been permanently deleted.', 'success');

                localStorage.removeItem('token')

                dispatch(clearUser())
                router.push('/')
                // Burada API'ye istek gönderebiliriz
            }
        });
    };

    return (
        <Card className={styles.profileEditCard}>
            <Card.Body>
                <Card.Title>Edit Profile</Card.Title>
                <Form>
                    {/* Name */}
                    <Form.Group className="mb-3">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="firstName"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            isInvalid={!!errors.firstName}
                        />
                        <Form.Control.Feedback type="invalid">{errors.firstName}</Form.Control.Feedback>
                    </Form.Group>
                    {/* Suraname */}
                    <Form.Group className="mb-3">
                        <Form.Label>Surname</Form.Label>
                        <Form.Control
                            type="text"
                            name="lastName"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            isInvalid={!!errors.lastName}
                        />
                        <Form.Control.Feedback type="invalid">{errors.lastName}</Form.Control.Feedback>
                    </Form.Group>
                    {/* Email */}
                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            isInvalid={!!errors.email}
                        />
                        <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                    </Form.Group>
                    {/* Mobile */}
                    <Form.Group className="mb-3">
                        <Form.Label>Mobile</Form.Label>
                        <InputMask
                            mask="(999) 999-9999"
                            value={mobile}
                            onChange={(e) => setMobile(e.target.value)}
                        >
                            {(inputProps) => (
                                <Form.Control
                                    type="tel"
                                    name="mobile"
                                    ref={mobileInputRef}
                                    isInvalid={!!errors.mobile}
                                    {...inputProps}
                                />
                            )}
                        </InputMask>
                        <Form.Control.Feedback type="invalid">{errors.mobile}</Form.Control.Feedback>
                    </Form.Group>
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
                    {/* Buttons */}
                    <Button variant="primary" onClick={handleSave}>Save</Button>
                    <Button variant="secondary" className="ms-2" onClick={onCancel}>Cancel</Button>
                </Form>
                <Row className="mt-3">
                    <div onClick={handleDeleteAccount} className={styles.deleteAccount}>
                        <p className="text-danger">I want to delete my account.</p>
                    </div>
                </Row>
            </Card.Body>
        </Card>
    );
};

export default EditProfileCard;