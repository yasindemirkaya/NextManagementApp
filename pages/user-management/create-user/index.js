import React from 'react';
import { Container, Card, Form, Button, Row, Col, Tooltip, OverlayTrigger } from 'react-bootstrap';
import InputMask from 'react-input-mask';
import styles from './index.module.scss';
import { icons } from '@/static/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useForm } from 'react-hook-form';
import toast from '@/utils/toastify';
import { ToastContainer } from 'react-toastify';
import { createUser } from '@/services/userApi';
import { capitalizeFirstLetter } from '@/helpers/capitalizeFirstLetter';
import { useTranslations } from 'next-intl';

const CreateUser = () => {
    const t = useTranslations()
    const { register, handleSubmit, setValue, reset, formState: { errors, isSubmitting } } = useForm({
        mode: 'onBlur',
        defaultValues: {
            isActive: "1",
            isVerified: "1",
            role: "0",
        },
    });

    // Submit form
    const onSubmit = async (data) => {
        try {
            const response = await createUser(data);

            if (response.code === 1) {
                reset({
                    firstName: '',
                    lastName: '',
                    email: '',
                    password: '',
                    mobile: '', // Diğer alanları sıfırla
                    isActive: '1',
                    isVerified: '1',
                    role: '0',
                });
                toast('SUCCESS', response.message)
            } else {
                toast('ERROR', response.message)
            }
        } catch (error) {
            toast('ERROR', error.message)
        }
    };

    return (
        <>
            <Container>
                <Card className={`${styles.createUserContainer}`}>
                    <Card.Body>
                        <h2>{t("Create User")}</h2>
                        <Form onSubmit={handleSubmit(onSubmit)}>
                            <Row>
                                {/* First Name */}
                                <Col md={6}>
                                    <Form.Group controlId="firstName">
                                        <Form.Label>{t("Name")}</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder={t("Enter user's name")}
                                            isInvalid={!!errors.lastName}
                                            {...register("firstName", {
                                                required: t('Name is required'),
                                                minLength: { value: 2, message: t("Name must be at least 2 characters") },
                                                pattern: { value: /^[a-zA-Z\s]*$/, message: t("Name cannot contain numeric characters") },
                                                onBlur: (e) => {
                                                    const formattedValue = capitalizeFirstLetter(e.target.value);
                                                    setValue("firstName", formattedValue);
                                                },
                                            })}
                                        />
                                        <Form.Control.Feedback type="invalid">{errors.firstName?.message}</Form.Control.Feedback>
                                    </Form.Group>
                                </Col>

                                {/* Last Name */}
                                <Col md={6}>
                                    <Form.Group controlId="lastName">
                                        <Form.Label>{t("Surname")}</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder={t("Enter user's surname")}
                                            isInvalid={!!errors.lastName}
                                            {...register("lastName", {
                                                required: t("Surname is required"),
                                                minLength: { value: 2, message: t("Surname must be at least 2 characters") },
                                                pattern: { value: /^[a-zA-Z\s]*$/, message: t("Surname cannot contain numeric characters") },
                                                onBlur: (e) => {
                                                    const formattedValue = capitalizeFirstLetter(e.target.value);
                                                    setValue("lastName", formattedValue);
                                                },
                                            })}
                                        />
                                        <Form.Control.Feedback type="invalid">{errors.lastName?.message}</Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>

                            {/* Email */}
                            <Form.Group controlId="email">
                                <Form.Label>{t("Email")}</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder={t("Enter user's email")}
                                    isInvalid={!!errors.email}
                                    {...register("email", {
                                        required: t("Email is required"),
                                        pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: t("Invalid email format") },
                                    })}
                                />
                                <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
                            </Form.Group>

                            {/* Password */}
                            <Form.Group controlId="password">
                                <Form.Label>{t("Password")}</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder={t("Enter a password for the user")}
                                    isInvalid={!!errors.password}
                                    {...register("password", {
                                        required: t("Password is required"),
                                        minLength: { value: 6, message: t("Password must be at least 6 characters") },
                                    })}
                                />
                                <Form.Control.Feedback type="invalid">{errors.password?.message}</Form.Control.Feedback>
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
                                            placeholder="Enter user's mobile number"
                                            isInvalid={!!errors.mobile}
                                        />
                                    )}
                                </InputMask>
                                <Form.Control.Feedback type="invalid">{errors.mobile?.message}</Form.Control.Feedback>
                            </Form.Group>

                            {/* Is Active */}
                            <Form.Group controlId="isActive" className="mt-3">
                                <Form.Label className="me-2">{t("Is Active")}</Form.Label>
                                <OverlayTrigger
                                    placement="right"
                                    overlay={<Tooltip>{t("Create User Tooltip Message 1")}</Tooltip>}>
                                    <FontAwesomeIcon icon={icons.faInfoCircle} />
                                </OverlayTrigger>
                                <br />
                                <Form.Check type="radio" label="Yes" {...register("isActive")} value="1" inline />
                                <Form.Check type="radio" label="No" {...register("isActive")} value="0" inline />
                            </Form.Group>

                            {/* Is Verified */}
                            <Form.Group controlId="isVerified" className="mt-3">
                                <Form.Label className="me-2">{t("Is Verified")}</Form.Label>
                                <OverlayTrigger
                                    placement="right"
                                    overlay={<Tooltip>{t("Create User Tooltip Message 2")}</Tooltip>}>
                                    <FontAwesomeIcon icon={icons.faInfoCircle} />
                                </OverlayTrigger>
                                <br />
                                <Form.Check type="radio" label="Yes" {...register("isVerified")} value="1" inline />
                                <Form.Check type="radio" label="No" {...register("isVerified")} value="0" inline />
                            </Form.Group>

                            {/* User Role */}
                            <Form.Group controlId="role" className="mt-3">
                                <Form.Label>{t("Role")}</Form.Label>
                                <br />
                                <Form.Check type="radio" label={t("Standard User")} {...register("role")} value="0" inline />
                                <Form.Check type="radio" label={t("Admin")} {...register("role")} value="1" inline />
                                <Form.Check type="radio" label={t("Super Admin")} {...register("role")} value="2" inline />
                            </Form.Group>

                            {/* Button */}
                            <Button variant="primary" type="submit" disabled={isSubmitting} className="mt-3">
                                {isSubmitting ? t('Creating User') : t('Create User')}
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
            </Container>
            <ToastContainer />
        </>
    );
};

export async function getStaticProps(context) {
    const commonMessages = await import(`../../../public/locales/common/${context.locale}.json`);
    const validationMessages = await import(`../../../public/locales/validation/${context.locale}.json`);
    const formMessages = await import(`../../../public/locales/form/${context.locale}.json`);

    return {
        props: {
            messages: {
                ...commonMessages.default,
                ...validationMessages.default,
                ...formMessages.default,
            },
        },
    };
}

export default CreateUser;
