import { Modal, Button, Form } from 'react-bootstrap';
import styles from './index.module.scss';
import { useTranslations } from 'next-intl';
import { useForm, Controller } from 'react-hook-form';
import { useEffect, useState } from 'react'; import { updateDemand } from '@/services/demandApi';
import toast from '@/utils/toastify';
import { ToastContainer } from 'react-toastify';
import { capitalizeFirstLetter } from '@/helpers/capitalizeFirstLetter';
import { getUsers } from "@/services/userApi";
import Select from 'react-select';

const UpdateDemandModal = ({ loggedInUser, fetchDemands, demandId, show, onHide }) => {
    const t = useTranslations();
    const { register, handleSubmit, control, setValue, formState: { errors } } = useForm({ mode: 'onBlur' });
    const [loading, setLoading] = useState(false);

    const [superAdminOptions, setSuperAdminOptions] = useState([]);
    const [loadingSuperAdmins, setLoadingSuperAdmins] = useState(false);

    useEffect(() => {
        // Eğer talep admin onayında bekliyorsa ilerletmesi için super admin listesi getirilir
        if (loggedInUser.role !== 2) {
            fetchSuperAdmins();
        }
    }, [])

    // Get super admins for recipient selection
    const fetchSuperAdmins = async () => {
        setLoadingSuperAdmins(true);
        const response = await getUsers({ role: 2 });
        if (response.success) {
            const options = response.data.map(user => ({
                value: user._id,
                label: `${user.first_name} ${user.last_name}`,
            }));
            setSuperAdminOptions(options);
        } else {
            console.error(response.error);
        }
        setLoadingSuperAdmins(false);
    };

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
            // Eğer super admin talebi onaylıyorsa o zaman targetUser göndermeye gerek yoktur. (Talep kapatılacağı için başka bir hedefe gidemez)
            const targetUser = loggedInUser.role === 2 ? undefined : data.targetUser?.value;

            const result = await updateDemand(demandId, status, adminResponse, targetUser);

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
                        {/* Admin Response */}
                        <Form.Group controlId="adminResponse" className="mb-3">
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
                        {/* Target Super Admin */}
                        {loggedInUser?.role !== 2 && (
                            <Form.Group controlId="targetUser">
                                <Form.Label>{t("Recipient")}</Form.Label>
                                <Controller
                                    control={control}
                                    name="targetUser"
                                    rules={{ required: t("Recipient is required") }}
                                    render={({ field, fieldState }) => (
                                        <>
                                            <Select
                                                {...field}
                                                options={superAdminOptions}
                                                isLoading={loadingSuperAdmins}
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
                                                placeholder={t("Select a recipient")}
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
                        )}
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