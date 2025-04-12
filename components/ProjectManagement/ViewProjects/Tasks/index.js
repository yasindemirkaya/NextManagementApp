import { useEffect, useState } from "react";
import { Card, Button, Accordion, Spinner } from "react-bootstrap";
import styles from './index.module.scss';
import { getTasks } from "@/services/taskApi";
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/router';

const Tasks = ({ project }) => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    const router = useRouter();
    const t = useTranslations();

    // Handle view all
    const handleViewAllClick = () => {
        router.push(`/task-management/view-tasks/${project._id}`);
    };

    // Fetch tasks
    const fetchTasks = async () => {
        setLoading(true);
        const result = await getTasks({ project_id: project._id, limit: 5 });
        if (result.success) {
            setTasks(result.data);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (project?._id) {
            fetchTasks();
        }
    }, [project]);

    return (
        <>
            <Card className={styles.projectCard}>
                <Card.Body>
                    <Card.Title>{t('Recently Created Tasks')}</Card.Title>

                    {loading ? (
                        <div className="text-center py-4">
                            <Spinner animation="border" />
                        </div>
                    ) : (
                        <Accordion alwaysOpen>
                            {tasks.map((task, index) => (
                                <Accordion.Item eventKey={String(index)} key={task.id}>
                                    <Accordion.Header>{task.title}</Accordion.Header>
                                    <Accordion.Body>{task.description}</Accordion.Body>
                                </Accordion.Item>
                            ))}
                        </Accordion>
                    )}

                    <div className="d-flex justify-content-end mt-3">
                        <Button variant="primary" onClick={handleViewAllClick}>{t('View All')}</Button>
                    </div>
                </Card.Body>
            </Card>
        </>
    )
}

export async function getStaticProps(context) {
    const commonMessages = await import(`../../../../public/locales/common/${context.locale}.json`);

    return {
        props: {
            messages: {
                ...commonMessages.default,
            },
        },
    };
}

export default Tasks;