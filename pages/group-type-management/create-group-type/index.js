import React from 'react';
import { Container, Card, Form, Button, Row, Col, Tooltip, OverlayTrigger } from 'react-bootstrap';
import axios from '@/utils/axios';
import InputMask from 'react-input-mask';
import styles from './index.module.scss';
import { icons } from '@/static/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { createGroupType } from '@/services/groupTypeApi';

const CreateGroupType = () => {
    const { register, handleSubmit, setValue, reset, formState: { errors, isSubmitting } } = useForm({
        mode: 'onBlur',
    });

    // Submit form
    const onSubmit = async (data) => {
        try {
            const response = await createGroupType(data.typeName);

            if (response.code === 1) {
                reset({ typeName: '' });
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
            <Card className={`${styles.createGroupContainer}`}>
                <Card.Body>
                    <h2>Create Group Type</h2>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Row>
                            <Col md={12}>
                                <Form.Group controlId="typeName">
                                    <Form.Label>Type Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter group's name"
                                        {...register("typeName", {
                                            required: "Name is required",
                                            minLength: { value: 2, message: "Name must be at least 2 characters" },
                                        })}
                                        isInvalid={!!errors.typeName}
                                        onBlur={(e) => handleNameChange(e, "typeName")}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.typeName?.message}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>

                        {/* Button */}
                        <Button variant="primary" type="submit" disabled={isSubmitting} className="mt-3">
                            {isSubmitting ? 'Creating Group Type...' : 'Create Group Type'}
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default CreateGroupType;
