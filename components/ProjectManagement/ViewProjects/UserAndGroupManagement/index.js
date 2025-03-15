import { useEffect, useState } from "react";
import { Card, Form, Button, Row, Col, Spinner } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import styles from './index.module.scss';

import { updateProject } from '@/services/projectApi';

import toast from '@/utils/toastify';
import { ToastContainer } from 'react-toastify';

import { useRouter } from "next/router";
import { useTranslations } from 'next-intl';
import { getUsers } from "@/services/userApi";
import { getAllUserGroups } from "@/services/userGroupApi";

const UserAndGroupManagement = ({ project, fetchProjectDetails }) => {
    const router = useRouter();
    const t = useTranslations();

    const { control, handleSubmit, setValue } = useForm();

    const [isEditable, setIsEditable] = useState(false);

    const [users, setUsers] = useState([]);
    const [usersLoading, setUsersLoading] = useState(false);
    const [usersError, setUsersError] = useState(null);

    const [userGroups, setUserGroups] = useState([]);
    const [userGroupsLoading, setUserGroupsLoading] = useState(false);
    const [userGroupsError, setUserGroupsError] = useState(null);

    useEffect(() => {
        fetchUsers();
        fetchUserGroups();
    }, []);

    useEffect(() => {
        // Set project lead
        if (project?.project_lead?.name) {
            const projectLead = users.find(user => `${user.first_name} ${user.last_name}` === project.project_lead.name);
            if (projectLead) {
                setValue("projectLead", projectLead._id);
            }
        }

        // Set assignee users
        if (project?.assignee_user?.length) {
            const selectedUsers = users.filter(user =>
                project.assignee_user.some(assignee => assignee.id === user._id)
            );
            setValue("assigneeUsers", selectedUsers.map(user => user._id));
        }

        // Set assignee groups
        if (project?.assignee_group?.length) {
            const selectedGroups = userGroups.filter(group =>
                project.assignee_group.some(assignee => assignee.id === group._id)
            );
            setValue("assigneeGroups", selectedGroups.map(group => group._id));
        }
    }, [project, setValue, users]);

    // Fetch users
    const fetchUsers = async () => {
        setUsersLoading(true);

        try {
            const result = await getUsers();
            if (result.success) {
                setUsers(result.data);
            } else {
                setUsersError(result.error);
            }
        } catch (error) {
            setUsersError(error.message);
        } finally {
            setUsersLoading(false);
        }
    };

    // Fetch user groups
    const fetchUserGroups = async () => {
        setUserGroupsLoading(true);

        try {
            const result = await getAllUserGroups();
            if (result.success) {
                setUserGroups(result.data);
            } else {
                setUserGroupsError(result.error);
            }
        } catch (error) {
            setUserGroupsError(error.message);
        } finally {
            setUserGroupsLoading(false);
        }
    };

    // Handle Edit
    const handleEdit = () => {
        setIsEditable(true);
    };

    // Handle Cancel
    const handleCancel = () => {
        setIsEditable(false);
    };

    // Update project
    const onSubmit = async (data) => {
        let payload = {
            projectId: project._id,
            project_lead: data.projectLead,
            assignee_user: data.assigneeUsers,
            assignee_group: data.assigneeGroups
        }
        const result = await updateProject(payload)

        if (result.success) {
            toast('SUCCESS', result.message)
            fetchProjectDetails(project._id)
            setIsEditable(false)
        } else {
            toast('ERROR', result.error)
            setIsEditable(false)
        }
    }

    return (
        <>
            <Card className={styles.userAndGroupManagementCard}>
                <Card.Body>
                    <Card.Title>{t("User and Group Management")}</Card.Title>

                    {/* Project Lead */}
                    <Form.Group controlId="projectLead" className="mt-3 mb-3">
                        <Form.Label>{t("Project Lead")}</Form.Label>
                        <Controller
                            control={control}
                            name="projectLead"
                            render={({ field, fieldState }) => {
                                const selectedUser = users.find(user => user._id === field.value);  // Burada field.value, kullanıcının ID'si olmalı
                                return (
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
                                            isDisabled={!isEditable}
                                            options={users.map(user => ({
                                                value: user._id,
                                                label: `${user.first_name} ${user.last_name}`,
                                            }))}
                                            value={selectedUser ? {
                                                value: selectedUser._id,
                                                label: `${selectedUser.first_name} ${selectedUser.last_name}`
                                            } : null}
                                            onChange={(selected) => field.onChange(selected?.value || null)}
                                            placeholder={t("Select a Project Lead")}
                                        />
                                        {fieldState.invalid && (
                                            <Form.Control.Feedback type="invalid">
                                                {fieldState.error?.message}
                                            </Form.Control.Feedback>
                                        )}
                                    </>
                                );
                            }}
                        />
                    </Form.Group>

                    {/* Assignee Users */}
                    <Form.Group controlId="assigneeUsers" className="mb-3">
                        <Form.Label>{t("Assignee Users")}</Form.Label>
                        <Controller
                            control={control}
                            name="assigneeUsers"
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
                                        isDisabled={!isEditable}
                                        options={users.map(user => ({
                                            value: user._id,
                                            label: `${user.first_name} ${user.last_name}`
                                        }))}
                                        isMulti
                                        value={users
                                            .filter(user => field.value?.includes(user._id))
                                            .map(user => ({
                                                value: user._id,
                                                label: `${user.first_name} ${user.last_name}`
                                            }))}
                                        onChange={(selected) => field.onChange(selected.map(option => option.value))}
                                        placeholder={t("Add or Remove Users")}
                                    />
                                    {fieldState.invalid && (
                                        <Form.Control.Feedback type="invalid">
                                            {fieldState.error?.message}
                                        </Form.Control.Feedback>
                                    )}
                                </>
                            )}
                        />
                        {usersLoading && <Spinner animation="border" variant="primary" className="mt-3" />}
                        {usersError && <p className="text-danger mt-2">{usersError}</p>}
                    </Form.Group>

                    {/* User Groups */}
                    <Form.Group controlId="assigneeGroups" className="mb-3">
                        <Form.Label>{t("Assignee Groups")}</Form.Label>
                        <Controller
                            control={control}
                            name="assigneeGroups"
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
                                        isDisabled={!isEditable}
                                        options={userGroups.map(group => ({
                                            value: group._id,
                                            label: group.group_name
                                        }))}
                                        isMulti
                                        value={userGroups
                                            .filter(group => field.value?.includes(group._id))
                                            .map(group => ({
                                                value: group._id,
                                                label: group.group_name
                                            }))}
                                        onChange={(selected) => field.onChange(selected.map(option => option.value))}
                                        placeholder={t("Add or Remove Groups")}
                                    />
                                    {fieldState.invalid && (
                                        <Form.Control.Feedback type="invalid">
                                            {fieldState.error?.message}
                                        </Form.Control.Feedback>
                                    )}
                                </>
                            )}
                        />
                        {userGroupsLoading && <Spinner animation="border" variant="primary" className="mt-3" />}
                        {userGroupsError && <p className="text-danger mt-2">{userGroupsError}</p>}
                    </Form.Group>

                    {/* Buttons */}
                    <Row>
                        <Col>
                            {!isEditable ? (
                                <Button variant="primary" onClick={handleEdit}>
                                    {t('Edit')}
                                </Button>
                            ) : (
                                <>
                                    <Button variant="secondary" onClick={handleCancel} className="me-2">
                                        {t('Cancel')}
                                    </Button>
                                    <Button variant="success" type="submit" onClick={handleSubmit(onSubmit)} className="me-2">
                                        {t('Save')}
                                    </Button>
                                </>
                            )}
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
            <ToastContainer />
        </>
    )
}

export default UserAndGroupManagement;