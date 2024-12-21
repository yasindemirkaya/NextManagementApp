import { Card, Button, Form, Row, Col } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import styles from './index.module.scss';
import { deleteGroupType, updateGroupType } from '@/services/groupTypeApi';

const EditProfileCard = ({ groupTypeData, onCancel }) => {
    let deleteAccountText = "Delete this group type.";

    const router = useRouter();
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            typeName: groupTypeData.type_name,
        }
    });

    // Update group type
    const handleUpdateGroupType = async (data) => {
        try {
            const groupTypeId = groupTypeData.id;
            const newTypeName = data.typeName;

            const response = await updateGroupType(groupTypeId, newTypeName);

            if (response.code === 1) {
                Swal.fire({
                    title: response.message,
                    icon: 'success',
                });
            } else {
                Swal.fire({
                    title: response.message,
                    icon: 'error',
                });
            }
        } catch (error) {
            console.error('Error updating group type data:', error);
            Swal.fire({
                title: 'Group Type could not be updated.',
                icon: 'error',
                text: 'An error occurred. Please try again.',
            });
        }
    };

    // Delete group type
    const handleDeleteGroupType = async (groupTypeId) => {
        const confirmation = await Swal.fire({
            title: 'Are you sure?',
            text: 'This group type will be permanently deleted and cannot be recovered.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
        });

        if (confirmation.isConfirmed) {
            try {
                const response = await deleteGroupType(groupTypeId);

                if (response.code === 1) {
                    Swal.fire({
                        title: 'Account Deleted',
                        text: 'The user account has been deleted successfully.',
                        icon: 'success',
                    });
                    setTimeout(() => {
                        router.push('/group-type-management/view-group-types');
                    }, 1000);
                } else {
                    Swal.fire({
                        title: 'Error',
                        text: response.message || 'User account could not be deleted. Please try again.',
                        icon: 'error',
                    });
                }
            } catch (error) {
                console.error('Error deleting user by ID:', error);
                Swal.fire({
                    title: 'Error',
                    text: 'An error occurred while deleting the user. Please try again later.',
                    icon: 'error',
                });
            }
        }
    };

    const handleSave = async (data) => {
        handleUpdateGroupType(data)
    };

    const handleDeleteAccount = async () => {
        handleDeleteGroupType(groupTypeData.id)
    };

    return (
        <Card className={styles.profileEditCard}>
            <Card.Body>
                <Card.Title>Edit Group Type</Card.Title>
                <Form onSubmit={handleSubmit(handleSave)}>
                    {/* Name */}
                    <Form.Group className="mb-3 mt-3">
                        <Form.Label>Type Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter group type name"
                            {...register("typeName", {
                                required: "Name is required",
                                minLength: { value: 2, message: "Name must be at least 2 characters" },
                            })}
                            isInvalid={!!errors.typeName}
                        />
                        <Form.Control.Feedback type="invalid">{errors.typeName?.message}</Form.Control.Feedback>
                    </Form.Group>

                    <Button variant="primary" type="submit">Save</Button>
                    <Button variant="secondary" className="ms-2" onClick={onCancel}>Back</Button>
                </Form>

                <Row className="mt-3">
                    <Col md={12}>
                        <div onClick={handleDeleteAccount} className={styles.link}>
                            <p className="text-danger">{deleteAccountText}</p>
                        </div>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
};

export default EditProfileCard;
