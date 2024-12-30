import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Spinner, InputGroup } from 'react-bootstrap';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import styles from './index.module.scss';
import { useDispatch } from 'react-redux';
import { setUser } from '@/redux/userSlice';
import toast from '@/utils/toastify';
import { ToastContainer } from 'react-toastify';
import { icons } from '@/static/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { login } from '@/services/loginApi';

const Login = () => {
    const router = useRouter();
    const dispatch = useDispatch();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm();

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Geri dön butonu için redirect
    const handleBack = () => {
        router.back();
    };

    // Şifreyi göster/gizle işlevi
    const togglePasswordVisibility = () => {
        setShowPassword((prevState) => !prevState);
    };

    // Form submit
    const onSubmit = async (data) => {
        setLoading(true);

        try {
            // API'ye giriş isteği gönder
            const response = await login(data.email, data.password)

            if (response.message === 'Success') {
                setLoading(false);
                reset();
                toast('SUCCESS', 'Welcome. Redirecting to Dashboard...');

                dispatch(setUser({
                    id: response.user.id,
                    email: response.user.email,
                    firstName: response.user.firstName,
                    lastName: response.user.lastName,
                    role: response.user.role,
                }))

                router.push('/dashboard');
            } else {
                setLoading(false);
                toast('ERROR', response.message);
            }
        } catch (error) {
            setLoading(false);
            console.error('Login failed: ', error);
            toast('ERROR', 'An error occurred. Please try again.');
        }
    };

    return (
        <>
            <Container className={`mt-5 ${styles.loginContainer}`}>
                <h2>Login</h2>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    {/* Email */}
                    <Form.Group controlId="formBasicEmail" className="mt-1">
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter email"
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: "Invalid email format"
                                }
                            })}
                            isInvalid={!!errors.email}
                        />
                        <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
                    </Form.Group>

                    {/* Password */}
                    <Form.Group controlId="formBasicPassword" className="mt-1">
                        <Form.Label>Password</Form.Label>
                        <InputGroup>
                            <Form.Control
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter password"
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: {
                                        value: 6,
                                        message: "Password must be at least 6 characters"
                                    }
                                })}
                                isInvalid={!!errors.password}
                            />
                            <InputGroup.Text onClick={togglePasswordVisibility} style={{ cursor: "pointer" }}>
                                <FontAwesomeIcon icon={showPassword ? icons.faEyeSlash : icons.faEye} />
                            </InputGroup.Text>
                            <Form.Control.Feedback type="invalid">
                                {errors.password?.message}
                            </Form.Control.Feedback>
                        </InputGroup>
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
                                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className='text-white me-2' />
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
            </Container>
            <ToastContainer />
        </>
    );
};

export default Login;
