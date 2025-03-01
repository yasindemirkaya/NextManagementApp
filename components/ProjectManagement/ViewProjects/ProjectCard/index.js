import { useEffect, useState } from "react";
import { Card, Form, Button, Row, Col } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import styles from './index.module.scss';

import { getProjectTypes, updateProject } from '@/services/projectApi';

import toast from '@/utils/toastify';
import { ToastContainer } from 'react-toastify';

const ProjectCard = ({ project }) => {
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
                            control={control}
                            render={({ field }) => (
                                <Form.Control
                                    type="text"
                                    {...field}
                                    readOnly={!isEditable}
                                />
                            )}
                        />
                    </Form.Group>

                    {/* Project Description */}
                    <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Controller
                            name="description"
                            control={control}
                            render={({ field }) => (
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    {...field}
                                    readOnly={!isEditable}
                                    style={{ resize: 'none' }}
                                />
                            )}
                        />
                    </Form.Group>

                    {/* Project Type */}
                    <Form.Group controlId="projectType" className="mb-3">
                        <Form.Label>Project Type</Form.Label>
                        <Controller
                            control={control}
                            name="projectType"
                            render={({ field, fieldState }) => (
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
                            )}
                        />
                    </Form.Group>

                    {/* Project Start Date */}
                    <Form.Group className="mb-3">
                        <Form.Label>Start Date</Form.Label>
                        <Controller
                            name="start_date"
                            control={control}
                            render={({ field }) => (
                                <Form.Control
                                    {...field}
                                    type="date"
                                    onChange={(e) => setValue("start_date", e.target.value)}
                                    readOnly={!isEditable}
                                    value={getValues("start_date") || ""}
                                />
                            )}
                        />
                    </Form.Group>

                    {/* Project End Date */}
                    <Form.Group className="mb-3">
                        <Form.Label>End Date</Form.Label>
                        <Controller
                            name="end_date"
                            control={control}
                            render={({ field }) => (
                                <Form.Control
                                    {...field}
                                    type="date"
                                    onChange={(e) => setValue("end_date", e.target.value)}
                                    readOnly={!isEditable}
                                    value={getValues("end_date") || ""}
                                />
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
                                    <Button variant="danger" type="submit" onClick={handleSubmit(onSubmit)}>
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
