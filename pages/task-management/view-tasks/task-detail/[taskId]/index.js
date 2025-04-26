import { getTaskById } from "@/services/taskApi";

import { useRouter } from "next/router";
import { useTranslations } from "next-intl";

import { useEffect, useState } from "react";
import { Container, Row, Col, Alert } from "react-bootstrap";

import toast from '@/utils/toastify';
import { ToastContainer } from 'react-toastify';

import TaskCard from "@/components/TaskManagement/ViewTasks/TaskCard";
import UserAndGroupManagement from "@/components/TaskManagement/ViewTasks/UserAndGroupManagement";

const TaskDetailPage = () => {
    const router = useRouter();
    const t = useTranslations();

    const { taskId } = router.query;

    const [task, setTask] = useState({})
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    // Get Task by ID
    const fetchTaskDetails = async (taskId) => {
        const result = await getTaskById(taskId)

        if (result.success) {
            setLoading(false)
            setTask(result.data)
        } else {
            setLoading(false)
            setError(result.error)
            toast('ERROR', result.error)
        }
    }

    useEffect(() => {
        fetchTaskDetails(taskId)
    }, [])

    // Error
    if (error) {
        return <Alert variant="danger">{t('An error occurred when fetching the requested project Please try again')}</Alert>;
    }

    return (
        <>
            <Container>
                <Row>
                    {/* Left Column - Task Card */}
                    <Col md={6} className="mb-4">
                        <TaskCard task={task} fetchTaskDetails={fetchTaskDetails} />
                    </Col>

                    {/* Middle Column - User and Group Management */}
                    <Col md={6} className="mb-4">
                        <UserAndGroupManagement task={task} fetchTaskDetails={fetchTaskDetails} />
                    </Col>
                    <ToastContainer />
                </Row>
            </Container>
            <ToastContainer />
        </>
    )
}

export async function getStaticPaths() {
    return {
        paths: [], // Başlangıçta hiçbir sayfa oluşturulmayacak
        fallback: 'blocking', // İlk ziyaret sırasında sayfa oluşturulacak
    };
}

export async function getStaticProps(context) {
    const formMessages = await import(`../../../../../public/locales/form/${context.locale}.json`);
    const commonMessages = await import(`../../../../../public/locales/common/${context.locale}.json`);
    const validationMessages = await import(`../../../../../public/locales/validation/${context.locale}.json`);

    return {
        props: {
            messages: {
                ...formMessages.default,
                ...commonMessages.default,
                ...validationMessages.default,
            },
        },
    };
}

export default TaskDetailPage;