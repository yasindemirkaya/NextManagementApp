import { useState, useEffect } from 'react';
import { Spinner, Alert, Container, Row, Col, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getMyNotifications, updateNotification } from '@/services/notificationApi';
import styles from '../index.module.scss';
import { icons } from '@/static/icons';
import toast from '@/utils/toastify';
import { ToastContainer } from 'react-toastify';
import { useRouter } from 'next/router';
import { getStyleForNotificationType } from '@/helpers/getStyleForNotificationType';

const MyNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1); // Başlangıç sayfası
    const [limit] = useState(4);
    const [hasMore, setHasMore] = useState(true); // Diğer sayfa var mı kontrolü

    const router = useRouter();

    // My Notifications verilerini çekme
    const fetchNotifications = async () => {
        setLoading(true);
        setError(null);

        try {
            const result = await getMyNotifications({ type: 2, page, limit }); // fetchMyNotifications API çağrısı
            if (result.success) {
                // Bildirimleri is_seen değerine göre sıralıyoruz
                const sortedNotifications = result.data.sort((a, b) => {
                    // is_seen false olanlar üstte, true olanlar altta sıralansın
                    return a.is_seen === b.is_seen ? 0 : a.is_seen ? 1 : -1;
                });

                if (page === 1) {
                    // İlk sayfa ise, eski verileri temizle
                    setNotifications(sortedNotifications);
                } else {
                    // Diğer sayfalar için eski verilerin üstüne ekle
                    setNotifications(prevNotifications => [
                        ...prevNotifications,
                        ...sortedNotifications
                    ]);
                }
                setHasMore(result.data.length === limit); // Eğer 4'ten az bildirim geldiyse daha fazla yok demektir
            } else {
                setError(result.error);
            }
        } catch (err) {
            setError("Failed to fetch notifications. Please try again later.");
        }

        setLoading(false);
    };


    // View More butonuna tıklama işlemi
    const handleViewMore = () => {
        setPage(prevPage => prevPage + 1); // Bir sonraki sayfayı al
    };

    // Back butonuna tıklama işlemi
    const handleBack = () => {
        router.push('/notifications');
    };

    const handleDeleteNotification = async (notification) => {
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

    // İlk yükleme veya sayfa değişimi
    useEffect(() => {
        fetchNotifications();
    }, [page]);

    return (
        <>
            <Container>
                <Row>
                    <Col md={12}>
                        <h4>My Notifications</h4>
                        {loading ? (
                            <Spinner animation="border" />
                        ) : error ? (
                            <Alert variant="danger">{error}</Alert>
                        ) : (
                            <>
                                <div className="timeline">
                                    <div className={styles.timeline}>
                                        {notifications.map((notification, index) => (
                                            <div
                                                key={index}
                                                className={`${styles.timelineItem} ${notification.is_seen ? styles.seen : styles.notSeen}`}
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

                                                    {/* Type & User or Group */}
                                                    <Row className="mb-2">
                                                        <Col md={5}>
                                                            Type: <span className={getStyleForNotificationType(notification.type)}>{notification.type}</span>
                                                        </Col>
                                                        <Col md={7}>
                                                            {notification.user ? 'User:' : 'Group:'} <span className="text-danger fw-bold">{notification.user || notification.group}</span>
                                                        </Col>
                                                    </Row>

                                                    {/* Seen & Seen At */}
                                                    <Row className="mb-2">
                                                        <Col md={5}>
                                                            <div>
                                                                Seen: <span className={notification.is_seen ? 'text-success' : 'text-danger' + ' fw-bold'}>{notification.is_seen ? 'Yes' : 'No'}</span>
                                                            </div>
                                                        </Col>
                                                        <Col md={5}>
                                                            {notification.is_seen && (
                                                                <div className="mb-2">
                                                                    <em className={`${styles.seenAtDate} text-muted`}>
                                                                        (Seen at {notification.updatedAt})
                                                                    </em>
                                                                </div>
                                                            )}
                                                        </Col>
                                                    </Row>

                                                    {/* Delete Notification */}
                                                    <Row>
                                                        <Col md={12}>
                                                            <div className={`${styles.markAsSeen}`}>
                                                                <div className="d-inline-flex align-items-center">
                                                                    <div onClick={() => handleDeleteNotification(notification)}>
                                                                        <FontAwesomeIcon icon={icons.faTrash} className="me-2 text-danger" />
                                                                        <em className={`text-danger ${styles.markAsSeenButton}`}>
                                                                            Delete Notification
                                                                        </em>
                                                                    </div>
                                                                </div>

                                                                {/* Info Icon */}
                                                                <OverlayTrigger
                                                                    placement="right"
                                                                    overlay={
                                                                        <Tooltip>
                                                                            Deleted notifications cannot be brought back.
                                                                        </Tooltip>
                                                                    }
                                                                >
                                                                    <FontAwesomeIcon icon={icons.faInfoCircle} className="ms-2 text-danger" />
                                                                </OverlayTrigger>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Back & View More */}
                                <div className="d-flex justify-content-center mb-3">
                                    <Button variant="link" className="text-secondary" onClick={handleBack}>
                                        Back
                                    </Button>
                                    {hasMore && (
                                        <Button variant="link" onClick={handleViewMore}>
                                            View More
                                        </Button>
                                    )}
                                </div>
                            </>
                        )}
                    </Col>
                </Row>
            </Container>
            <ToastContainer />
        </>
    );
};

export default MyNotifications;
