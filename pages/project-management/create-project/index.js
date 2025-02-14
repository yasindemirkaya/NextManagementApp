import { Container, Card, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import Select from 'react-select';
import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import styles from './index.module.scss'
import { useRouter } from "next/router";

import { getUsers } from "@/services/userApi";
import { getAllUserGroups } from '@/services/userGroupApi';
import { createProject } from '@/services/projectApi';

import { capitalizeFirstLetter } from '@/helpers/capitalizeFirstLetter';
import projectTypes from '@/static/data/projects/projectTypes';
import assignmentTypes from '@/static/data/projects/assignmentTypes';

import toast from '@/utils/toastify';
import { ToastContainer } from 'react-toastify';

const CreateProject = () => {
    const t = useTranslations()
    const router = useRouter()
    const { control, register, handleSubmit, setValue, reset, watch, formState: { errors, isSubmitting } } = useForm({ mode: 'onBlur' });

    const [userOptions, setUserOptions] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(false);

    const [userGroupOptions, setUserGroupOptions] = useState([]);
    const [loadingUserGroups, setLoadingUserGroups] = useState(false);

    const assignmentType = watch("assignmentType");

    useEffect(() => {
        fetchUsers();
        fetchUserGroups();
    }, []);

    // Format project types
    const projectTypeOptions = projectTypes.map(item => ({
        value: item.typeName,
        label: item.typeName
    }));

    // Format assignment types
    const assignmentTypeOptions = assignmentTypes.map(item => ({
        value: item.id,
        label: item.typeName
    }));

    // Get users
    const fetchUsers = async () => {
        setLoadingUsers(true);
        const response = await getUsers();
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

    // Get user groups
    const fetchUserGroups = async () => {
        setLoadingUserGroups(true);
        const response = await getAllUserGroups();
        if (response.success) {
            const options = response.data.map(group => ({
                value: group._id,
                label: group.group_name,
            }));
            setUserGroupOptions(options);
        } else {
            console.error(response.error);
        }
        setLoadingUserGroups(false);
    };

    // On assignment type change
    const handleAssignmentTypeChange = async (selectedOption) => {
        setValue("assignmentType", selectedOption.value)
    }

    // Submit project
    const onSubmit = async (data) => {
        // Format assignee_user and assignee_group for service request
        const assigneeUsers = data.assigneeUsers ? data.assigneeUsers.map(user => user.value) : "";
        const assigneeGroups = data.assigneeGroups ? data.assigneeGroups.map(group => group.value) : "";

        let payload = {
            title: data.title,
            description: data.description,
            type: data.projectType.value,
            start_date: data.startDate,
            end_date: data.endDate,
            project_lead: data.projectLead.value,
            assignment_type: data.assignmentType,
            assignee_user: assigneeUsers,
            assignee_group: assigneeGroups
        }

        const response = await createProject(payload)

        if (response.success) {
            toast('SUCCESS', response.message)
            router.push('/projects/view-projects')
            reset()
        } else {
            toast('ERROR', response.error)
        }
    };

    return (
        <>
            <Container>
                <Card className={`${styles.createProjectContainer}`}>
                    <Card.Body>
                        <h2>{t("Create Project")}</h2>
                        <Form onSubmit={handleSubmit(onSubmit)}>
                            <Row>
                                {/* Title */}
                                <Col md={12} className="mb-3">
                                    <Form.Group controlId="title">
                                        <Form.Label>{t("Title")}</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder={t("Enter a title")}
                                            isInvalid={!!errors.title}
                                            {...register("title", {
                                                required: t('Title is required'),
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
                                            placeholder={t("Enter a description for your project")}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.description?.message}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>

                                {/* Project Type */}
                                <Col md={12} className="mb-3">
                                    <Form.Group controlId="projectType">
                                        <Form.Label>{t("Project Type")}</Form.Label>
                                        <Controller
                                            control={control}
                                            name="projectType"
                                            rules={{ required: t("Project Type is required") }}
                                            render={({ field, fieldState }) => (
                                                <>
                                                    <Select
                                                        {...field}
                                                        options={projectTypeOptions}
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
                                                        placeholder={t("Select a Project Type")}
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

                                {/* Project Lead */}
                                <Col md={12} className="mb-3">
                                    <Form.Group controlId="projectLead">
                                        <Form.Label>{t("Project Lead")}</Form.Label>
                                        <Controller
                                            control={control}
                                            name="projectLead"
                                            rules={{ required: t("Project Lead is required") }}
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
                                                        placeholder={t("Select a Project Lead")}
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

                                {/* Assignment Type */}
                                <Col md={12} className="mb-3">
                                    <Form.Group controlId="assignmentType">
                                        <Form.Label>{t("Assignment Type")}</Form.Label>
                                        <Controller
                                            control={control}
                                            name="assignmentType"
                                            rules={{ required: t("Assignment Type is required") }}
                                            render={({ field, fieldState }) => (
                                                <>
                                                    <Select
                                                        {...field}
                                                        options={assignmentTypeOptions}
                                                        value={assignmentTypeOptions.find(option => option.value === field.value)}
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
                                                        placeholder={t("Select an Assignment Type")}
                                                        onChange={(selectedOption) => field.onChange(selectedOption.value)} // field.onChange kullanıyoruz
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

                                {/* Assignee User(s) */}
                                {assignmentType === 0 && (
                                    <Col md={12} className="mb-3">
                                        <Form.Group controlId="assigneeUsers">
                                            <Form.Label>{t("Assignee User(s)")}</Form.Label>
                                            <Controller
                                                name="assigneeUsers"
                                                control={control}
                                                render={({ field }) => (
                                                    <Select
                                                        {...field}
                                                        options={userOptions}
                                                        isMulti
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
                                                    />
                                                )}
                                            />
                                        </Form.Group>
                                    </Col>
                                )}

                                {/* Assignee Group(s) */}
                                {assignmentType === 1 && (
                                    <Col md={12} className="mb-3">
                                        <Form.Group controlId="assigneeGroups">
                                            <Form.Label>{t("Assignee Group(s)")}</Form.Label>
                                            <Controller
                                                name="assigneeGroups"
                                                control={control}
                                                render={({ field }) => (
                                                    <Select
                                                        {...field}
                                                        options={userGroupOptions}
                                                        isMulti
                                                        isLoading={loadingUserGroups}
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
                                                    />
                                                )}
                                            />
                                        </Form.Group>
                                    </Col>
                                )}
                            </Row>

                            <Button variant="primary" type="submit" disabled={isSubmitting}>
                                {isSubmitting ? t('Creating Project') : t('Create Project')}
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
                ...validationMessages.default,
                ...commonMessages.default
            },
        },
    };
}

export default CreateProject;