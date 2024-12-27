import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Spinner, Alert, Container, Row, Col, Button, Badge } from "react-bootstrap";
import styles from './index.module.scss';
import { useSelector } from 'react-redux';
import { getNotifications, getMyNotifications } from "@/services/notificationApi";

const Notifications = () => {
    const router = useRouter();
    const [myNotifications, setMyNotifications] = useState([]);
    const [groupNotifications, setGroupNotifications] = useState([]);
    const [personalNotifications, setPersonalNotifications] = useState([]);

    const [loadingNotifications, setLoadingNotifications] = useState(true);
    const [errorNotifications, setErrorNotifications] = useState(null);

    const [loadingMyNotifications, setLoadingMyNotifications] = useState(true);
    const [errorMyNotifications, setErrorMyNotifications] = useState(null);

    const loggedInUser = useSelector(state => state.user.user);

    useEffect(() => {
        fetchNotifications();

        if (loggedInUser.role !== 0) {
            fetchMyNotifications();
        }
    }, []);

    // Get badge type
    const getStyleForType = (type) => {
        const baseClass = 'fw-bold';

        switch (type) {
            case 'Reminder':
                return `${baseClass} text-success`;
            case 'Warning':
                return `${baseClass} text-warning`;
            case 'Info':
                return `${baseClass} text-info`;
            case 'Feedback':
                return `${baseClass} text-success`;
            case 'Task Assignment':
                return `${baseClass} text-success`;
            case 'Critical':
                return `${baseClass} text-danger`;
            default:
                return baseClass;
        }
    };

    // Get notifications that user received
    const fetchNotifications = async () => {
        setLoadingNotifications(true);
        setErrorNotifications(null);

        try {
            const result = await getNotifications({ type: 2 });
            if (result.success) {
                const groupNotif = [];
                const personalNotif = [];

                // Notificationları kategorize et (personal, group)
                result.data.forEach(notification => {
                    if (notification.group) {
                        groupNotif.push(notification);
                    } else {
                        personalNotif.push(notification);
                    }
                });

                setGroupNotifications(groupNotif);
                setPersonalNotifications(personalNotif);
            } else {
                setErrorNotifications(result.error);
            }
        } catch (err) {
            setErrorNotifications("Failed to fetch notifications. Please try again later.");
        }
        setLoadingNotifications(false);
    };

    // Get notifications that user created
    const fetchMyNotifications = async () => {
        setLoadingMyNotifications(true);
        setErrorMyNotifications(null);

        try {
            const result = await getMyNotifications({ type: 2 });
            if (result.success) {
                setMyNotifications(result.data);
            } else {
                setErrorMyNotifications(result.error);
            }
        } catch (err) {
            setErrorMyNotifications("Failed to fetch your notifications. Please try again later.");
        }
        setLoadingMyNotifications(false);
    };

    // Render notifications or loading spinner
    const renderNotifications = (notifications, route) => {
        return (
            <>
                <div className="timeline">
                    <div className={styles.timeline}>
                        {notifications.map((notification, index) => (
                            <div className={styles.timelineItem} key={index}>
                                <div className="d-flex justify-content-between mb-2">
                                    {/* Created At */}
                                    <div className={styles.timelineDate}>{notification.createdAt}</div>
                                </div>
                                <div className={styles.timelineContent}>
                                    {/* Title */}
                                    <h5 className="mb-2">{notification.title}</h5>

                                    {/* Description */}
                                    <p className="mb-2">{notification.description}</p>

                                    {/* Date */}
                                    <p className="text-muted mb-2">{notification.date}</p>

                                    <hr />

                                    {/* Type & From */}
                                    <Row className="mb-2">
                                        <Col md={5}>
                                            Type: <span className={getStyleForType(notification.type)}>{notification.type}</span>
                                        </Col>
                                        {route !== '/my-notifications' && (
                                            <Col md={7}>
                                                From: <span className="text-danger fw-bold">{notification.created_by}</span>
                                            </Col>
                                        )}
                                    </Row>

                                    {/* Is Seen */}
                                    <div>
                                        Seen: <span className={notification.is_seen ? 'text-success' : 'text-danger' + ' fw-bold'}>{notification.is_seen ? 'Yes' : 'No'}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {notifications.length >= 3 && (
                    <div className="d-flex justify-content-center mb-3">
                        <Button variant="link" onClick={() => router.push(`/notifications${route}`)}>
                            View More
                        </Button>
                    </div>
                )}
            </>
        );
    };

    return (
        <Container>
            <Row>
                {/* My Notifications Column - Only visible if role is not 0 */}
                {loggedInUser?.role !== 0 && (
                    <Col md={4}>
                        <h4>My Notifications</h4>
                        {loadingMyNotifications ? (
                            <Spinner animation="border" />
                        ) : errorMyNotifications ? (
                            <Alert variant="danger">{errorMyNotifications}</Alert>
                        ) : (
                            renderNotifications(myNotifications, '/my-notifications')
                        )}
                    </Col>
                )}

                {/* Personal Notifications Column */}
                <Col md={loggedInUser?.role !== 0 ? 4 : 6}>
                    <h4>Personal Notifications</h4>
                    {loadingNotifications ? (
                        <Spinner animation="border" />
                    ) : errorNotifications ? (
                        <Alert variant="danger">{errorNotifications}</Alert>
                    ) : (
                        renderNotifications(personalNotifications, '/personal-notifications')
                    )}
                </Col>

                {/* Group Notifications Column */}
                <Col md={loggedInUser?.role !== 0 ? 4 : 6}>
                    <h4>Group Notifications</h4>
                    {loadingNotifications ? (
                        <Spinner animation="border" />
                    ) : errorNotifications ? (
                        <Alert variant="danger">{errorNotifications}</Alert>
                    ) : (
                        renderNotifications(groupNotifications, '/group-notifications')
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default Notifications;
