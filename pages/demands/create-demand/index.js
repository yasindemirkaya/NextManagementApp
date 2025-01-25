import { useForm, Controller } from "react-hook-form";
import { Container, Card, Form, Button, Row, Col } from 'react-bootstrap';
import Select from 'react-select';
import demandTypes from '@/static/data/demandTypes';
import styles from './index.module.scss'
import { useTranslations } from "next-intl";
import { useState } from "react";
import { capitalizeFirstLetter } from '@/helpers/capitalizeFirstLetter';
import createDemand from "@/pages/api/private/demands/create-demand";
import toast from '@/utils/toastify';
import { ToastContainer } from 'react-toastify';

const CreateDemand = () => {
    const t = useTranslations()
    const [showEndDate, setShowEndDate] = useState(false);

    const {
        control,
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors, isSubmitting }
    } = useForm({ mode: 'onBlur ' });

    // Format demand types
    const typeOptions = demandTypes.map(demand => ({
        value: demand.id,
        label: demand.typeName
    }));

    const handleTypeChange = (selectedOption) => {
        // Eğer seçilen değer 1, 2, 3, 4, 5 ise endDate alanını göster
        setShowEndDate([1, 2, 3, 4, 5].includes(selectedOption?.value));
    };

    // Submit demand
    const onSubmit = async (data) => {
        try {
            const requestData = {
                title: data.title?.value,
                description: data.description,
                startDate: data.startDate,
                endDate: data.endDate
            }

            const result = await createDemand(requestData)

            if (result.success) {
                toast('SUCCESS', result.message)
                reset();
            } else {
                toast('ERROR', result.error)
            }
        } catch (error) {
            toast('ERROR', result.error)
        }
    };

    return (
        <>
            <Container>
                <Card className={`${styles.createDemandContainer}`}>
                    <Card.Body>
                        <h2>{t("Create Demand")}</h2>
                        <Form onSubmit={handleSubmit(onSubmit)}>
                            <Row>
                                {/* Title */}
                                <Col md={12} className="mb-3">
                                    <Form.Group controlId="title">
                                        <Form.Label>{t("Title")}</Form.Label>
                                        <Controller
                                            control={control}
                                            name="title"
                                            rules={{ required: t("Title is required") }}
                                            render={({ field, fieldState }) => (
                                                <>
                                                    <Select
                                                        {...field}
                                                        options={typeOptions}
                                                        theme={(theme) => ({
                                                            ...theme,
                                                            colors: {
                                                                ...theme.colors,
                                                                primary25: 'var(--primary-25)',
                                                                primary: 'var(--primary)',
                                                                neutral0: 'var(--neutral-0)',
                                                                neutral80: 'var(--neutral-80)',
                                                                neutral25: 'var(--neutral-25)',
                                                            },
                                                        })}
                                                        placeholder={t("Select a Title")}
                                                        onChange={(selectedOption) => {
                                                            field.onChange(selectedOption);
                                                            handleTypeChange(selectedOption);
                                                        }}
                                                    />
                                                    {fieldState.error && (
                                                        <Form.Text className="text-danger">
                                                            {fieldState.error.message}
                                                        </Form.Text>
                                                    )}
                                                </>
                                            )}
                                        />
                                    </Form.Group>
                                </Col>

                                {/* Description */}
                                <Col md={12} className="mb-3">
                                    <Form.Group controlId="description">
                                        <Form.Label>{t("Description")}</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            {...register("description", {
                                                required: t("Description is required"),
                                                maxLength: { value: 255, message: t("Description cannot be longer than 255 characters") },
                                                minLength: { value: 10, message: t("Description cannot be shorter than 10 characters") },
                                                onBlur: (e) => {
                                                    const formattedValue = capitalizeFirstLetter(e.target.value);
                                                    setValue("description", formattedValue);
                                                },
                                            })}
                                            rows={3}
                                            style={{ resize: "none" }}
                                            isInvalid={!!errors.description}
                                            placeholder={t("Enter a description for your demand")}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.description?.message}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>

                                {/* Start Date */}
                                <Col md={12} className="mb-3">
                                    <Form.Group controlId="startDate">
                                        <Form.Label>{t("Start Date")}</Form.Label>
                                        <Form.Control
                                            type="date"
                                            {...register("startDate", { required: t("Start date is required") })}
                                            isInvalid={!!errors.startDate}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.startDate?.message}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>

                                {/* End Date */}
                                {showEndDate && (
                                    <Col md={12} className="mb-3">
                                        <Form.Group controlId="endDate">
                                            <Form.Label>{t("End Date")}</Form.Label>
                                            <Form.Control
                                                type="date"
                                                {...register("endDate", { required: t("End date is required") })}
                                                isInvalid={!!errors.endDate}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.endDate?.message}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                )}
                            </Row>

                            <Button variant="primary" type="submit" disabled={isSubmitting}>
                                {isSubmitting ? t('Creating Demand') : t('Create Demand')}
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
            </Container>
            <ToastContainer />
        </>
    )
}

export async function getStaticProps(context) {
    const formMessages = await import(`../../../public/locales/form/${context.locale}.json`);
    const commonMessages = await import(`../../../public/locales/common/${context.locale}.json`);
    const validationMessages = await import(`../../../public/locales/validation/${context.locale}.json`);

    return {
        props: {
            messages: {
                ...formMessages.default,
                ...commonMessages.default,
                ...validationMessages.default,
            },
        },
    };
}

export default CreateDemand;
