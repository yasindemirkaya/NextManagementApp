import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Spinner, Alert } from "react-bootstrap";
import styles from './index.module.scss';
import { useSelector } from 'react-redux';
import { getNotifications, getMyNotifications } from "@/services/notificationApi";

const Notifications = () => {
    const router = useRouter();
    const [notifications, setNotifications] = useState([]);
    const [myNotifications, setMyNotifications] = useState([]);

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

    // Get notifications that user received
    const fetchNotifications = async () => {
        setLoadingNotifications(true);
        setErrorNotifications(null);

        try {
            const result = await getNotifications({ type: 2 });
            if (result.success) {
                setNotifications(result.data);
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

    return (
        <>
            Notifications
        </>
    )
}

export default Notifications;