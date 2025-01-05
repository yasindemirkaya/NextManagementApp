import { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Form, Spinner } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { useForm, Controller } from 'react-hook-form';
import styles from './index.module.scss';
import { useSelector } from 'react-redux';
import Select from 'react-select';
import toast from '@/utils/toastify';
import { ToastContainer } from 'react-toastify';
import Swal from 'sweetalert2';

import { getUsers } from '@/services/userApi';
import { getGroupTypes } from '@/services/groupTypeApi';
import { deleteUserGroup, updateUserGroup } from '@/services/userGroupApi';
import { useTranslations } from 'next-intl';

const EditGroupProfileCard = ({ userGroupData, onCancel }) => {
    const loggedInUser = useSelector(state => state.user.user);
    const router = useRouter();
    const t = useTranslations();

    const [isActive, setIsActive] = useState(userGroupData.is_active === true);
    const [userGroupTypes, setUserGroupTypes] = useState([]);
    const [userData, setUserData] = useState([]);

    const [usersLoading, setUsersLoading] = useState(false);
    const [usersError, setUsersError] = useState(null);

    const [groupTypesLoading, setGroupTypesLoading] = useState(false);
    const [groupTypesError, setGroupTypesError] = useState(null);

    const { register, handleSubmit, formState: { errors }, setValue, control } = useForm({
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
        handleGetGroupTypes()

        // Set default values after fetching users and types
        if (userGroupData) {
            setValue('groupLeader', userGroupData.group_leader_id);
            setValue('groupType', userGroupData.type);
            setValue('groupMembers', userGroupData.members);
        }
    }, []);

    // Get users
    const fetchUsers = async () => {
        setUsersLoading(true);
        setUsersError(null);

        try {
            const result = await getUsers();
            if (result.success) {
                setUserData(result.data);
            } else {
                setUsersError(result.error);
            }
        } catch (error) {
            setUsersError(error.message || 'An unexpected error occurred.');
        } finally {
            setUsersLoading(false);
        }
    };

    // Get user group types
    const handleGetGroupTypes = async () => {
        setGroupTypesLoading(true);
        setGroupTypesError(null);

        try {
            const response = await getGroupTypes();
            if (response.success) {
                setUserGroupTypes(response.data);
            } else {
                setGroupTypesError('Failed to fetch user group types');
            }
        } catch (error) {
            setGroupTypesError(error.message || 'An unexpected error occurred.');
        } finally {
            setGroupTypesLoading(false);
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
            type: data.groupType,
            members: data.groupMembers,
            updatedBy: loggedInUser.id
        };

        const result = await updateUserGroup(updatedData); // API isteği

        if (result.success) {
            toast('SUCCESS', result.message);
        } else {
            toast('ERROR', result.error);
        }
    };

    // Delete User Group
    const handleDeleteUserGroup = async (userGroupId) => {
        const confirmation = await Swal.fire({
            title: t('Are you sure?'),
            text: t('This user group will be permanently deleted and cannot be recovered'),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: t('Delete'),
            cancelButtonColor: '#3085d6',
            cancelButtonText: t('Cancel')
        });

        if (confirmation.isConfirmed) {
            const result = await deleteUserGroup(userGroupId); // API isteği

            if (result.success) {
                toast('SUCCESS', result.message);
                setTimeout(() => {
                    router.push('/group-management/user-groups/view-user-groups');
                }, 1000);
            } else {
                toast('ERROR', result.error);
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
        <>
            <Card className={styles.profileEditCard}>
                <Card.Body>
                    {/* Title */}
                    <Card.Title>{t("Edit User Group")}</Card.Title>
                    <Form onSubmit={handleSubmit(handleSave)}>
                        {/* Group Name */}
                        <Form.Group className="mb-3">
                            <Form.Label>{t("Group Name")}</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder={t("Enter group name")}
                                {...register("groupName", {
                                    required: t("Name is required"),
                                    minLength: { value: 2, message: t("Name must be at least 2 characters") },
                                })}
                                isInvalid={!!errors.groupName}
                            />
                            <Form.Control.Feedback type="invalid">{errors.groupName?.message}</Form.Control.Feedback>
                        </Form.Group>

                        {/* Group Description */}
                        <Form.Group className="mb-3">
                            <Form.Label>{t("Group Description")}</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder={t("Enter description")}
                                {...register("description", {
                                })}
                                isInvalid={!!errors.description}
                            />
                            <Form.Control.Feedback type="invalid">{errors.description?.message}</Form.Control.Feedback>
                        </Form.Group>

                        {/* Group Leader */}
                        <Form.Group className="mb-3" controlId="groupLeader">
                            <Form.Label>{t("Group Leader")}</Form.Label>
                            <Controller
                                control={control}
                                name="groupLeader"
                                rules={{ required: t("Group Leader is required") }}
                                render={({ field, fieldState }) => (
                                    <>
                                        {usersLoading ? (
                                            <div className="text-center">
                                                <Spinner animation="border" variant="primary" />
                                            </div>
                                        ) : usersError ? (
                                            <p className="text-danger">Error: {usersError}</p>
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
                                                options={userData.map(user => ({
                                                    value: user._id,
                                                    label: `${user.first_name} ${user.last_name}`
                                                }))}
                                                value={userData.find(user => user._id === field.value) ? {
                                                    value: field.value,
                                                    label: `${userData.find(user => user._id === field.value).first_name} ${userData.find(user => user._id === field.value).last_name}`
                                                } : null}
                                                onChange={(selectedOption) => field.onChange(selectedOption ? selectedOption.value : null)}
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

                        {/* Group Type */}
                        <Form.Group controlId="groupType">
                            <Form.Label>{t("Group Type")}</Form.Label>
                            <Controller
                                control={control}
                                name="groupType"
                                rules={{ required: "Group Type is required" }}
                                render={({ field, fieldState }) => (
                                    <>
                                        {groupTypesLoading ? (
                                            <div className="text-center">
                                                <Spinner animation="border" variant="primary" />
                                            </div>
                                        ) : groupTypesError ? (
                                            <p className="text-danger">Error: {groupTypesError}</p>
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
                                                options={userGroupTypes.map(groupType => ({
                                                    value: groupType._id,
                                                    label: groupType.type_name
                                                }))}
                                                value={userGroupTypes.find(groupType => groupType.type_name === field.value) ? {
                                                    value: field.value,
                                                    label: userGroupTypes.find(groupType => groupType.type_name === field.value).type_name
                                                } : null}
                                                onChange={(selectedOption) => field.onChange(selectedOption ? selectedOption.label : null)}
                                                placeholder={t("Select group type")}
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

                        {/* Group Members */}
                        <Form.Group className="mb-3" controlId="members">
                            <Form.Label>{t("Group Members")}</Form.Label>
                            <Controller
                                control={control}
                                name="groupMembers"
                                rules={{ required: t("At least one member is required") }}
                                render={({ field, fieldState }) => (
                                    <>
                                        {usersLoading ? (
                                            <div className="text-center">
                                                <Spinner animation="border" variant="primary" />
                                            </div>
                                        ) : usersError ? (
                                            <p className="text-danger">Error: {usersError}</p>
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
                                                options={userData.map(user => ({
                                                    value: user._id,
                                                    label: `${user.first_name} ${user.last_name}`
                                                }))}
                                                isMulti
                                                value={field.value.map(memberId => {
                                                    const member = userData.find(user => user._id === memberId);
                                                    return member ? { value: member._id, label: `${member.first_name} ${member.last_name}` } : null;
                                                }).filter(item => item !== null)}
                                                onChange={(selectedOptions) => field.onChange(selectedOptions.map(option => option.value))}
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

                        {/* Status */}
                        <Form.Group className="mb-3">
                            <Form.Label>{t("Group Status")}</Form.Label>
                            <Form.Check
                                type="switch"
                                id="isActive"
                                name="isActive"
                                checked={isActive}
                                onChange={(e) => setIsActive(e.target.checked)}
                                className={styles.formCheck}
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit">{t("Save")}</Button>
                        <Button variant="secondary" className="ms-2" onClick={onCancel}>{t("Back")}</Button>
                    </Form>

                    {/* Delete user group */}
                    {deleteUserGroupDisplayer(loggedInUser) ? (
                        <Row className="mt-3">
                            <Col md={12}>
                                <div onClick={handleDelete} className={styles.link}>
                                    <p className="text-danger">{t("Delete this user group")}</p>
                                </div>
                            </Col>
                        </Row>
                    ) : null}
                </Card.Body>
            </Card>
            <ToastContainer />
        </>
    )
}

export default EditGroupProfileCard;