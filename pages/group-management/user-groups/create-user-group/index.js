import React, { useEffect, useState } from 'react';
import { Container, Card, Form, Button, Row, Col, Tooltip, OverlayTrigger, Spinner } from 'react-bootstrap';
import styles from './index.module.scss';
import { icons } from '@/static/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useForm, Controller } from 'react-hook-form';
import toast from '@/utils/toastify';
import { ToastContainer } from 'react-toastify';
import Select from 'react-select';
import { getUsers } from '@/services/userApi';
import { createUserGroup } from '@/services/userGroupApi';
import { getGroupTypes } from '@/services/groupTypeApi';
import { capitalizeFirstLetter } from '@/helpers/capitalizeFirstLetter';
import { useRouter } from 'next/router';
import { useTranslations } from 'next-intl';

const CreateUserGroup = () => {
    const router = useRouter();
    const t = useTranslations();

    const { register, handleSubmit, setValue, reset, control, formState: { errors, isSubmitting } } = useForm({
        mode: 'onBlur',
        defaultValues: {
            isActive: "1",
        },
    });

    const [userData, setUserData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [userGroupTypes, setUserGroupTypes] = useState([]);

    useEffect(() => {
        fetchUsers()
        fetchUserGroupTypes()
    }, []);

    // Get users
    const fetchUsers = async () => {
        setLoading(true)

        const result = await getUsers();

        if (result.success) {
            setUserData(result.data)
            setError(null)
        } else {
            setUserData([])
            setError(result.error)
        }

        setLoading(false)
    }

    // Get user group types
    const fetchUserGroupTypes = async () => {
        setLoading(true);

        const result = await getGroupTypes();

        if (result.success) {
            setUserGroupTypes(result.data);
            setLoading(false);
            setError(null);
        } else {
            setUserGroupTypes([]);  // Eğer hata varsa, userGroupTypes'ı boş yap
            setError(result.error);
            setLoading(false);
        }
    };

    // Submit form
    const onSubmit = async (data) => {
        let payload = {
            groupName: data.groupName,
            description: data.description,
            type: data.type.label,
            isActive: data.isActive,
            groupLeader: data.groupLeader.value,
            members: data.members,
        }
        try {
            const result = await createUserGroup(payload);

            if (result.success) {
                reset({
                    groupName: '',
                    description: '',
                    type: '',
                    isActive: '',
                    groupLeader: '',
                    members: [],
                });
                toast('SUCCESS', result.message);
                setTimeout(() => {
                    router.push('/group-management/user-groups/view-user-groups')
                }, 2000);
            } else {
                toast('ERROR', result.error);
            }
        } catch (error) {
            toast('ERROR', error.message);
        }
    };

    return (
        <>
            <Container>
                <Card className={`${styles.createUserGroupContainer}`}>
                    <Card.Body>
                        <h2>{t("Create User Group")}</h2>
                        <Form onSubmit={handleSubmit(onSubmit)}>
                            {/* Group Name */}
                            <Col md={12}>
                                <Form.Group controlId="groupName">
                                    <Form.Label>{t("Group Name")}</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder={t("Enter group name")}
                                        isInvalid={!!errors.groupName}
                                        {...register("groupName", {
                                            required: t("Name is required"),
                                            minLength: { value: 2, message: t("Name must be at least 2 characters") },
                                            onBlur: (e) => {
                                                const formattedValue = capitalizeFirstLetter(e.target.value);
                                                setValue("groupName", formattedValue);
                                            },
                                        })}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.groupName?.message}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>

                            {/* Description */}
                            <Col md={12}>
                                <Form.Group controlId="description">
                                    <Form.Label>{t("Description")}</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder={t("Enter a description")}
                                        isInvalid={!!errors.description}
                                        {...register("description", {
                                            minLength: { value: 2, message: t("Description must be at least 2 characters") },
                                            onBlur: (e) => {
                                                const formattedValue = capitalizeFirstLetter(e.target.value);
                                                setValue("description", formattedValue);
                                            },
                                        })}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.description?.message}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>

                            <Row>
                                {/* Type */}
                                <Col md={6}>
                                    <Form.Group controlId="type">
                                        <Form.Label>{t("Group Type")}</Form.Label>
                                        <Controller
                                            control={control}
                                            name="type"
                                            rules={{ required: t("Group Type is required") }}
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
                                                        options={userGroupTypes.map(type => ({ value: type.type_name, label: type.type_name }))}
                                                        placeholder={t("Select group type")}
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

                                {/* Group Leader */}
                                <Col md={6}>
                                    <Form.Group controlId="groupLeader">
                                        <Form.Label>{t("Group Leader")}</Form.Label>
                                        <Controller
                                            control={control}
                                            name="groupLeader"
                                            rules={{ required: t("Group Leader is required") }}
                                            render={({ field, fieldState }) => (
                                                <>
                                                    {loading ? (
                                                        <div className="text-center">
                                                            <Spinner animation="border" variant="primary" />
                                                        </div>
                                                    ) : error ? (
                                                        <p style={{ color: 'red' }}>Error: {error}</p>
                                                    ) : (
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
                                                            options={userData.map(user => ({ value: user._id, label: user.first_name + ' ' + user.last_name }))}
                                                            placeholder={t("Select group leader")}
                                                        />
                                                    )}
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

                            {/* Group Members */}
                            <Row>
                                <Col md={12}>
                                    <Form.Group controlId="members">
                                        <Form.Label>{t("Group Members")}</Form.Label>
                                        <Controller
                                            control={control}
                                            name="members"
                                            rules={{ required: t("Group members are required") }}
                                            render={({ field, fieldState }) => (
                                                <>
                                                    {loading ? (
                                                        <div className="text-center">
                                                            <Spinner animation="border" variant="primary" />
                                                        </div>
                                                    ) : error ? (
                                                        <p style={{ color: 'red' }}>Error: {error}</p>
                                                    ) : (
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
                                                            options={userData.map(user => ({ value: user._id, label: user.first_name + ' ' + user.last_name }))}
                                                            isMulti
                                                            value={userData.filter(user => field.value?.includes(user._id)).map(user => ({
                                                                value: user._id,
                                                                label: user.first_name + ' ' + user.last_name,
                                                            }))}
                                                            onChange={(selectedOptions) => field.onChange(selectedOptions ? selectedOptions.map(option => option.value) : [])}
                                                            placeholder={t("Select group members")}
                                                        />
                                                    )}
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

                            {/* Is Active */}
                            <Form.Group controlId="isActive" className="mt-3">
                                <Form.Label className="me-2">{t("Is Active")}</Form.Label>
                                <OverlayTrigger
                                    placement="right"
                                    overlay={<Tooltip>{t("Create User Tooltip Message 1")}</Tooltip>}>
                                    <FontAwesomeIcon icon={icons.faInfoCircle} />
                                </OverlayTrigger>
                                <br />
                                <Form.Check type="radio" label={t("Yes")} {...register("isActive")} value="1" inline />
                                <Form.Check type="radio" label={t("No")} {...register("isActive")} value="0" inline />
                            </Form.Group>

                            {/* Button */}
                            <Button variant="primary" type="submit" disabled={isSubmitting} className="mt-3">
                                {isSubmitting ? t('Creating User Group') : t('Create User Group')}
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
    const commonMessages = await import(`../../../../public/locales/common/${context.locale}.json`);
    const validationMessages = await import(`../../../../public/locales/validation/${context.locale}.json`);
    const formMessages = await import(`../../../../public/locales/form/${context.locale}.json`);

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


export default CreateUserGroup;
