import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Spinner, Alert, Container, Row, Col } from "react-bootstrap";
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

    console.log('My:', myNotifications)
    console.log('Personal: ', personalNotifications)
    console.log('Group: ', groupNotifications)

    useEffect(() => {
        fetchNotifications();

        if (loggedInUser.role !== 0) {
            fetchMyNotifications();
        }
    }, []);

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
    const renderNotifications = (notifications) => {
        return notifications.map((notification, index) => (
            <Alert variant="info" key={index} className={styles.notification}>
                <p>{notification.title}</p>
                <p>{notification.date}</p>
                <p>{notification.description}</p>
            </Alert>
        ));
    };

    return (
        <Container>
            <Row>
                {/* My Notifications Column - Only visible if role is not 0 */}
                {loggedInUser.role !== 0 && (
                    <Col md={4}>
                        <h3>My Notifications</h3>
                        {loadingMyNotifications ? (
                            <Spinner animation="border" />
                        ) : errorMyNotifications ? (
                            <Alert variant="danger">{errorMyNotifications}</Alert>
                        ) : (
                            renderNotifications(myNotifications)
                        )}
                    </Col>
                )}

                {/* Personal Notifications Column */}
                <Col md={loggedInUser.role !== 0 ? 4 : 6}>
                    <h3>Personal Notifications</h3>
                    {loadingNotifications ? (
                        <Spinner animation="border" />
                    ) : errorNotifications ? (
                        <Alert variant="danger">{errorNotifications}</Alert>
                    ) : (
                        renderNotifications(personalNotifications)
                    )}
                </Col>

                {/* Group Notifications Column */}
                <Col md={loggedInUser.role !== 0 ? 4 : 6}>
                    <h3>Group Notifications</h3>
                    {loadingNotifications ? (
                        <Spinner animation="border" />
                    ) : errorNotifications ? (
                        <Alert variant="danger">{errorNotifications}</Alert>
                    ) : (
                        renderNotifications(groupNotifications)
                    )}
                </Col>
            </Row>
        </Container>
    )
}

export default Notifications;