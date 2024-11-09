import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Spinner } from 'react-bootstrap';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux'
import styles from './index.module.scss';
import { setLogin } from '/redux/page'
import axios from "@/utils/axios"

import toast from '@/utils/toastify'
import { ToastContainer } from 'react-toastify';

const Login = () => {
    const router = useRouter();
    const dispatch = useDispatch()

    // DATA
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // METHODS
    const validateField = (name, value) => {
        let error = '';

        switch (name) {
            case 'email':
                if (!value) error = 'Email is required';
                else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Invalid email format';
                break;
            case 'password':
                if (!value) error = 'Password is required';
                else if (value.length < 6) error = 'Password must be at least 6 characters';
                break;
            default:
                break;
        }

        setErrors(prevErrors => ({ ...prevErrors, [name]: error }));
    };

    // validateField methodunu her bir input için çalıştır ve errorları return et
    const validateForm = () => {
        // Tüm hataları temizle
        const newErrors = {};
        validateField('email', email);
        validateField('password', password);

        // Hatalar var mı kontrol et
        Object.keys(errors).forEach(key => {
            if (errors[key]) newErrors[key] = errors[key];
        });

        // Alanların dolu olup olmadığını kontrol et
        if (!email || !password) {
            if (!email) newErrors.email = 'Email is required';
            if (!password) newErrors.password = 'Password is required';
        }

        setErrors(newErrors); // Hataları güncelle
        return Object.keys(newErrors).length === 0; // Eğer hata yoksa true döner
    };

    // Inputlara her kullanıcı girişinde canlı olarak validation yap
    const handleChange = (e) => {
        const { name, value } = e.target;

        switch (name) {
            case 'email':
                setEmail(value);
                break;
            case 'password':
                setPassword(value);
                break;
            default:
                break;
        }

        validateField(name, value);
    };

    // Form submission sonrası inputları temizle
    const clearFieldsAfterFormSubmit = () => {
        setEmail('');
        setPassword('');
        setErrors({});
    }

    // Geri dön butonu için redirect
    const handleBack = () => {
        router.back();
    };

    // Form submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            setLoading(true);

            try {
                // API'ye giriş isteği gönder
                const response = await axios.post('/public/login', {
                    email,
                    password
                });

                if (response.message === 'Success') {
                    setLoading(false);
                    clearFieldsAfterFormSubmit();

                    toast('SUCCESS', 'Welcome. Redirecting to Dashboard...');

                    // Kullanıcı bilgilerini Redux'a kaydet
                    dispatch(setLogin({
                        username: response.user.email,
                        loginStatus: true
                    }));

                    // Token'ı localStorage'a kaydet
                    localStorage.setItem('token', response.token);

                    // Dashboard'a yönlendir
                    setTimeout(() => {
                        router.push('/dashboard');
                    }, 2000);
                } else {
                    setLoading(false);
                    toast('ERROR', response.message);
                }
            } catch (error) {
                setLoading(false);
                console.error('Login failed: ', error);
                toast('ERROR', 'An error occurred. Please try again.');
            }
        }
    };

    return (
        <>
            <Container className={`mt-5 ${styles.loginContainer}`}>
                <h2>Login</h2>
                <Form onSubmit={handleSubmit}>
                    {/* Email */}
                    <Form.Group controlId="formBasicEmail" className="mt-1">
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            placeholder="Enter email"
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
                            placeholder="Enter password"
                            value={password}
                            onChange={handleChange}
                            isInvalid={!!errors.password}
                        />
                        <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                    </Form.Group>

                    <Row className="mt-3">
                        <Col>
                            {/* Back Button */}
                            <Button variant="secondary" onClick={handleBack} className="w-100">
                                Back
                            </Button>
                        </Col>
                        <Col>
                            {/* Login Button */}
                            <Button variant="primary" type="submit" disabled={loading} className="w-100">
                                {loading ? (
                                    <>
                                        <Spinner
                                            as="span"
                                            animation="border"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                            className='text-white me-2'
                                        />
                                        Logging In...
                                    </>
                                ) : (
                                    <>Login</>
                                )}
                            </Button>
                        </Col>
                    </Row>
                </Form>

                <Row className="mt-3">
                    <p>
                        Don't have an account?{' '}
                        <Link href="/register" className={styles.link}>Sign up now!</Link>
                    </p>
                </Row>

                <Row>
                    <p>
                        Back to <Link href="/" className={styles.link}>Homepage</Link>
                    </p>
                </Row>
            </Container>
            <ToastContainer />
        </>

    );
};

export default Login;