import { Modal, Button, Form } from 'react-bootstrap';
import styles from './index.module.scss';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { useState } from 'react'; import { updateDemand } from '@/services/demandApi';
import toast from '@/utils/toastify';
import { ToastContainer } from 'react-toastify';
import { capitalizeFirstLetter } from '@/helpers/capitalizeFirstLetter';

const UpdateDemandModal = ({ loggedInUser, fetchDemands, demandId, show, onHide }) => {
    const t = useTranslations();
    const { register, handleSubmit, setValue, formState: { errors } } = useForm({ mode: 'onBlur' });
    const [loading, setLoading] = useState(false);

    // Handle accept
    const handleAccept = () => {
        // İşlemi yapan user super admin ise direkt olarak kabul edilir
        setValue("status", loggedInUser.role == 2 ? "2" : "1");
        handleSubmit(onSubmit)();
    };

    // Handle reject
    const handleReject = () => {
        setValue("status", "3");
        handleSubmit(onSubmit)();
    };

    // Update demand
    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const { adminResponse, status } = data;

            const result = await updateDemand(demandId, status, adminResponse);

            if (result.success) {
                toast('SUCCESS', result.message)
                fetchDemands()
                onHide();
            } else {
                toast('ERROR', result.error);
            }
        } catch (error) {
            toast('ERROR', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Modal show={show} onHide={onHide}>
                <Modal.Header closeButton>
                    <Modal.Title>{t("Update Demand")}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Form.Group controlId="adminResponse">
                            <Form.Label>{t("Admin Response")}</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={4}
                                placeholder={t("Enter a response for the demand")}
                                style={{ resize: 'none' }}
                                {...register("adminResponse", {
                                    required: true,
                                    onBlur: (e) => {
                                        const formattedValue = capitalizeFirstLetter(e.target.value);
                                        setValue("adminResponse", formattedValue);
                                    },
                                })}
                            />
                            {errors.adminResponse && <p className="text-danger">{t("Admin Response is required")}</p>}
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="success"
                        onClick={handleAccept}
                        disabled={loading}
                    >
                        {t("Accept")}
                    </Button>
                    <Button
                        variant="danger"
                        onClick={handleReject}
                        disabled={loading}
                    >
                        {t("Reject")}
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={onHide}
                    >
                        {t("Close")}
                    </Button>
                </Modal.Footer>
            </Modal>
            <ToastContainer />
        </>
    );
};

export default UpdateDemandModal;