import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Spinner, Alert, Container, Row, Col, Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import styles from './index.module.scss';
import { useSelector } from 'react-redux';
import { getNotifications, getMyNotifications, updateNotification } from "@/services/notificationApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icons } from "@/static/icons";
import toast from '@/utils/toastify';
import { ToastContainer } from 'react-toastify';
import { getStyleForNotificationType } from "@/helpers/getStyleForNotificationType";

const Notifications = () => {
    const router = useRouter();
    const [myNotifications, setMyNotifications] = useState([]);
    const [groupNotifications, setGroupNotifications] = useState([]);
    const [personalNotifications, setPersonalNotifications] = useState([]);

    const [loadingPersonalNotifications, setLoadingPersonalNotifications] = useState(true);
    const [errorPersonalNotifications, setErrorPersonalNotifications] = useState(null);

    const [loadingGroupNotifications, setLoadingGroupNotifications] = useState(true);
    const [errorGroupNotifications, setErrorGroupNotifications] = useState(null);

    const [loadingMyNotifications, setLoadingMyNotifications] = useState(true);
    const [errorMyNotifications, setErrorMyNotifications] = useState(null);

    const loggedInUser = useSelector(state => state.user.user);

    useEffect(() => {
        fetchNotifications();

        if (loggedInUser.role !== 0) {
            fetchMyNotifications();
        }
    }, []);

    // Get notifications that user received
    const fetchNotifications = async () => {
        setLoadingPersonalNotifications(true);
        setErrorPersonalNotifications(null);

        setLoadingGroupNotifications(true);
        setErrorGroupNotifications(null);

        try {
            const personalResult = await getNotifications({ type: 0, page: 1, limit: 3 }); // type: 0 - Personal
            if (personalResult.success) {
                const sortedPersonal = personalResult.data.sort((a, b) => Number(a.is_seen) - Number(b.is_seen));
                setPersonalNotifications(sortedPersonal);
            } else {
                setErrorPersonalNotifications(personalResult.error);
            }
        } catch (err) {
            setErrorPersonalNotifications("Failed to fetch personal notifications. Please try again later.");
        }

        try {
            const groupResult = await getNotifications({ type: 1, page: 1, limit: 3 }); // type: 1 - Group
            if (groupResult.success) {
                const sortedGroup = groupResult.data.sort((a, b) => Number(a.is_seen) - Number(b.is_seen));
                setGroupNotifications(sortedGroup);
            } else {
                setErrorGroupNotifications(groupResult.error);
            }
        } catch (err) {
            setErrorGroupNotifications("Failed to fetch group notifications. Please try again later.");
        }

        setLoadingPersonalNotifications(false);
        setLoadingGroupNotifications(false);
    };

    // Get notifications that user created
    const fetchMyNotifications = async () => {
        setLoadingMyNotifications(true);
        setErrorMyNotifications(null);

        try {
            const result = await getMyNotifications({ type: 2, page: 1, limit: 3 });
            if (result.success) {
                const sortedMyNotifications = result.data.sort((a, b) => Number(a.is_seen) - Number(b.is_seen));
                setMyNotifications(sortedMyNotifications);
            } else {
                setErrorMyNotifications(result.error);
            }
        } catch (err) {
            setErrorMyNotifications("Failed to fetch your notifications. Please try again later.");
        }

        setLoadingMyNotifications(false);
    };

    // Handle mark as seen
    const handleMarkAsSeen = async (notification) => {
        const type = notification.group ? 1 : 0;

        const result = await updateNotification({
            notificationId: notification._id,
            type,
        });

        if (result.success) {
            toast('SUCCESS', result.message);
            fetchNotifications();
        } else {
            toast('ERROR', result.error);
        }
    };

    // Render notifications or loading spinner
    const renderNotifications = (notifications, route) => {
        return (
            <>
                <div className="timeline">
                    <div className={styles.timeline}>
                        {notifications.map((notification, index) => (
                            <div
                                className={`${styles.timelineItem} ${notification.is_seen ? styles.seen : styles.notSeen}`}
                                key={index}
                            >
                                <div className={`${styles.timelineContent} ${notification.is_seen ? 'seen' : 'not-seen'}`}>
                                    <Row>
                                        {/* Created At */}
                                        <div className={styles.timelineDate}>{notification.createdAt}</div>
                                        {/* Title */}
                                        <h5 className="mb-2">{notification.title}</h5>
                                        {/* Description */}
                                        <p className="mb-2">{notification.description}</p>
                                        {/* Date */}
                                        <p className="text-muted mb-2">{notification.date}</p>
                                    </Row>

                                    <hr />

                                    {/* Type & From */}
                                    <Row className="mb-2">
                                        <Col md={5}>
                                            Type: <span className={getStyleForNotificationType(notification.type)}>{notification.type}</span>
                                        </Col>
                                        {route !== '/my-notifications' && (
                                            <Col md={7}>
                                                From: <span className="text-danger fw-bold">{notification.created_by}</span>
                                            </Col>
                                        )}
                                    </Row>

                                    {/* Seen & Group Name or User */}
                                    <Row className="mb-2">
                                        <Col md={5}>
                                            Seen: <span className={notification.is_seen ? 'text-success' : 'text-danger' + ' fw-bold'}>{notification.is_seen ? 'Yes' : 'No'}</span>
                                        </Col>
                                        {route === '/my-notifications' && notification.group ? (
                                            <Col md={7}>
                                                Group Name: <span className="text-danger fw-bold">{notification.group}</span>
                                            </Col>
                                        ) : route === '/my-notifications' && !notification.group ? (
                                            <Col md={7}>
                                                User: <span className="text-danger fw-bold">{notification.user}</span>
                                            </Col>
                                        ) : null}
                                    </Row>

                                    {/* Seen at*/}
                                    {notification.is_seen && (
                                        <Row>
                                            <Col md={12}>
                                                <div className="mb-2">
                                                    <em className={`${styles.seenAtDate} text-muted`}>
                                                        (Seen at {notification.updatedAt})
                                                    </em>
                                                </div>
                                            </Col>
                                        </Row>
                                    )}

                                    {/* Mark As Seen & Delete Notification */}
                                    <Row>
                                        {route !== '/my-notifications' && (
                                            <Col md={12}>
                                                <div className={`mt-3 mb-2 ${styles.markAsSeen}`}>
                                                    {!notification.is_seen && (
                                                        <div className="d-inline-flex align-items-center">
                                                            <div onClick={() => handleMarkAsSeen(notification)} className={styles.markAsSeenButton}>
                                                                <FontAwesomeIcon icon={icons.faEye} className="me-2 text-info" />
                                                                <em className={`text-info ${styles.markAsSeenButton}`}>
                                                                    Mark as seen
                                                                </em>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </Col>
                                        )}
                                        {loggedInUser.role !== 0 && (
                                            <Col md={12}>
                                                <div className={styles.markAsSeen}>
                                                    <div className="d-inline-flex align-items-center">
                                                        <div onClick={() => handleDeleteNotification(notification)}>
                                                            <FontAwesomeIcon icon={icons.faTrash} className="me-2 text-danger" />
                                                            <em className={`text-danger ${styles.markAsSeenButton}`}>
                                                                Delete Notification
                                                            </em>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Col>
                                        )}
                                    </Row>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {/* View More */}
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
        <>
            <Container>
                <Row>
                    {(() => {
                        const columns = [
                            loggedInUser?.role !== 0 && myNotifications.length > 0 && {
                                key: "my-notifications",
                                title: "My Notifications",
                                loading: loadingMyNotifications,
                                error: errorMyNotifications,
                                notifications: myNotifications,
                                route: "/my-notifications",
                            },
                            personalNotifications.length > 0 && {
                                key: "personal-notifications",
                                title: "Personal Notifications",
                                loading: loadingPersonalNotifications,
                                error: errorPersonalNotifications,
                                notifications: personalNotifications,
                                route: "/personal-notifications",
                            },
                            groupNotifications.length > 0 && {
                                key: "group-notifications",
                                title: "Group Notifications",
                                loading: loadingGroupNotifications,
                                error: errorGroupNotifications,
                                notifications: groupNotifications,
                                route: "/group-notifications",
                            },
                        ].filter(Boolean);

                        // Üç bildirim tipi de ekranda varsa hepsi md: 4 olur
                        // İki bildirim tipi varsa md: 6 olur
                        // Tek tip bildirim varsa md: 12 olur
                        const colSize = columns.length === 3 ? 4 : columns.length === 2 ? 6 : 6;

                        return columns.map((col) => (
                            <Col key={col.key} md={colSize}>
                                <h4>{col.title}</h4>
                                {col.loading ? (
                                    <Spinner animation="border" />
                                ) : col.error ? (
                                    <Alert variant="danger">{col.error}</Alert>
                                ) : (
                                    renderNotifications(col.notifications, col.route)
                                )}
                            </Col>
                        ));
                    })()}
                </Row>
            </Container>
            <ToastContainer />
        </>
    );

};

export default Notifications;
