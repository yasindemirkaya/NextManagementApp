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

const CreateUserGroup = () => {
    const router = useRouter();
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
        try {
            const result = await createUserGroup(data);

            if (result.success) {
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
                toast('SUCCESS', result.message);
                setTimeout(() => {
                    router.push('/group-management/user-groups/view-user-groups')
                }, 2000);
            } else {
                toast('ERROR', result.error);
            }
        } catch (error) {
            toast('ERROR', 'An error occurred when creating a new user group. Please try again later.');
        }
    };

    return (
        <>
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
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter a description"
                                        isInvalid={!!errors.description}
                                        {...register("description", {
                                            minLength: { value: 2, message: "Description must be at least 2 characters" },
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
                                        <Form.Label>Group Type</Form.Label>
                                        <Controller
                                            control={control}
                                            name="type"
                                            rules={{ required: "Group Type is required" }}
                                            render={({ field, fieldState }) => (
                                                <>
                                                    <Select
                                                        {...field}
                                                        options={userGroupTypes.map(type => ({ value: type.type_name, label: type.type_name }))}
                                                        placeholder="Select group type"
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
                                        <Form.Label>Group Leader</Form.Label>
                                        <Controller
                                            control={control}
                                            name="groupLeader"
                                            rules={{ required: "Group Leader is required" }}
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
                                                            options={userData.map(user => ({ value: user._id, label: user.first_name + ' ' + user.last_name }))}
                                                            placeholder="Select group leader"
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
                                        <Form.Label>Group Members</Form.Label>
                                        <Controller
                                            control={control}
                                            name="members"
                                            rules={{ required: "Group members are required" }}
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
                                                            options={userData.map(user => ({ value: user._id, label: user.first_name + ' ' + user.last_name }))}
                                                            isMulti
                                                            value={userData.filter(user => field.value?.includes(user._id)).map(user => ({
                                                                value: user._id,
                                                                label: user.first_name + ' ' + user.last_name,
                                                            }))}
                                                            onChange={(selectedOptions) => field.onChange(selectedOptions ? selectedOptions.map(option => option.value) : [])}
                                                            placeholder="Select group members"
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
            <ToastContainer />
        </>
    );
};

export default CreateUserGroup;
