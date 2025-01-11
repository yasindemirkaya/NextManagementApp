import React, { useState, useEffect } from 'react';
import { Form, Button, Card, ToggleButtonGroup, ToggleButton, Container, Col, Spinner } from 'react-bootstrap';
import Select from 'react-select';
import { useForm, Controller } from 'react-hook-form';
import { createPersonalNotification, createGroupNotification } from '@/services/notificationApi';
import notificationTypes from '@/static/data/notificationTypes';
import { getUsers } from '@/services/userApi';
import { getAllUserGroups } from '@/services/userGroupApi';
import toast from '@/utils/toastify';
import { ToastContainer } from 'react-toastify';
import styles from './index.module.scss'
import { capitalizeFirstLetter } from '@/helpers/capitalizeFirstLetter';
import { useTranslations } from 'next-intl';

const CreateNotification = () => {
    const t = useTranslations()
    const { register, handleSubmit, setValue, reset, control, formState: { errors, isSubmitting } } = useForm({
        mode: 'onBlur',
        defaultValues: {
            notificationType: 'personal',
            users: [],
            groups: [],
            title: '',
            description: '',
            type: '',
            date: ''
        },
    });

    const [notificationType, setNotificationType] = useState('personal');

    const [userData, setUserData] = useState([]);
    const [groupData, setGroupData] = useState([]);

    const [userDataLoading, setUserDataLoading] = useState(false);
    const [userDataError, setUserDataError] = useState(false);

    const [groupDataLoading, setGroupDataLoading] = useState(false);
    const [groupDataError, setGroupDataError] = useState(false);

    // Get all users
    const fetchUsers = async () => {
        setUserDataLoading(true);

        const result = await getUsers();

        if (result.success) {
            setUserData(result.data);
            setUserDataError(null);
        } else {
            setUserData([]);
            setUserDataError(result.error);
        }

        setUserDataLoading(false);
    };

    // Get all user groups
    const fetUserGroups = async () => {
        setGroupDataLoading(true);

        const result = await getAllUserGroups();

        if (result.success) {
            setGroupData(result.data);
            setGroupDataError(null);
        } else {
            setGroupData([]);
            setGroupDataError(result.error);
        }

        setGroupDataLoading(false);
    };

    useEffect(() => {
        fetchUsers();
        fetUserGroups();
    }, []);

    // Switch between personal and group notifications
    const handleSwitch = (value) => {
        setNotificationType(value);

        reset({
            notificationType: 'personal',
            users: [],
            groups: [],
            title: '',
            description: '',
            type: '',
            date: ''
        });
    };

    // Create notification on form submit
    const onSubmit = async (data) => {
        try {
            // Sadece id'leri alın (users ve groups)
            if (notificationType === 'personal') {
                data.users = data.users.map((user) => user.value);
                delete data.groups;
            } else {
                data.groups = data.groups.map((group) => group.value);
                delete data.users;
            }

            // Type alanını düz stringe dönüştürün
            if (data.type && typeof data.type === 'object') {
                data.type = data.type.value;
            }

            let result;
            if (notificationType === 'personal') {
                result = await createPersonalNotification(data);
            } else {
                result = await createGroupNotification(data);
            }

            if (result.success) {
                toast('SUCCESS', result.message);
                reset({
                    notificationType: 'personal',
                    users: [],
                    groups: [],
                    title: '',
                    description: '',
                    type: '',
                    date: ''
                });
            } else {
                toast('ERROR', result.error);
            }
        } catch (error) {
            toast('ERROR', error.message);
        }
    };


    // Notification types
    const typeOptions = notificationTypes.map(type => ({
        value: type.typeName,
        label: type.typeName,
    }));

    return (
        <>
            <Container>

                <Card className={`${styles.notificationContainer}`}>
                    <Card.Body>
                        <h2>{t("Create Notification")}</h2>
                        <div className="d-flex justify-content-center mb-4 mt-4">
                            {/* Toggle */}
                            <ToggleButtonGroup
                                type="radio"
                                name="notificationType"
                                value={notificationType}
                                onChange={handleSwitch}
                                className={styles.toggleButton}
                            >
                                <ToggleButton id="personal" value="personal" variant="outline-primary">
                                    {t("Personal Notification")}
                                </ToggleButton>
                                <ToggleButton id="group" value="group" variant="outline-primary">
                                    {t("Group Notification")}
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </div>

                        <Form onSubmit={handleSubmit(onSubmit)}>
                            {/* Title */}
                            <Col md={12}>
                                <Form.Group controlId="title">
                                    <Form.Label>{t("Title")}</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder={t("Enter a title")}
                                        isInvalid={!!errors.title}
                                        {...register("title", {
                                            required: t("Title is required"),
                                            minLength: { value: 2, message: t("Title must be at least 2 characters") },
                                            onBlur: (e) => {
                                                const formattedValue = capitalizeFirstLetter(e.target.value);
                                                setValue("title", formattedValue);
                                            },
                                        })}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.title?.message}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>

                            {/* Description */}
                            <Col md={12}>
                                <Form.Group controlId="description">
                                    <Form.Label>{t("Description")}</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        placeholder={t("Enter a description")}
                                        isInvalid={!!errors.description}
                                        {...register("description", {
                                            required: t("Description is required"),
                                            minLength: { value: 2, message: t("Description must be at least 2 characters") },
                                            maxLength: { value: 255, message: t('Description cannot exceed 255 characters') },
                                            onBlur: (e) => {
                                                const formattedValue = capitalizeFirstLetter(e.target.value);
                                                setValue("description", formattedValue);
                                            },
                                        })}
                                        className={styles.description}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.description?.message}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>


                            {/* Notification Type*/}
                            <Col md={12}>
                                <Form.Group controlId="type">
                                    <Form.Label>{t("Notification Type")}</Form.Label>
                                    <Controller
                                        control={control}
                                        name="type"
                                        rules={{ required: t("Notification Type is required") }}
                                        render={({ field, fieldState }) => (
                                            <>
                                                <Select
                                                    {...field}
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
                                                    options={typeOptions}
                                                    placeholder={t("Select notification type")}
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

                            {/* Date */}
                            <Form.Group controlId="date" className="mb-3">
                                <Form.Label>{t("Date")}</Form.Label>
                                <Form.Control type="date" {...register('date')} />
                            </Form.Group>

                            {/* Users or Groups */}
                            {notificationType === 'personal' ? (
                                <Col md={12}>
                                    <Form.Group controlId="users">
                                        <Form.Label>{t("Users")}</Form.Label>
                                        {userDataLoading ? (
                                            <div className="text-center">
                                                <Spinner animation="border" variant="primary" />
                                            </div>
                                        ) : userDataError ? (
                                            <p style={{ color: 'red' }}>Error: {userDataError}</p>
                                        ) : (
                                            <Controller
                                                control={control}
                                                name="users"
                                                rules={{ required: t("Please select at least one user") }}
                                                render={({ field, fieldState }) => (
                                                    <>
                                                        <Select
                                                            {...field}
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
                                                            options={userData.map(user => ({
                                                                value: user._id,
                                                                label: user.first_name + ' ' + user.last_name
                                                            }))}
                                                            isMulti
                                                            placeholder={t("Select user(s)")}
                                                        />
                                                        {fieldState.error && (
                                                            <Form.Text className="text-danger">
                                                                {fieldState.error.message}
                                                            </Form.Text>
                                                        )}
                                                    </>
                                                )}
                                            />
                                        )}
                                    </Form.Group>
                                </Col>
                            ) : (
                                <Col md={12}>
                                    <Form.Group controlId="groups">
                                        <Form.Label>{t("User Groups")}</Form.Label>
                                        {groupDataLoading ? (
                                            <div className="text-center">
                                                <Spinner animation="border" variant="primary" />
                                            </div>
                                        ) : groupDataError ? (
                                            <p style={{ color: 'red' }}>Error: {groupDataError}</p>
                                        ) : (
                                            <Controller
                                                control={control}
                                                name="groups"
                                                rules={{ required: t("Please select at least one group") }}
                                                render={({ field, fieldState }) => (
                                                    <>
                                                        <Select
                                                            {...field}
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
                                                            options={groupData.map(group => ({
                                                                value: group._id,
                                                                label: group.group_name
                                                            }))}
                                                            isMulti
                                                            placeholder={t("Select group(s)")}
                                                        />
                                                        {fieldState.error && (
                                                            <Form.Text className="text-danger">
                                                                {fieldState.error.message}
                                                            </Form.Text>
                                                        )}
                                                    </>
                                                )}
                                            />
                                        )}
                                    </Form.Group>
                                </Col>
                            )}

                            {/* Submit */}
                            <Button variant="primary" type="submit" disabled={isSubmitting} className="mt-3">
                                {isSubmitting ? t('Creating Notification') : t('Create Notification')}
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

export default CreateNotification;
