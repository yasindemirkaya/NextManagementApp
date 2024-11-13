import React from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from './index.module.scss';
import InputMask from 'react-input-mask';
import axios from '@/utils/axios';
import toast from '@/utils/toastify';
import { ToastContainer } from 'react-toastify';
import { useForm } from 'react-hook-form';

const SignUp = () => {
    const router = useRouter();
    const { register, handleSubmit, setValue, reset, formState: { errors, isSubmitting } } = useForm({
        mode: 'onChange',
    });

    // Geri dön butonu için yönlendirme
    const handleBack = () => {
        router.back();
    };

    // Form submit işlemi
    const onSubmit = async (data) => {
        const { firstName, lastName, email, password, mobile } = data;

        try {
            // Register API isteği gönderiliyor
            const response = await axios.post('/public/register', {
                firstName,
                lastName,
                email,
                password,
                mobile,
            });

            if (response.result) {
                toast('SUCCESS', response.message);
                reset();

                setTimeout(() => {
                    router.push('/login');
                }, 2000);
            }
        } catch (error) {
            toast('ERROR', error.response?.data?.message);
        }
    };

    // İsim ve soyisim alanları için ilk harfi büyük yapma
    const handleNameChange = (e, name) => {
        const formattedValue = e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1);
        setValue(name, formattedValue);
    };

    return (
        <>
            <Container className={`mt-5 ${styles.signupContainer}`}>
                <h2>Register</h2>
                <Form onSubmit={handleSubmit(onSubmit)}>

                    {/* First Name */}
                    <Form.Group controlId="formBasicName" className="mt-1">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter your first name"
                            isInvalid={!!errors.firstName}
                            {...register("firstName", {
                                required: "Name is required",
                                minLength: { value: 2, message: "Name must be at least 2 characters" },
                            })}
                            onBlur={(e) => handleNameChange(e, "firstName")}
                        />
                        <Form.Control.Feedback type="invalid">{errors.firstName?.message}</Form.Control.Feedback>
                    </Form.Group>

                    {/* Last Name */}
                    <Form.Group controlId="formBasicLastName" className="mt-1">
                        <Form.Label>Surname</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter your last name"
                            isInvalid={!!errors.lastName}
                            {...register("lastName", {
                                required: "Surname is required",
                                minLength: { value: 2, message: "Surname must be at least 2 characters" },
                            })}
                            onBlur={(e) => handleNameChange(e, "lastName")}
                        />
                        <Form.Control.Feedback type="invalid">{errors.lastName?.message}</Form.Control.Feedback>
                    </Form.Group>

                    {/* Email */}
                    <Form.Group controlId="formBasicEmail" className="mt-1">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter your email"
                            isInvalid={!!errors.email}
                            {...register("email", {
                                required: "Email is required",
                                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email format" },
                            })}
                        />
                        <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
                    </Form.Group>

                    {/* Password */}
                    <Form.Group controlId="formBasicPassword" className="mt-1">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Enter your password"
                            isInvalid={!!errors.password}
                            {...register("password", {
                                required: "Password is required",
                                minLength: { value: 6, message: "Password must be at least 6 characters" },
                            })}
                        />
                        <Form.Control.Feedback type="invalid">{errors.password?.message}</Form.Control.Feedback>
                    </Form.Group>

                    {/* Mobile */}
                    <Form.Group controlId="formBasicMobile" className="mt-1">
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

                    {/* Buttons */}
                    <Row className="mt-3">
                        <Col>
                            <Button variant="secondary" onClick={handleBack} className="w-100">
                                Back
                            </Button>
                        </Col>
                        <Col>
                            <Button variant="primary" type="submit" className="w-100" disabled={isSubmitting}>
                                {isSubmitting ? 'Signing Up...' : 'Sign Up'}
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
            <ToastContainer />
        </>
    );
};

export default SignUp;
