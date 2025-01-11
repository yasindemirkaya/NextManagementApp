import React from 'react';
import { Container, Card, Form, Button, Row, Col } from 'react-bootstrap';
import styles from './index.module.scss';
import { useForm } from 'react-hook-form';
import toast from '@/utils/toastify';
import { ToastContainer } from 'react-toastify';
import { createGroupType } from '@/services/groupTypeApi';
import { capitalizeFirstLetter } from '@/helpers/capitalizeFirstLetter';
import { useTranslations } from 'next-intl';

const CreateGroupType = () => {
    const t = useTranslations()
    const { register, handleSubmit, setValue, reset, formState: { errors, isSubmitting } } = useForm({
        mode: 'onBlur',
    });

    // Submit form
    const onSubmit = async (data) => {
        try {
            const response = await createGroupType(data.typeName);

            if (response.code === 1) {
                reset({ typeName: '' });
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
                <Card className={`${styles.createGroupContainer}`}>
                    <Card.Body>
                        <h2>{t("Create Group Type")}</h2>
                        <Form onSubmit={handleSubmit(onSubmit)}>
                            <Row>
                                <Col md={12}>
                                    <Form.Group controlId="typeName">
                                        <Form.Label>{t("Type Name")}</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder={t("Enter group type name")}
                                            {...register("typeName", {
                                                required: t("Name is required"),
                                                minLength: { value: 2, message: t("Name must be at least 2 characters") },
                                                onBlur: (e) => {
                                                    const formattedValue = capitalizeFirstLetter(e.target.value);
                                                    setValue("typeName", formattedValue);
                                                },
                                                validate: (value) =>
                                                    /^[a-zA-Z0-9\s]*$/.test(value) || t("Only letters, numbers, and spaces are allowed"),
                                            })}
                                            isInvalid={!!errors.typeName}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.typeName?.message}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>

                            {/* Button */}
                            <Button variant="primary" type="submit" disabled={isSubmitting} className="mt-3">
                                {isSubmitting ? t('Creating Group Type') : t('Create Group Type')}
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

export default CreateGroupType;
