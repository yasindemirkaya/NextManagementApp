
import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Container, Card, Form, Button, Row, Col } from 'react-bootstrap';
import Select from 'react-select';
import demandTypes from '@/static/data/demandTypes';
import { capitalizeFirstLetter } from '@/helpers/capitalizeFirstLetter';
import styles from './index.module.scss'

import { getUsers } from "@/services/userApi";
import { createDemand } from "@/services/demandApi";

import toast from '@/utils/toastify';
import { ToastContainer } from 'react-toastify';
import { useRouter } from "next/router";

const CreateDemand = () => {
    const t = useTranslations()
    const router = useRouter()
    const [showEndDate, setShowEndDate] = useState(false);
    const [userOptions, setUserOptions] = useState([]); // Kullanıcıları tutacak state
    const [loadingUsers, setLoadingUsers] = useState(false); // Yükleme durumu

    const {
        control,
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors, isSubmitting }
    } = useForm({ mode: 'onBlur' });

    useEffect(() => {
        fetchUsers();
    }, [])

    // Get admins for recipient selection
    const fetchUsers = async () => {
        setLoadingUsers(true);
        const response = await getUsers({ role: 1 });
        if (response.success) {
            const options = response.data.map(user => ({
                value: user._id,
                label: `${user.first_name} ${user.last_name}`,
            }));
            setUserOptions(options);
        } else {
            console.error(response.error);
        }
        setLoadingUsers(false);
    };

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
        console.log(data)
        try {
            const response = await createDemand(data);

            if (response.success) {
                toast('SUCCESS', response.message)
                router.push('/demands/view-demands')
                reset();
            } else {
                toast('ERROR', response.error)
            }
        } catch (error) {
            toast('ERROR', response.error)
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

                                {/* Recipient */}
                                <Col md={12} className="mb-3">
                                    <Form.Group controlId="targetUser">
                                        <Form.Label>{t("Recipient")}</Form.Label>
                                        <Controller
                                            control={control}
                                            name="targetUser"
                                            rules={{ required: t("Recipient is required") }}
                                            render={({ field, fieldState }) => (
                                                <>
                                                    <Select
                                                        {...field}
                                                        options={userOptions}
                                                        isLoading={loadingUsers}
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
                                                        placeholder={t("Select a recipient")}
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
