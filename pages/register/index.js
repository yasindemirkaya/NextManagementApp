import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, InputGroup } from 'react-bootstrap';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from './index.module.scss';
import InputMask from 'react-input-mask';
import toast from '@/utils/toastify';
import { ToastContainer } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { icons } from '@/static/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { signUp } from '@/services/registerApi';
import { capitalizeFirstLetter } from '@/helpers/capitalizeFirstLetter';

import { useTranslations } from 'next-intl';

const SignUp = () => {
    const t = useTranslations();
    const router = useRouter();
    const { register, handleSubmit, setValue, reset, formState: { errors, isSubmitting } } = useForm({
        mode: 'onChange',
    });
    const [showPassword, setShowPassword] = useState(false);

    // Geri dön butonu için yönlendirme
    const handleBack = () => {
        router.back();
    };

    // Şifreyi göster/gizle işlevi
    const togglePasswordVisibility = () => {
        setShowPassword((prevState) => !prevState);
    };

    // Form submit işlemi
    const onSubmit = async (data) => {
        const { firstName, lastName, email, password } = data;
        const mobile = data.mobile.replace(/\D/g, '');

        try {
            // Register API isteği gönderiliyor
            const response = await signUp({ firstName, lastName, email, password, mobile });

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

    return (
        <>
            <Container className={`mt-5 ${styles.signupContainer}`}>
                <h2>{t('Register')}</h2>
                <Form onSubmit={handleSubmit(onSubmit)}>

                    {/* First Name */}
                    <Form.Group controlId="formBasicName" className="mt-1">
                        <Form.Label>{t('Name')}</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder={t('Enter your first name')}
                            isInvalid={!!errors.firstName}
                            {...register("firstName", {
                                required: t("Name is required"),
                                minLength: { value: 2, message: t("Name must be at least 2 characters") },
                                onBlur: (e) => {
                                    const formattedValue = capitalizeFirstLetter(e.target.value);
                                    setValue("firstName", formattedValue);
                                },
                            })}
                        />
                        <Form.Control.Feedback type="invalid">{errors.firstName?.message}</Form.Control.Feedback>
                    </Form.Group>

                    {/* Last Name */}
                    <Form.Group controlId="formBasicLastName" className="mt-1">
                        <Form.Label>{t('Surname')}</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder={t('Enter your last name')}
                            isInvalid={!!errors.lastName}
                            {...register("lastName", {
                                required: t("Surname is required"),
                                minLength: { value: 2, message: t("Surname must be at least 2 characters") },
                                onBlur: (e) => {
                                    const formattedValue = capitalizeFirstLetter(e.target.value);
                                    setValue("lastName", formattedValue);
                                },
                            })}
                        />
                        <Form.Control.Feedback type="invalid">{errors.lastName?.message}</Form.Control.Feedback>
                    </Form.Group>

                    {/* Email */}
                    <Form.Group controlId="formBasicEmail" className="mt-1">
                        <Form.Label>{t("Email")}</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder={t('Enter your email')}
                            isInvalid={!!errors.email}
                            {...register("email", {
                                required: t("Email is required"),
                                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: t("Invalid email format") },
                            })}
                        />
                        <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
                    </Form.Group>

                    {/* Password */}
                    <Form.Group controlId="formBasicPassword" className="mt-1">
                        <Form.Label>{t("Password")}</Form.Label>
                        <InputGroup>
                            <Form.Control
                                type={showPassword ? "text" : "password"}
                                placeholder={t('Enter password')}
                                {...register("password", {
                                    required: t("Password is required"),
                                    minLength: {
                                        value: 6,
                                        message: t("Password must be at least 6 characters")
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

                    {/* Mobile */}
                    <Form.Group controlId="formBasicMobile" className="mt-1">
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

                    {/* Buttons */}
                    <Row className="mt-3">
                        <Col>
                            <Button variant="secondary" onClick={handleBack} className="w-100">
                                {t("Back")}
                            </Button>
                        </Col>
                        <Col>
                            <Button variant="primary" type="submit" className="w-100" disabled={isSubmitting}>
                                {isSubmitting ? t('Signing Up') : t('Sign Up')}
                            </Button>
                        </Col>
                    </Row>

                    {/* Login redirect */}
                    <Row className="mt-3">
                        <p>
                            {t("Already have an account?")}{' '}
                            <Link href="/login" className={styles.link}>{t("Login now!")}</Link>
                        </p>
                    </Row>

                    {/* Homepage redirect */}
                    <Row>
                        <p>
                            {t("Back to")} <Link href="/" className={styles.link}>{t("Homepage")}</Link>
                        </p>
                    </Row>
                </Form>
            </Container>
            <ToastContainer />
        </>
    );
};

export async function getStaticProps(context) {
    const authMessages = await import(`../../public/locales/auth/${context.locale}.json`);
    const formMessages = await import(`../../public/locales/form/${context.locale}.json`);
    const commonMessages = await import(`../../public/locales/common/${context.locale}.json`);
    const validationMessages = await import(`../../public/locales/validation/${context.locale}.json`);

    return {
        props: {
            messages: {
                ...authMessages.default,
                ...formMessages.default,
                ...commonMessages.default,
                ...validationMessages.default,
            },
        },
    };
}

export default SignUp;
