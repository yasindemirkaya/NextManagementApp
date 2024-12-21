import { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Form, Spinner } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import styles from './index.module.scss';
import axios from '@/utils/axios';
import { useSelector } from 'react-redux';
import Select from 'react-select';

import { getUsers } from '@/services/userApi';
import { getUserGroupTypes } from '@/services/userGroupTypeApi';
import { deleteUserGroup, updateUserGroup } from '@/services/userGroupApi';

const EditGroupProfileCard = ({ userGroupData, onCancel }) => {
    const loggedInUser = useSelector(state => state.user.user);
    const router = useRouter();

    const [isActive, setIsActive] = useState(userGroupData.is_active === true);
    const [userGroupTypes, setUserGroupTypes] = useState([]);
    const [userData, setUserData] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { register, handleSubmit, formState: { errors }, setValue } = useForm({
        defaultValues: {
            groupName: userGroupData.group_name,
            description: userGroupData.description,
            groupLeader: userGroupData.group_leader,
            isActive: userGroupData.is_active === true,
            groupType: userGroupData.type,
            groupMembers: userGroupData.members,
        }
    });

    useEffect(() => {
        fetchUsers()
        handleGetUserGroupTypes()

        // Set default values after fetching users and types
        if (userGroupData) {
            setValue('groupLeader', userGroupData.group_leader_id);
            setValue('groupType', userGroupData.type);
            setValue('groupMembers', userGroupData.members);
        }
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
    const handleGetUserGroupTypes = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await getUserGroupTypes();

            if (response.code === 1) {
                setUserGroupTypes(response.user_group_types);
            } else {
                setError('Failed to fetch user group types');
            }
        } catch (error) {
            console.error('Error fetching user group types:', error);
            setUserGroupTypes([]);
            setError(error.message || 'An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    // Update User Group
    const handleUpdateUserGroup = async (data) => {
        const updatedData = {
            id: userGroupData._id,
            group_name: data.groupName,
            description: data.description,
            group_leader: data.groupLeader,
            is_active: isActive ? 1 : 0,
            type: data.type,
            members: data.members,
            updatedBy: loggedInUser.id // Güncelleyen kullanıcıyı ekle
        };

        const result = await updateUserGroup(updatedData); // API isteği

        if (result.success) {
            Swal.fire({
                title: result.message,
                icon: 'success'
            });
        } else {
            Swal.fire({
                title: result.error,
                icon: 'error',
            });
        }
    };

    // Delete User Group
    const handleDeleteUserGroup = async (userGroupId) => {
        const confirmation = await Swal.fire({
            title: 'Are you sure?',
            text: "This user group will be permanently deleted and cannot be recovered.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        });

        if (confirmation.isConfirmed) {
            const result = await deleteUserGroup(userGroupId); // API isteği

            if (result.success) {
                Swal.fire({
                    title: 'User Group Deleted',
                    text: result.message,
                    icon: 'success'
                });
                setTimeout(() => {
                    router.push('/group-management/user-groups/view-user-groups');
                }, 1000);
            } else {
                Swal.fire({
                    title: 'Error',
                    text: result.error,
                    icon: 'error'
                });
            }
        }
    };

    // Handle save
    const handleSave = async (data) => {
        handleUpdateUserGroup(data)
    };

    // Handle delete
    const handleDelete = async () => {
        handleDeleteUserGroup(userGroupData._id)
    };

    // Hangi durumda silme özelliği kullanıcılara gösterilecek
    const deleteUserGroupDisplayer = (loggedInUser) => {
        if (loggedInUser && loggedInUser.role != 0) {
            return true
        } else {
            return false
        }
    }

    return (
        <Card className={styles.profileEditCard}>
            <Card.Body>
                {/* Title */}
                <Card.Title>Edit User Group</Card.Title>
                <Form onSubmit={handleSubmit(handleSave)}>
                    {/* Group Name */}
                    <Form.Group className="mb-3">
                        <Form.Label>Group Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter group name"
                            {...register("groupName", {
                                required: "Name is required",
                                minLength: { value: 2, message: "Name must be at least 2 characters" },
                            })}
                            isInvalid={!!errors.groupName}
                        />
                        <Form.Control.Feedback type="invalid">{errors.groupName?.message}</Form.Control.Feedback>
                    </Form.Group>

                    {/* Group Description */}
                    <Form.Group className="mb-3">
                        <Form.Label>Group Description</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter description"
                            {...register("description", {
                            })}
                            isInvalid={!!errors.description}
                        />
                        <Form.Control.Feedback type="invalid">{errors.description?.message}</Form.Control.Feedback>
                    </Form.Group>

                    {/* Group Leader */}
                    <Form.Group className="mb-3" controlId="groupLeader">
                        <Form.Label>Group Leader</Form.Label>
                        {loading ? (
                            <div className="text-center">
                                <Spinner animation="border" variant="primary" />
                            </div>
                        ) : error ? (
                            <p className="text-danger">Error: {error}</p>
                        ) : (
                            <Select
                                options={userData.map(user => ({
                                    value: user._id,
                                    label: `${user.first_name} ${user.last_name}`
                                }))}
                                value={userData.find(user => user._id === userGroupData.group_leader_id) ? {
                                    value: userGroupData.group_leader_id,
                                    label: `${userData.find(user => user._id === userGroupData.group_leader_id).first_name} ${userData.find(user => user._id === userGroupData.group_leader_id).last_name}`
                                } : null}
                                onChange={(selectedOption) => setValue('groupLeader', selectedOption ? selectedOption.value : null)}
                                placeholder="Select group leader"
                            />
                        )}
                    </Form.Group>

                    {/* Group Type */}
                    <Form.Group controlId="groupType">
                        <Form.Label>Group Type</Form.Label>
                        {loading ? (
                            <div className="text-center">
                                <Spinner animation="border" variant="primary" />
                            </div>
                        ) : error ? (
                            <p className="text-danger">Error: {error}</p>
                        ) : (
                            <Select
                                options={userGroupTypes.map(groupType => ({
                                    value: groupType._id,
                                    label: groupType.type_name
                                }))}
                                value={userGroupTypes.find(groupType => groupType.type_name === userGroupData.type) ? {
                                    value: userGroupTypes.find(groupType => groupType.type_name === userGroupData.type)._id,
                                    label: userGroupData.type
                                } : null}
                                onChange={(selectedOption) => setValue('groupType', selectedOption ? selectedOption.value : null)}
                                placeholder="Select group type"
                            />
                        )}
                    </Form.Group>

                    {/* Group Members */}
                    <Form.Group className="mb-3" controlId="members">
                        <Form.Label>Group Members</Form.Label>
                        {loading ? (
                            <div className="text-center">
                                <Spinner animation="border" variant="primary" />
                            </div>
                        ) : error ? (
                            <p className="text-danger">Error: {error}</p>
                        ) : (
                            <Select
                                options={userData.map(user => ({
                                    value: user._id,
                                    label: `${user.first_name} ${user.last_name}`
                                }))}
                                isMulti
                                value={userGroupData.members.map(memberId => {
                                    const member = userData.find(user => user._id === memberId);
                                    return member ? { value: member._id, label: `${member.first_name} ${member.last_name}` } : null;
                                }).filter(item => item !== null)}
                                onChange={(selectedOptions) => setValue('members', selectedOptions.map(option => option.value))}
                                placeholder="Select group members"
                            />
                        )}
                    </Form.Group>

                    {/* Status */}
                    <Form.Group className="mb-3">
                        <Form.Label>Group Status</Form.Label>
                        <Form.Check
                            type="switch"
                            id="isActive"
                            name="isActive"
                            checked={isActive}
                            onChange={(e) => setIsActive(e.target.checked)}
                        />
                    </Form.Group>

                    <Button variant="primary" type="submit">Save</Button>
                    <Button variant="secondary" className="ms-2" onClick={onCancel}>Back</Button>
                </Form>

                {/* Delete user group */}
                {deleteUserGroupDisplayer(loggedInUser) ? (
                    <Row className="mt-3">
                        <Col md={12}>
                            <div onClick={handleDelete} className={styles.link}>
                                <p className="text-danger">Delete this user group.</p>
                            </div>
                        </Col>
                    </Row>
                ) : null}
            </Card.Body>
        </Card>
    )
}

export default EditGroupProfileCard;