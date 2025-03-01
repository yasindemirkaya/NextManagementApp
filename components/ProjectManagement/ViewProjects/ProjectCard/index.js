import { useEffect, useState } from "react";
import { Card, Form, Button, Row, Col } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import styles from './index.module.scss';

import { getProjectTypes, updateProject, deleteProject } from '@/services/projectApi';

import toast from '@/utils/toastify';
import { ToastContainer } from 'react-toastify';

import { useRouter } from "next/router";
import { useTranslations } from "use-intl";
import { capitalizeFirstLetter } from "@/helpers/capitalizeFirstLetter";

const ProjectCard = ({ project }) => {
    const t = useTranslations()
    const router = useRouter()

    const [isEditable, setIsEditable] = useState(false);
    const [projectTypes, setProjectTypes] = useState([]);
    const [initialProjectData, setInitialProjectData] = useState(project);

    const { control, handleSubmit, setValue, getValues } = useForm({
        defaultValues: {
            title: project.title,
            description: project.description,
            projectType: project.type,
            start_date: project.start_date,
            end_date: project.end_date,
        }
    });

    // Get Project Types
    const fetchProjectTypes = async () => {
        const response = await getProjectTypes();
        if (response.success) {
            const typeOptions = response.data.map(item => ({
                value: item.type_name,
                label: item.type_name
            }));
            setProjectTypes(typeOptions);
        }
    };

    // Handle Edit
    const handleEdit = () => {
        setIsEditable(true);
    };

    // Handle Cancel
    const handleCancel = () => {
        setIsEditable(false);
        setValue("title", initialProjectData.title);
        setValue("description", initialProjectData.description);
        setValue("projectType", initialProjectData.type);
        setValue("start_date", initialProjectData.start_date);
        setValue("end_date", initialProjectData.end_date);
    };

    // Handle Delete
    const handleDelete = async () => {
        const result = await deleteProject(project._id)

        if (result.success) {
            setIsEditable(false)
            toast('SUCCESS', result.message)

            setTimeout(() => {
                router.push('/project-management/view-projects')
            }, 2000);
        } else {
            setIsEditable(false)
            toast('ERROR', result.error)
        }
    }

    // Update project
    const onSubmit = async (data) => {
        let payload = {
            projectId: project._id,
            title: data.title,
            description: data.description,
            type: data.projectType,
            start_date: data.start_date,
            end_date: data.end_date
        }
        const result = await updateProject(payload)

        if (result.success) {
            toast('SUCCESS', result.message)
            setIsEditable(false)
        } else {
            toast('ERROR', result.error)
            setIsEditable(false)
        }
    };

    useEffect(() => {
        fetchProjectTypes();

        // Başlangıç verilerini ayarlıyoruz
        setInitialProjectData(project);
        setValue("title", project.title);
        setValue("description", project.description);
        setValue("projectType", project.type);
        setValue("start_date", project.start_date);
        setValue("end_date", project.end_date);
    }, [project, setValue]);

    return (
        <>
            <Card className={styles.projectCard}>
                <Card.Body>
                    <Card.Title>Project Details</Card.Title>

                    {/* Project Title */}
                    <Form.Group className="mt-3 mb-3">
                        <Form.Label>Project Title</Form.Label>
                        <Controller
                            name="title"
                            placeholder={t("Enter a title")}
                            control={control}
                            rules={{
                                required: t("Title is required"),
                                minLength: { value: 2, message: t("Title must be at least 2 characters") }
                            }}
                            render={({ field, fieldState }) => (
                                <>
                                    <Form.Control
                                        type="text"
                                        {...field}
                                        readOnly={!isEditable}
                                        isInvalid={fieldState.invalid}
                                    />
                                    {fieldState.invalid && (
                                        <Form.Control.Feedback type="invalid">
                                            {fieldState.error?.message}
                                        </Form.Control.Feedback>
                                    )}
                                </>
                            )}
                        />
                    </Form.Group>

                    {/* Project Description */}
                    <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Controller
                            name="description"
                            control={control}
                            rules={{
                                required: t("Description is required"),
                                maxLength: { value: 255, message: t("Description cannot be longer than 255 characters") },
                                minLength: { value: 10, message: t("Description cannot be shorter than 10 characters") },
                                onBlur: (e) => {
                                    const formattedValue = capitalizeFirstLetter(e.target.value);
                                    setValue("description", formattedValue);
                                },
                            }}
                            render={({ field, fieldState }) => (
                                <>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        {...field}
                                        readOnly={!isEditable}
                                        style={{ resize: 'none' }}
                                        isInvalid={fieldState.invalid}
                                    />
                                    {fieldState.invalid && (
                                        <Form.Control.Feedback type="invalid">
                                            {fieldState.error?.message}
                                        </Form.Control.Feedback>
                                    )}
                                </>
                            )}
                        />
                    </Form.Group>

                    {/* Project Type */}
                    <Form.Group controlId="projectType" className="mb-3">
                        <Form.Label>Project Type</Form.Label>
                        <Controller
                            control={control}
                            name="projectType"
                            rules={{ required: t("Project Type is required") }}
                            render={({ field, fieldState }) => (
                                <>
                                    <Select
                                        {...field}
                                        options={projectTypes}
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
                                        placeholder="Select a Project Type"
                                        onChange={selectedOption => setValue("projectType", selectedOption.value)}
                                        value={projectTypes.find(option => option.value === getValues("projectType"))}
                                    />
                                    {fieldState.invalid && (
                                        <Form.Control.Feedback type="invalid">
                                            {fieldState.error?.message}
                                        </Form.Control.Feedback>
                                    )}
                                </>
                            )}
                        />
                    </Form.Group>

                    {/* Project Start Date */}
                    <Form.Group className="mb-3">
                        <Form.Label>Start Date</Form.Label>
                        <Controller
                            name="start_date"
                            control={control}
                            rules={{ required: t("Start date is required") }}
                            render={({ field, fieldState }) => (
                                <>
                                    <Form.Control
                                        {...field}
                                        type="date"
                                        onChange={(e) => setValue("start_date", e.target.value)}
                                        readOnly={!isEditable}
                                        value={getValues("start_date") || ""}
                                    />
                                    {fieldState.invalid && (
                                        <Form.Control.Feedback type="invalid">
                                            {fieldState.error?.message}
                                        </Form.Control.Feedback>
                                    )}
                                </>
                            )}
                        />
                    </Form.Group>


                    {/* Project End Date */}
                    <Form.Group className="mb-3">
                        <Form.Label>End Date</Form.Label>
                        <Controller
                            name="end_date"
                            control={control}
                            rules={{ required: t("End date is required") }}
                            render={({ field, fieldState }) => (
                                <>
                                    <Form.Control
                                        {...field}
                                        type="date"
                                        onChange={(e) => setValue("end_date", e.target.value)}
                                        readOnly={!isEditable}
                                        value={getValues("end_date") || ""}
                                    />
                                    {fieldState.invalid && (
                                        <Form.Control.Feedback type="invalid">
                                            {fieldState.error?.message}
                                        </Form.Control.Feedback>
                                    )}
                                </>
                            )}
                        />
                    </Form.Group>


                    {/* Created By */}
                    <p className={styles.infoText}>
                        <em>*This project is created by <b>{project.created_by?.name}</b></em>
                    </p>

                    {/* Updated By */}
                    <p className={styles.infoText}>
                        <em>*The last update for this project is made by <b>{project.updated_by?.name}</b></em>
                    </p>

                    {/* Buttons */}
                    <Row>
                        <Col>
                            {!isEditable ? (
                                <Button variant="primary" onClick={handleEdit}>
                                    Edit
                                </Button>
                            ) : (
                                <>
                                    <Button variant="secondary" onClick={handleCancel} className="me-2">
                                        Cancel
                                    </Button>
                                    <Button variant="success" type="submit" onClick={handleSubmit(onSubmit)} className="me-2">
                                        Save
                                    </Button>
                                    <Button variant="danger" type="submit" onClick={handleDelete}>
                                        Delete
                                    </Button>
                                </>
                            )}
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
            <ToastContainer />
        </>
    );
};

export default ProjectCard;
