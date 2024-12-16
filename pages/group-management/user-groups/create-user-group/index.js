import React, { useEffect, useState } from 'react';
import { Container, Card, Form, Button, Row, Col, Tooltip, OverlayTrigger, Spinner } from 'react-bootstrap';
import axios from '@/utils/axios';
import styles from './index.module.scss';
import { icons } from '@/static/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import Select from 'react-select';
import { getUsers } from '@/services/userApi';

const CreateUserGroup = () => {
    const { register, handleSubmit, setValue, reset, formState: { errors, isSubmitting } } = useForm({
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
        getUserGroupTypes()
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
    const getUserGroupTypes = async () => {
        await axios.get('/private/user-group-types/get-user-group-types')
            .then(response => {
                if (response.code === 1) {
                    setUserGroupTypes(response.user_group_types);
                    setLoading(false);
                    setError(null);
                } else {
                    setError('Failed to fetch user group types');
                    setLoading(false);
                }
            })
            .catch(error => {
                setUserData([]);
                setError(error.message);
                setLoading(false);
            });
    }

    // Submit form
    const onSubmit = async (data) => {
        try {
            const response = await axios.post('/private/group/create-user-group', {
                groupName: data.groupName,
                description: data.description,
                type: data.type,
                isActive: data.isActive,
                groupLeader: data.groupLeader,
                members: data.members || []
            })

            if (response.code === 1) {
                reset({
                    groupName: '',
                    description: '',
                    email: '',
                    password: '',
                    mobile: '',
                    isActive: '1',
                    isVerified: '1',
                    role: '0',
                });
                Swal.fire({
                    title: response.message,
                    icon: 'success'
                });
            } else {
                Swal.fire({
                    title: response.message,
                    icon: 'error'
                });
            }
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: 'An error occurred when creating a new user. Please try again later.',
                icon: 'error'
            });
        }
    };

    // Group Name ve Description baş harfi otomatik büyük harf yapmak için
    const handleNameChange = (e, name) => {
        const formattedValue = e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1);
        setValue(name, formattedValue);
    };

    return (
        <Container>
            <Card className={`${styles.createUserContainer}`}>
                <Card.Body>
                    <h2>Create User Group</h2>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        {/* Group Name */}
                        <Col md={12}>
                            <Form.Group controlId="groupName">
                                <Form.Label>Group Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter group name"
                                    isInvalid={!!errors.groupName}
                                    {...register("groupName", {
                                        required: "Name is required",
                                        minLength: { value: 2, message: "Name must be at least 2 characters" },
                                    })}
                                    onBlur={(e) => handleNameChange(e, "groupName")}
                                />
                                <Form.Control.Feedback type="invalid">{errors.groupName?.message}</Form.Control.Feedback>
                            </Form.Group>
                        </Col>

                        {/* Description */}
                        <Col md={12}>
                            <Form.Group controlId="description">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter a description"
                                    isInvalid={!!errors.description}
                                    {...register("description", {
                                        minLength: { value: 2, message: "Description must be at least 2 characters" },
                                    })}
                                    onBlur={(e) => handleNameChange(e, "description")}
                                />
                                <Form.Control.Feedback type="invalid">{errors.description?.message}</Form.Control.Feedback>
                            </Form.Group>
                        </Col>

                        <Row>
                            {/* Type */}
                            <Col md={6}>
                                <Form.Group controlId="type">
                                    <Form.Label>Group Type</Form.Label>
                                    <Select
                                        options={userGroupTypes.map(type => ({ value: type.type_name, label: type.type_name }))}
                                        onChange={(selectedOption) => setValue('type', selectedOption.value)}
                                        placeholder="Select group type"
                                    />
                                </Form.Group>
                            </Col>

                            {/* Group Leader */}
                            <Col md={6}>
                                <Form.Group controlId="groupLeader">
                                    <Form.Label>Group Leader</Form.Label>
                                    {loading ? (
                                        <div className="text-center">
                                            <Spinner animation="border" variant="primary" />
                                        </div>
                                    ) : error ? (
                                        <p style={{ color: 'red' }}>Error: {error}</p>
                                    ) : (
                                        <Select
                                            options={userData.map(user => ({ value: user._id, label: user.first_name + ' ' + user.last_name }))}
                                            onChange={(selectedOption) => setValue('groupLeader', selectedOption.value)}
                                            placeholder="Select group leader"
                                        />
                                    )}
                                </Form.Group>
                            </Col>
                        </Row>

                        {/* Group Members */}
                        <Row>
                            <Col md={12}>
                                <Form.Group controlId="members">
                                    <Form.Label>Group Members</Form.Label>
                                    {loading ? (
                                        <div className="text-center">
                                            <Spinner animation="border" variant="primary" />
                                        </div>
                                    ) : error ? (
                                        <p style={{ color: 'red' }}>Error: {error}</p>
                                    ) : (
                                        <Select
                                            options={userData.map(user => ({ value: user._id, label: user.first_name + ' ' + user.last_name }))}
                                            isMulti
                                            onChange={(selectedOptions) => setValue('members', selectedOptions.map(option => option.value))}
                                            placeholder="Select group members"
                                        />
                                    )}
                                </Form.Group>
                            </Col>
                        </Row>

                        {/* Is Active */}
                        <Form.Group controlId="isActive" className="mt-3">
                            <Form.Label className="me-2">Is Active</Form.Label>
                            <OverlayTrigger
                                placement="right"
                                overlay={<Tooltip>You may want to create the user group and leave it inactive. You can reactivate the group at any time.</Tooltip>}>
                                <FontAwesomeIcon icon={icons.faInfoCircle} />
                            </OverlayTrigger>
                            <br />
                            <Form.Check type="radio" label="Yes" {...register("isActive")} value="1" inline />
                            <Form.Check type="radio" label="No" {...register("isActive")} value="0" inline />
                        </Form.Group>

                        {/* Button */}
                        <Button variant="primary" type="submit" disabled={isSubmitting} className="mt-3">
                            {isSubmitting ? 'Creating User Group...' : 'Create User Group'}
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default CreateUserGroup;
