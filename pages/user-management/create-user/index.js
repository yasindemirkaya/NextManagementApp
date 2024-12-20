import React from 'react';
import { Container, Card, Form, Button, Row, Col, Tooltip, OverlayTrigger } from 'react-bootstrap';
import axios from '@/utils/axios';
import InputMask from 'react-input-mask';
import styles from './index.module.scss';
import { icons } from '@/static/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { createUser } from '@/services/userApi';

const CreateUser = () => {
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
                Swal.fire({
                    title: response.message,
                    icon: 'success',
                });
            } else {
                Swal.fire({
                    title: response.message,
                    icon: 'error',
                });
            }
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: 'An error occurred when creating a new user. Please try again later.',
                icon: 'error',
            });
        }
    };

    // Name ve Surname baş harfi otomatik büyük harf yapmak için
    const handleNameChange = (e, name) => {
        const formattedValue = e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1);
        setValue(name, formattedValue);
    };

    return (
        <Container>
            <Card className={`${styles.createUserContainer}`}>
                <Card.Body>
                    <h2>Create User</h2>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Row>
                            {/* First Name */}
                            <Col md={6}>
                                <Form.Group controlId="firstName">
                                    <Form.Label>First Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter user's name"
                                        isInvalid={!!errors.lastName}
                                        {...register("firstName", {
                                            required: "Name is required",
                                            minLength: { value: 2, message: "Name must be at least 2 characters" },
                                        })}
                                        onBlur={(e) => handleNameChange(e, "firstName")}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.firstName?.message}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>

                            {/* Last Name */}
                            <Col md={6}>
                                <Form.Group controlId="lastName">
                                    <Form.Label>Last Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter user's surname"
                                        isInvalid={!!errors.lastName}
                                        {...register("lastName", {
                                            required: "Surname is required",
                                            minLength: { value: 2, message: "Surname must be at least 2 characters" },
                                        })}
                                        onBlur={(e) => handleNameChange(e, "lastName")}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.lastName?.message}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>

                        {/* Email */}
                        <Form.Group controlId="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter user's email"
                                isInvalid={!!errors.email}
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email format" },
                                })}
                            />
                            <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
                        </Form.Group>

                        {/* Password */}
                        <Form.Group controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter a password for the user"
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
                                        placeholder="Enter user's mobile number"
                                        isInvalid={!!errors.mobile}
                                    />
                                )}
                            </InputMask>
                            <Form.Control.Feedback type="invalid">{errors.mobile?.message}</Form.Control.Feedback>
                        </Form.Group>

                        {/* Is Active */}
                        <Form.Group controlId="isActive" className="mt-3">
                            <Form.Label className="me-2">Is Active</Form.Label>
                            <OverlayTrigger
                                placement="right"
                                overlay={<Tooltip>You may want to create the user account and leave it inactive. You can reactivate the account at any time.</Tooltip>}>
                                <FontAwesomeIcon icon={icons.faInfoCircle} />
                            </OverlayTrigger>
                            <br />
                            <Form.Check type="radio" label="Yes" {...register("isActive")} value="1" inline />
                            <Form.Check type="radio" label="No" {...register("isActive")} value="0" inline />
                        </Form.Group>

                        {/* Is Verified */}
                        <Form.Group controlId="isVerified" className="mt-3">
                            <Form.Label className="me-2">Is Verified</Form.Label>
                            <OverlayTrigger
                                placement="right"
                                overlay={<Tooltip>You can also verify the user's account while creating it. If verification is not made here, an e-mail is sent to the user.</Tooltip>}>
                                <FontAwesomeIcon icon={icons.faInfoCircle} />
                            </OverlayTrigger>
                            <br />
                            <Form.Check type="radio" label="Yes" {...register("isVerified")} value="1" inline />
                            <Form.Check type="radio" label="No" {...register("isVerified")} value="0" inline />
                        </Form.Group>

                        {/* User Role */}
                        <Form.Group controlId="role" className="mt-3">
                            <Form.Label>Role</Form.Label>
                            <br />
                            <Form.Check type="radio" label="Standard User" {...register("role")} value="0" inline />
                            <Form.Check type="radio" label="Admin" {...register("role")} value="1" inline />
                            <Form.Check type="radio" label="Super Admin" {...register("role")} value="2" inline />
                        </Form.Group>

                        {/* Button */}
                        <Button variant="primary" type="submit" disabled={isSubmitting} className="mt-3">
                            {isSubmitting ? 'Creating User...' : 'Create User'}
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default CreateUser;
