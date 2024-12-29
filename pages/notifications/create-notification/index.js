import React, { useState, useEffect } from 'react';
import { Form, Button, Card, ToggleButtonGroup, ToggleButton, Container, Col, Spinner } from 'react-bootstrap';
import Select from 'react-select';
import { useForm, Controller } from 'react-hook-form';
import { createPersonalNotification, createGroupNotification } from '@/services/notificationApi';
import notificationTypes from '@/static/data/notificationTypes';
import { getUsers } from '@/services/userApi';
import { getAllUserGroups } from '@/services/userGroupApi';
import Swal from 'sweetalert2';
import styles from './index.module.scss'

const CreateNotification = () => {
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

    // Handle title and description changes with capitalized first letter
    const handleNameChange = (e, name) => {
        const formattedValue = e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1);
        setValue(name, formattedValue);
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
                Swal.fire({
                    title: result.message,
                    icon: 'success'
                });
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
                Swal.fire({
                    title: result.error,
                    icon: 'error'
                });
            }
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: 'An error occurred when creating a new notification. Please try again later.',
                icon: 'error'
            });
        }
    };


    // Notification types
    const typeOptions = notificationTypes.map(type => ({
        value: type.typeName,
        label: type.typeName,
    }));

    return (
        <Container className={styles.notificationContainer}>
            <h2>Create Notification</h2>
            <Card>
                <Card.Body>
                    <div className="d-flex justify-content-center mb-4">
                        {/* Toggle */}
                        <ToggleButtonGroup
                            type="radio"
                            name="notificationType"
                            value={notificationType}
                            onChange={handleSwitch}
                            className="mb-4"
                        >
                            <ToggleButton id="personal" value="personal" variant="outline-primary">
                                Personal Notification
                            </ToggleButton>
                            <ToggleButton id="group" value="group" variant="outline-primary">
                                Group Notification
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </div>

                    <Form onSubmit={handleSubmit(onSubmit)}>
                        {/* Title */}
                        <Col md={12}>
                            <Form.Group controlId="title">
                                <Form.Label>Title</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter a title"
                                    isInvalid={!!errors.title}
                                    {...register("title", {
                                        required: "Title is required",
                                        minLength: { value: 2, message: "Title must be at least 2 characters" },
                                    })}
                                    onBlur={(e) => handleNameChange(e, "title")}
                                />
                                <Form.Control.Feedback type="invalid">{errors.title?.message}</Form.Control.Feedback>
                            </Form.Group>
                        </Col>

                        {/* Description */}
                        <Col md={12}>
                            <Form.Group controlId="description">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    placeholder="Enter a description"
                                    isInvalid={!!errors.description}
                                    {...register("description", {
                                        required: "Description is required",
                                        minLength: { value: 2, message: "Description must be at least 2 characters" },
                                        maxLength: { value: 255, message: 'Description cannot exceed 255 characters.' },
                                    })}
                                    onBlur={(e) => handleNameChange(e, "description")}
                                    className={styles.description}
                                />
                                <Form.Control.Feedback type="invalid">{errors.description?.message}</Form.Control.Feedback>
                            </Form.Group>
                        </Col>


                        {/* Notification Type*/}
                        <Col md={12}>
                            <Form.Group controlId="type">
                                <Form.Label>Notification Type</Form.Label>
                                <Controller
                                    control={control}
                                    name="type"
                                    rules={{ required: "Notification Type is required" }}
                                    render={({ field, fieldState }) => (
                                        <>
                                            <Select
                                                {...field}
                                                options={typeOptions}
                                                placeholder="Select notification type"
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
                            <Form.Label>Date</Form.Label>
                            <Form.Control type="date" {...register('date')} />
                        </Form.Group>

                        {/* Users or Groups */}
                        {notificationType === 'personal' ? (
                            <Col md={12}>
                                <Form.Group controlId="users">
                                    <Form.Label>Users</Form.Label>
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
                                            rules={{ required: "Please select at least one user" }}
                                            render={({ field, fieldState }) => (
                                                <>
                                                    <Select
                                                        {...field}
                                                        options={userData.map(user => ({
                                                            value: user._id,
                                                            label: user.first_name + ' ' + user.last_name
                                                        }))}
                                                        isMulti
                                                        placeholder="Select user(s)"
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
                                    <Form.Label>User Groups</Form.Label>
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
                                            rules={{ required: "Please select at least one group" }}
                                            render={({ field, fieldState }) => (
                                                <>
                                                    <Select
                                                        {...field}
                                                        options={groupData.map(group => ({
                                                            value: group._id,
                                                            label: group.group_name
                                                        }))}
                                                        isMulti
                                                        placeholder="Select group(s)"
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
                            {isSubmitting ? 'Creating Notification...' : 'Create Notification'}
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default CreateNotification;
