import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getNotificationById } from "@/services/notificationApi";
import { Spinner, Alert } from "react-bootstrap";

const NotificationItem = () => {
    const router = useRouter();
    const { notificationId } = router.query;
    const [notification, setNotification] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (notificationId) {
            fetchNotification();
        }
    }, [notificationId]);

    const fetchNotification = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await getNotificationById({ id: notificationId });
            if (result.success) {
                setNotification(result.data);
            } else {
                setError(result.error);
            }
        } catch (err) {
            setError("Failed to fetch notification. Please try again later.");
        }
        setLoading(false);
    };

    if (loading) {
        return (
            <div>
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    if (error || !notification) {
        return (
            <Alert variant="warning">Notification is not available. Please try again later.</Alert>
        )
    }

    return (
        <>Notification Item: {notification._id}</>
    )
}

export default NotificationItem;