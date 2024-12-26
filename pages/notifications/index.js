import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getNotifications } from "@/services/notificationApi";
import { Spinner, Alert } from "react-bootstrap";

const Notifications = () => {
    const router = useRouter();
    const [notifications, setNotifications] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await getNotifications({ type: 2 });
            if (result.success) {
                setNotifications(result.data);
            } else {
                setError(result.error);
            }
        } catch (err) {
            setError("Failed to fetch notifications. Please try again later.");
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

    if (error || !notifications.length) {
        return (
            <Alert variant="warning">Notifications are not available. Please try again later.</Alert>
        )
    }

    return (
        <>Notifications</>
    )
}

export default Notifications;