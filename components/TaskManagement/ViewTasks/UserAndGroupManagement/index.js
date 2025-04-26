import { useEffect, useState } from "react";
import { Card, Form, Button, Row, Col, Spinner } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import styles from './index.module.scss';

import { updateTask } from '@/services/taskApi';

import toast from '@/utils/toastify';
import { ToastContainer } from 'react-toastify';

import { useRouter } from "next/router";
import { useTranslations } from 'next-intl';
import { getUsers } from "@/services/userApi";
import { getAllUserGroups } from "@/services/userGroupApi";

const UserAndGroupManagement = ({ task, fetchTaskDetails }) => {
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
        // Set assignee user
        if (task?.assignee_user) {
            const selectedUser = users.find(user =>
                task.assignee_user.some(assignee => assignee.id === user._id)
            );
            setValue("assigneeUser", selectedUser ? selectedUser._id : null);
        }

        // Set assignee group
        if (task?.assignee_group) {
            const selectedGroup = userGroups.find(group =>
                task.assignee_group.some(assignee => assignee.id === group._id)
            );
            setValue("assigneeGroup", selectedGroup ? selectedGroup._id : null);
        }
    }, [task, setValue, users]);

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

    // Update task
    const onSubmit = async (data) => {
        let payload = {
            taskId: task._id,
            assignee_user: data.assigneeUser,
            assignee_group: data.assigneeGroup
        }
        const result = await updateTask(payload)

        if (result.success) {
            toast('SUCCESS', result.message)
            fetchTaskDetails(task._id)
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

                    {/* Assignee Users */}
                    <Form.Group controlId="assigneeUser" className="mb-3">
                        <Form.Label>{t("Assignee Users")}</Form.Label>
                        <Controller
                            control={control}
                            name="assigneeUser"
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
                                        value={users
                                            .filter(user => field.value?.includes(user._id))
                                            .map(user => ({
                                                value: user._id,
                                                label: `${user.first_name} ${user.last_name}`
                                            }))}
                                        onChange={(selected) => {
                                            const value = selected ? selected.value : null;
                                            field.onChange(value);
                                        }}
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
                    <Form.Group controlId="assigneeGroup" className="mb-3">
                        <Form.Label>{t("Assignee Groups")}</Form.Label>
                        <Controller
                            control={control}
                            name="assigneeGroup"
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
                                        value={userGroups
                                            .filter(group => field.value?.includes(group._id))
                                            .map(group => ({
                                                value: group._id,
                                                label: group.group_name
                                            }))}
                                        onChange={(selected) => {
                                            const value = selected ? selected.value : null;
                                            field.onChange(value);
                                        }}
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