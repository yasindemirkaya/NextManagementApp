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
import { useTranslations } from 'next-intl';

const Login = () => {
    const t = useTranslations();
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

    // Change language
    const changeLanguage = (lang) => {
        localStorage.setItem("language", lang);
        router.push(router.asPath, router.asPath, { locale: lang });
    };

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

            if (response.code === 1) {
                setLoading(false);
                reset();
                toast('SUCCESS', response.message);

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
            toast('ERROR', error.message);
        }
    };

    return (
        <>
            <Row>
                <Col md={12} className="d-flex justify-content-center justify-content-md-end">
                    <Button
                        variant="link"
                        onClick={() => changeLanguage(router.locale === 'en' ? 'tr' : 'en')}
                        className={styles.languageSwitch}
                    >
                        {router.locale === 'en' ? 'EN' : 'TR'}
                    </Button>
                </Col>
            </Row>
            <Container className={`mt-5 ${styles.loginContainer}`}>
                <h2>{t('Login')}</h2>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    {/* Email */}
                    <Form.Group controlId="formBasicEmail" className="mt-1">
                        <Form.Label>{t('Email')}</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder={t('Enter your email')}
                            {...register("email", {
                                required: t('Email is required'),
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: t('Invalid email format')
                                }
                            })}
                            isInvalid={!!errors.email}
                        />
                        <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
                    </Form.Group>

                    {/* Password */}
                    <Form.Group controlId="formBasicPassword" className="mt-1">
                        <Form.Label>{t('Password')}</Form.Label>
                        <InputGroup>
                            <Form.Control
                                type={showPassword ? "text" : "password"}
                                placeholder={t('Enter password')}
                                {...register("password", {
                                    required: t('Password is required'),
                                    minLength: {
                                        value: 6,
                                        message: t('Password must be at least 6 characters')
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
                                {t('Back')}
                            </Button>
                        </Col>
                        <Col>
                            {/* Login Button */}
                            <Button variant="primary" type="submit" disabled={loading} className="w-100">
                                {loading ? (
                                    <>
                                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className='text-white me-2' />
                                        {t('Logging In')}
                                    </>
                                ) : (
                                    <>{t('Login')}</>
                                )}
                            </Button>
                        </Col>
                    </Row>
                </Form>

                <Row className="mt-3">
                    <p>
                        {t("Don't have an account?")}{' '}
                        <Link href="/register" className={styles.link}>{t("Sign up now!")}</Link>
                    </p>
                </Row>
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

export default Login;
