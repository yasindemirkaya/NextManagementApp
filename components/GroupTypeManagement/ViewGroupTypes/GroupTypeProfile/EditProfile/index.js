import { Card, Button, Form, Row, Col } from 'react-bootstrap';
import Swal from 'sweetalert2';
import toast from '@/utils/toastify';
import { ToastContainer } from 'react-toastify';
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
                toast('SUCCESS', response.message)
            } else {
                toast('ERROR', response.message)
            }
        } catch (error) {
            toast('ERROR', 'Group Type could not be updated.')
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
                    toast('SUCCESS', 'The user account has been deleted successfully.')
                    setTimeout(() => {
                        router.push('/group-type-management/view-group-types');
                    }, 1000);
                } else {
                    toast('ERROR', response.message || 'User account could not be deleted. Please try again.')
                }
            } catch (error) {
                toast('ERROR', 'An error occurred while deleting the user. Please try again later.')
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
        <>
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
            <ToastContainer />
        </>
    );
};

export default EditProfileCard;
