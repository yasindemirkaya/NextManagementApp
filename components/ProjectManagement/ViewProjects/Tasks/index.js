import { useEffect, useState } from "react";
import { Card, Form, Button, Row, Col, Accordion } from "react-bootstrap";
import styles from './index.module.scss';

const dummyTasks = [
    { id: 1, title: "Fix login bug", description: "Resolve the issue causing login failure on Safari." },
    { id: 2, title: "Update UI for dashboard", description: "Redesign the dashboard for better UX." },
    { id: 3, title: "Implement dark mode", description: "Allow users to switch between light and dark themes." },
    { id: 4, title: "Refactor user service", description: "Simplify logic in the user authentication service." },
    { id: 5, title: "Write unit tests", description: "Cover all core modules with Jest unit tests." },
];

const Tasks = ({ project }) => {
    return (
        <>
            <Card className={styles.projectCard}>
                <Card.Body>
                    <Card.Title>Latest Created Task for {project.title}</Card.Title>

                    <Accordion alwaysOpen>
                        {dummyTasks.map((task, index) => (
                            <Accordion.Item eventKey={String(index)} key={task.id}>
                                <Accordion.Header>{task.title}</Accordion.Header>
                                <Accordion.Body>{task.description}</Accordion.Body>
                            </Accordion.Item>
                        ))}
                    </Accordion>

                    <div className="d-flex justify-content-end mt-3">
                        <Button variant="primary">View All</Button>
                    </div>
                </Card.Body>
            </Card>
        </>
    )
}

export default Tasks;