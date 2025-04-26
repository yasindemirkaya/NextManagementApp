import { Container, Card, Form, Button, Row, Col } from 'react-bootstrap';
import Select from 'react-select';
import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import styles from './index.module.scss'
import { useRouter } from "next/router";

import { getUsers } from "@/services/userApi";
import { getAllUserGroups } from '@/services/userGroupApi';
import { createTask } from '@/services/taskApi';
import { getProjects } from '@/services/projectApi';

import { capitalizeFirstLetter } from '@/helpers/capitalizeFirstLetter';
import taskLabels from '@/static/data/tasks/taskLabels';
import taskPriorities from '@/static/data/tasks/taskPriorities';
import assignmentTypes from '@/static/data/projects/assignmentTypes';

import toast from '@/utils/toastify';
import { ToastContainer } from 'react-toastify';

const CreateTask = () => {
    const t = useTranslations()
    const router = useRouter()
    const { control, register, handleSubmit, setValue, reset, watch, formState: { errors, isSubmitting } } = useForm({ mode: 'onBlur' });

    const [userOptions, setUserOptions] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(false);

    const [userGroupOptions, setUserGroupOptions] = useState([]);
    const [loadingUserGroups, setLoadingUserGroups] = useState(false);

    const [projects, setProjects] = useState([]);
    const [loadingProjects, setLoadingProjects] = useState(false);

    const assignmentType = watch("assignmentType");

    useEffect(() => {
        fetchUsers();
        fetchUserGroups();
        fetchProjects();
    }, []);

    // Format assignment types
    const assignmentTypeOptions = assignmentTypes.map(item => ({
        value: item.id,
        label: item.typeName
    }));

    // Format task labels
    const taskLabelOptions = taskLabels.map(item => ({
        value: item.id,
        label: item.labelName
    }))

    // Format task priorities
    const taskPriorityOptions = taskPriorities.map(item => ({
        value: item.id,
        label: item.priorityName
    }))

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

    // Fetch projects
    const fetchProjects = async () => {
        setLoadingProjects(true);
        const response = await getProjects();
        if (response.success) {
            const options = response.data.map(project => ({
                value: project._id,
                label: project.title,
            }));
            setProjects(options);
        } else {
            console.error(response.error);
        }
        setLoadingProjects(false);
    };

    // Submit project
    const onSubmit = async (data) => {
        // Format assignee_user and assignee_group for service request
        const assigneeUsers = data.assigneeUsers?.[0]?.value || "";
        const assigneeGroups = data.assigneeGroups?.[0]?.value || "";

        let payload = {
            title: data.title,
            description: data.description,
            label: data.label.label,
            assignment_type: data.assignmentType,
            assignee_user: data.assignmentType == 0 ? assigneeUsers : "",
            assignee_group: data.assignmentType == 1 ? assigneeGroups : "",
            project_id: data.project[0].value,
            deadline: data.deadline,
            priority: data.priority.label
        }

        const response = await createTask(payload)

        if (response.success) {
            toast('SUCCESS', response.message)
            router.push('/task-management/view-tasks')
            reset()
        } else {
            toast('ERROR', response.error)
        }
    };

    return (
        <>
            <Container>
                <Card className={`${styles.createTaskContainer}`}>
                    <Card.Body>
                        <h2>{t("Create Task")}</h2>
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
                                            placeholder={t("Enter a description for your task")}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.description?.message}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>

                                {/* Project */}
                                <Col md={12} className="mb-3">
                                    <Form.Group controlId="project">
                                        <Form.Label>{t("Project")}</Form.Label>
                                        <Controller
                                            name="project"
                                            control={control}
                                            render={({ field }) => (
                                                <Select
                                                    {...field}
                                                    options={projects}
                                                    isMulti
                                                    isLoading={loadingProjects}
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

                                {/* Label */}
                                <Col md={12} className="mb-3">
                                    <Form.Group controlId="label">
                                        <Form.Label>{t("Label")}</Form.Label>
                                        <Controller
                                            control={control}
                                            name="label"
                                            rules={{ required: t("Label is required") }}
                                            render={({ field, fieldState }) => (
                                                <>
                                                    <Select
                                                        {...field}
                                                        options={taskLabelOptions}
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
                                                        placeholder={t("Select a Label")}
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

                                {/* Priority */}
                                <Col md={12} className="mb-3">
                                    <Form.Group controlId="priority">
                                        <Form.Label>{t("Priority")}</Form.Label>
                                        <Controller
                                            control={control}
                                            name="priority"
                                            rules={{ required: t("Priority is required") }}
                                            render={({ field, fieldState }) => (
                                                <>
                                                    <Select
                                                        {...field}
                                                        options={taskPriorityOptions}
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
                                                        placeholder={t("Select a Priority")}
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

                                {/* Deadline */}
                                <Col md={12} className="mb-3">
                                    <Form.Group controlId="deadline">
                                        <Form.Label>{t("Deadline")}</Form.Label>
                                        <Form.Control
                                            type="date"
                                            {...register("deadline", { required: t("Deadline is required") })}
                                            isInvalid={!!errors.deadline}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.deadline?.message}
                                        </Form.Control.Feedback>
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
                                {isSubmitting ? t('Creating Task') : t('Create Task')}
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

export default CreateTask;