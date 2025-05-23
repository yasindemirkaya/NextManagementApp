import { useEffect, useState } from 'react';
import { getProjects, updateProject } from '@/services/projectApi';
import projectStatuses from '@/static/data/projects/projectStatuses';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Container, Row, Col, Card } from 'react-bootstrap';
import styles from './index.module.scss';

import toast from '@/utils/toastify';
import { ToastContainer } from 'react-toastify';
import { useRouter } from 'next/router';

const ViewTasks = () => {
    const router = useRouter();

    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Format statuses
    const filteredStatuses = projectStatuses.filter(status =>
        ['To Do', 'In Progress', 'Testing', 'Review', 'Done', 'Cancelled'].includes(status.typeName)
    );

    useEffect(() => {
        fetchProjects();
    }, []);

    // Handle Drag End
    const handleDragEnd = async (result) => {
        const { source, destination, draggableId } = result;

        // Eğer bir yerden bir yere taşınma işlemi gerçekleşmediyse (örneğin kullanıcı bırakmadıysa)
        if (!destination) {
            return;
        }

        // Eğer yeni konum, eski konumla aynıysa (yani statü değişmedi)
        if (source.droppableId === destination.droppableId) {
            return;
        }

        // Projeyi buluyoruz
        const draggedProject = projects.find(project => project._id === draggableId);

        // Yeni statüyü alıyoruz
        const newStatus = destination.droppableId;

        // updateProject fonksiyonuna sadece id ve yeni status bilgisini gönderiyoruz
        const response = await updateProject({
            projectId: draggedProject._id,
            status: newStatus
        });

        if (response.success) {
            // Güncelleme başarılı ise projeyi yeni statüsüne göre güncelliyoruz
            toast('SUCCESS', response.message)
            setProjects(prevProjects =>
                prevProjects.map(project =>
                    project._id === draggableId ? { ...project, status: newStatus } : project
                )
            );
        } else {
            toast('ERROR', response.error)
            setError(response.error);
        }
    };

    // Fetch projects
    const fetchProjects = async () => {
        const result = await getProjects();

        if (result.success) {
            setProjects(result.data);
        } else {
            setError(result.error);
        }
        setLoading(false);
    };

    // Add placeholder style when item is being dragged
    const getMovingCardStyle = (provided, isDragging) => ({
        ...provided.draggableProps.style,
        backgroundColor: isDragging ? '#D3D3D3' : '#FFFFFF',
        border: isDragging ? '2px solid #18BC9C' : '1px solid #DDD',
        borderRadius: '8px',
        boxShadow: isDragging ? '0px 4px 6px rgba(0, 0, 0, 0.1)' : 'none',
    });

    return (
        <>
            <DragDropContext onDragEnd={handleDragEnd}>
                <Container fluid>
                    <Row className="d-flex justify-content-between g-3">
                        {/* Statuses */}
                        {filteredStatuses.map((status) => {
                            const projectItems = projects.filter((project) => project.status === status.typeName);

                            return (
                                <Col key={status.id} xs={12} sm={6} md={4} lg={2}>
                                    {/* Status Title */}
                                    <h5 className="text-center mb-3">{status.typeName}</h5>

                                    <Droppable
                                        droppableId={status.typeName}
                                        direction="vertical"
                                        mode="virtual"
                                        renderClone={(provided, snapshot, rubric) => {
                                            return (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    style={getMovingCardStyle(provided, snapshot.isDragging)}
                                                >
                                                    <div>{rubric.item}</div>
                                                </div>
                                            );
                                        }}
                                    >
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.droppableProps}
                                                className={styles.droppableContainer}
                                            >
                                                {/* Project Items */}
                                                {projectItems.map((project, index) => (
                                                    <Draggable key={project._id} draggableId={project._id} index={index}>
                                                        {(provided) => (
                                                            <Card
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                className={styles.projectCard}
                                                                onClick={() => router.push(`/task-management/view-tasks/${project._id}`)}
                                                                style={{ cursor: 'pointer' }}
                                                            >
                                                                <Card.Body>
                                                                    <Card.Title>{project.title}</Card.Title>
                                                                    <Card.Text>{project.description}</Card.Text>
                                                                </Card.Body>
                                                            </Card>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                </Col>
                            );
                        })}
                    </Row>
                </Container>
            </DragDropContext>

            <ToastContainer />
        </>
    );
};

export async function getStaticProps(context) {
    const headerMessages = await import(`../../../public/locales/common/${context.locale}.json`);
    const formMessages = await import(`../../../public/locales/form/${context.locale}.json`);
    const responseMessages = await import(`../../../public/locales/response/${context.locale}.json`);
    const validationMessages = await import(`../../../public/locales/validation/${context.locale}.json`);

    return {
        props: {
            messages: {
                ...headerMessages.default,
                ...formMessages.default,
                ...responseMessages.default,
                ...validationMessages.default,
            },
        },
    };
}

export default ViewTasks;
