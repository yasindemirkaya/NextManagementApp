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

        // İlk 3 personal notification'ı alıyoruz
        try {
            const personalResult = await getNotifications({ type: 0, page: 1, limit: 3 }); // type: 0 - Personal
            if (personalResult.success) {
                setPersonalNotifications(personalResult.data);
            } else {
                setErrorPersonalNotifications(personalResult.error);
            }
        } catch (err) {
            setErrorPersonalNotifications("Failed to fetch personal notifications. Please try again later.");
        }

        // İlk 3 group notification'ı alıyoruz
        try {
            const groupResult = await getNotifications({ type: 1, page: 1, limit: 3 }); // type: 1 - Group
            if (groupResult.success) {
                setGroupNotifications(groupResult.data);
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
                            <div
                                className={`${styles.timelineItem} ${notification.is_seen ? styles.seen : styles.notSeen}`}
                                key={index}
                            >
                                <div className="d-flex justify-content-between mb-2">
                                    {/* Created At */}
                                    <div className={styles.timelineDate}>{notification.createdAt}</div>
                                </div>
                                <div className={`${styles.timelineContent} ${notification.is_seen ? 'seen' : 'not-seen'}`}>
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
                                            Type: <span className={getStyleForNotificationType(notification.type)}>{notification.type}</span>
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

                                    {/* Mark as Seen */}
                                    {
                                        route !== '/my-notifications' && (
                                            <div className={`mt-3 ${styles.markAsSeen}`}>
                                                {/* Eğer is_seen false ise "Mark as seen" butonu göster */}
                                                {!notification.is_seen && (
                                                    <em onClick={() => handleMarkAsSeen(notification)} className={styles.markAsSeenButton}>
                                                        Mark as seen
                                                    </em>
                                                )}

                                                {/* Eğer is_seen true ise sadece updatedAt tarihi göster */}
                                                {notification.is_seen && (
                                                    <em className={`${styles.seenAtDate} ms-2 text-muted`}>
                                                        (Seen at {notification.updatedAt})
                                                    </em>
                                                )}

                                                {/* Info Icon */}
                                                <OverlayTrigger
                                                    placement="right"
                                                    overlay={
                                                        <Tooltip>
                                                            Notifications marked as seen will be removed from your page.
                                                        </Tooltip>
                                                    }
                                                >
                                                    <FontAwesomeIcon icon={icons.faInfoCircle} className="ms-2 text-danger" />
                                                </OverlayTrigger>
                                            </div>
                                        )
                                    }
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
