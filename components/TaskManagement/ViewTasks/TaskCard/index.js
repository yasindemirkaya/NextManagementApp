import { useEffect, useState } from "react";
import { Card, Form, Button, Row, Col } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import styles from './index.module.scss';

import { updateTask, deleteTask } from '@/services/taskApi';
import taskLabels from '@/static/data/tasks/taskLabels';
import taskPriorities from '@/static/data/tasks/taskPriorities';

import toast from '@/utils/toastify';
import { ToastContainer } from 'react-toastify';

import { useRouter } from "next/router";
import { useTranslations } from 'next-intl';
import { capitalizeFirstLetter } from "@/helpers/capitalizeFirstLetter";

const TaskCard = ({ task, fetchTaskDetails }) => {
    const t = useTranslations()
    const router = useRouter()

    const [isEditable, setIsEditable] = useState(false);
    const [initialTaskData, setInitialTaskData] = useState(task);

    const { control, handleSubmit, setValue, getValues } = useForm({
        defaultValues: {
            title: task.title,
            description: task.description,
            label: task.albel,
            deadline: task.deadline,
            priority: task.priority,
            status: task.status
        }
    });

    // Handle Edit
    const handleEdit = () => {
        setIsEditable(true);
    };

    // Handle Cancel
    const handleCancel = () => {
        setIsEditable(false);
        setValue("title", initialTaskData.title);
        setValue("description", initialTaskData.description);
        setValue("label", initialTaskData.label);
        setValue("deadline", initialTaskData.deadline);
        setValue("priority", initialTaskData.priority);
        setValue("label", initialTaskData.label)
    };

    // Handle Delete
    const handleDelete = async () => {
        const result = await deleteTask(task._id)

        if (result.success) {
            setIsEditable(false)
            toast('SUCCESS', result.message)

            setTimeout(() => {
                router.push('/task-management/view-tasks')
            }, 2000);
        } else {
            setIsEditable(false)
            toast('ERROR', result.error)
        }
    }

    // Update task
    const onSubmit = async (data) => {
        let payload = {
            taskId: task._id,
            title: data.title,
            description: data.description,
            type: data.taskLabel,
            deadline: data.deadline,
        }
        const result = await updateTask(payload)

        if (result.success) {
            toast('SUCCESS', result.message)
            fetchTaskDetails(task._id)
            setIsEditable(false)
        } else {
            toast('ERROR', result.error)
            setIsEditable(false)
        }
    };

    useEffect(() => {
        // Başlangıç verilerini ayarlıyoruz
        setInitialTaskData(task);

        // Set form values for title, description, label, priority, and deadline
        setValue("title", task.title);
        setValue("description", task.description);
        setValue("label", task.label);
        setValue("priority", task.priority);
        setValue("deadline", task.deadline);
    }, [task, setValue]);

    // Format task labels
    const taskLabelOptions = taskLabels.map(item => ({
        value: item.id,
        label: item.labelName
    }))

    // Format task priorities
    const taskPriorityOptions = taskPriorities.map(item => ({
        value: item.id,
        label: item.priorityName
    }))

    return (
        <>
            <Card className={styles.TaskCard}>
                <Card.Body>
                    <Card.Title>{t('Task Details')}</Card.Title>

                    {/* Task Title */}
                    <Form.Group className="mt-3 mb-3">
                        <Form.Label>{t('Title')}</Form.Label>
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

                    {/* Description */}
                    <Form.Group className="mb-3">
                        <Form.Label>{t('Description')}</Form.Label>
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

                    {/* Label */}
                    <Form.Group controlId="label" className="mb-3">
                        <Form.Label>{t('Label')}</Form.Label>
                        <Controller
                            control={control}
                            name="label"
                            rules={{ required: t("Label is required") }}
                            render={({ field, fieldState }) => (
                                <>
                                    <Select
                                        {...field}
                                        options={taskLabelOptions}
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
                                        placeholder={t('Select a Label')}
                                        onChange={selectedOption => setValue("label", selectedOption.value)}
                                        value={taskLabelOptions.find(option => option.value === getValues("label"))}
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

                    {/* Task Priority */}
                    <Form.Group controlId="priority" className="mb-3">
                        <Form.Label>{t('Priority')}</Form.Label>
                        <Controller
                            control={control}
                            name="priority"
                            rules={{ required: t("Priority is required") }}
                            render={({ field, fieldState }) => (
                                <>
                                    <Select
                                        {...field}
                                        options={taskPriorityOptions}
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
                                        placeholder={t('Select a Priority')}
                                        onChange={selectedOption => setValue("priority", selectedOption.value)}
                                        value={taskPriorityOptions.find(option => option.value === getValues("priority"))}
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

                    {/* Deadline */}
                    <Form.Group className="mb-3">
                        <Form.Label>{t('Deadline')}</Form.Label>
                        <Controller
                            name="deadline"
                            control={control}
                            rules={{ required: t("Deadline is required") }}
                            render={({ field, fieldState }) => (
                                <>
                                    <Form.Control
                                        {...field}
                                        type="date"
                                        onChange={(e) => setValue("deadline", e.target.value)}
                                        readOnly={!isEditable}
                                        value={getValues("deadline") || ""}
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
                        <em>*{t('This task is created by')} <b>{task.created_by?.name}</b></em>
                    </p>

                    {/* Updated By */}
                    {task.updated_by && (
                        <p className={styles.infoText}>
                            <em>*{t('The last update for this task is made by')} <b>{task.updated_by?.name}</b></em>
                        </p>
                    )}

                    {/* Buttons */}
                    <Row>
                        <Col>
                            {!isEditable ? (
                                <Button variant="primary" onClick={handleEdit}>
                                    {t('Edit')}
                                </Button>
                            ) : (
                                <>
                                    <Button variant="secondary" onClick={handleCancel} className="me-2">
                                        {t('Cancel')}
                                    </Button>
                                    <Button variant="success" type="submit" onClick={handleSubmit(onSubmit)} className="me-2">
                                        {t('Save')}
                                    </Button>
                                    <Button variant="danger" type="submit" onClick={handleDelete}>
                                        {t('Delete')}
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

export default TaskCard;
