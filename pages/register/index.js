import React, { useState, useRef } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from './index.module.scss';
import InputMask from 'react-input-mask';

const SignUp = () => {
    const router = useRouter();
    const mobileInputRef = useRef(null);

    // DATA
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [mobile, setMobile] = useState('');
    const [errors, setErrors] = useState({});

    // METHODS
    const validateField = (name, value) => {
        let error = '';

        switch (name) {
            case 'firstName':
                if (!value.trim()) error = 'Name is required';
                else if (value.length < 2) error = 'Name must be at least 2 characters';
                break;
            case 'lastName':
                if (!value.trim()) error = 'Surname is required';
                else if (value.length < 2) error = 'Surname must be at least 2 characters';
                break;
            case 'email':
                if (!value) error = 'Email is required';
                else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Invalid email format';
                break;
            case 'password':
                if (!value) error = 'Password is required';
                else if (value.length < 6) error = 'Password must be at least 6 characters';
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

    // validateField methodunu her bir input için çalıştır ve errorları return et
    const validateForm = () => {
        const newErrors = {};

        // Alanların dolu olup olmadığını kontrol et
        if (!firstName) newErrors.firstName = 'Name is required';
        if (!lastName) newErrors.lastName = 'Surname is required';
        if (!email) newErrors.email = 'Email is required';
        if (!password) newErrors.password = 'Password is required';
        if (!mobile) newErrors.mobile = 'Mobile number is required';

        // Mevcut hataları kontrol et
        validateField('firstName', firstName);
        validateField('lastName', lastName);
        validateField('email', email);
        validateField('password', password);
        validateField('mobile', mobile);

        // Hataları güncelle
        setErrors(prevErrors => ({ ...prevErrors, ...newErrors }));

        return Object.keys(newErrors).length === 0; // Eğer hata yoksa true döner
    };

    // Inputlara her kullanıcı girişinde canlı olarak validation yap
    const handleChange = (e) => {
        const { name, value } = e.target;

        // Mobile format
        let cleanValue = value;
        if (name === 'mobile') {
            // Remove every non-digit characters
            cleanValue = value.replace(/\D/g, '');
        }

        switch (name) {
            case 'firstName':
                setFirstName(value);
                break;
            case 'lastName':
                setLastName(value);
                break;
            case 'email':
                setEmail(value);
                break;
            case 'password':
                setPassword(value);
                break;
            case 'mobile':
                setMobile(cleanValue);
                break;
            default:
                break;
        }

        // Validasyonu çağır
        validateField(name, name !== 'mobile' ? value : cleanValue);
    };

    // Form submission sonrası inputları temizle
    const clearFieldsAfterFormSubmit = () => {
        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
        setMobile('');
        setErrors({});
    }

    // Geri dön butonu için redirect
    const handleBack = () => {
        router.back();
    };

    // Form submit
    const handleSubmit = (e) => {
        e.preventDefault();

        // Form valid ise inputları temizle ve submit et
        if (validateForm()) {
            clearFieldsAfterFormSubmit();
            console.log('Form submitted successfully');
        }
    };

    return (
        <Container className={`mt-5 ${styles.signupContainer}`}>
            <h2>Register</h2>
            <Form onSubmit={handleSubmit}>

                {/* First Name */}
                <Form.Group controlId="formBasicName" className="mt-1">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type="text"
                        name="firstName"
                        placeholder="Enter your first name"
                        value={firstName}
                        onChange={handleChange}
                        isInvalid={!!errors.firstName}
                    />
                    <Form.Control.Feedback type="invalid">{errors.firstName}</Form.Control.Feedback>
                </Form.Group>

                {/* Last Name */}
                <Form.Group controlId="formBasicLastName" className="mt-1">
                    <Form.Label>Surname</Form.Label>
                    <Form.Control
                        type="text"
                        name="lastName"
                        placeholder="Enter your last name"
                        value={lastName}
                        onChange={handleChange}
                        isInvalid={!!errors.lastName}
                    />
                    <Form.Control.Feedback type="invalid">{errors.lastName}</Form.Control.Feedback>
                </Form.Group>

                {/* Email */}
                <Form.Group controlId="formBasicEmail" className="mt-1">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={handleChange}
                        isInvalid={!!errors.email}
                    />
                    <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                </Form.Group>

                {/* Password */}
                <Form.Group controlId="formBasicPassword" className="mt-1">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={handleChange}
                        isInvalid={!!errors.password}
                    />
                    <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                </Form.Group>

                {/* Mobile */}
                <Form.Group controlId="formBasicMobile" className="mt-1">
                    <Form.Label>Mobile</Form.Label>
                    <InputMask
                        mask="(999) 999-9999"
                        value={mobile}
                        onChange={handleChange}
                    >
                        {(inputProps) => (
                            <Form.Control
                                type="tel"
                                name="mobile"
                                placeholder="Enter your mobile number"
                                isInvalid={!!errors.mobile}
                                ref={mobileInputRef} // Ref'i burada ekle
                                {...inputProps}
                            />
                        )}
                    </InputMask>
                    <Form.Control.Feedback type="invalid">{errors.mobile}</Form.Control.Feedback>
                </Form.Group>

                {/* Buttons */}
                <Row className="mt-3">
                    <Col>
                        <Button variant="secondary" onClick={handleBack} className="w-100">
                            Back
                        </Button>
                    </Col>
                    <Col>
                        <Button variant="primary" type="submit" className="w-100">
                            Sign Up
                        </Button>
                    </Col>
                </Row>

                {/* Login redirect */}
                <Row className="mt-3">
                    <p>
                        Already have an account?{' '}
                        <Link href="/login" className={styles.link}>Login now!</Link>
                    </p>
                </Row>

                {/* Homepage redirect */}
                <Row>
                    <p>
                        Back to <Link href="/" className={styles.link}>Homepage</Link>
                    </p>
                </Row>
            </Form>
        </Container>
    );
};

export default SignUp;