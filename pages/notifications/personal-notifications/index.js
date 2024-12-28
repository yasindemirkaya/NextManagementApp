import { useState, useEffect } from 'react';
import { Spinner, Alert, Container, Row, Col, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getNotifications, updateNotification } from '@/services/notificationApi';
import styles from '../index.module.scss';
import { icons } from '@/static/icons';
import toast from '@/utils/toastify';
import { ToastContainer } from 'react-toastify';
import { useRouter } from 'next/router';
import { getStyleForNotificationType } from '@/helpers/getStyleForNotificationType';

const PersonalNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1); // Başlangıç sayfası
    const [limit] = useState(4)
    const [hasMore, setHasMore] = useState(true); // Diğer sayfa var mı kontrolü

    const router = useRouter();

    // Kişisel bildirimleri çekme
    const fetchNotifications = async () => {
        setLoading(true);
        setError(null);

        try {
            const result = await getNotifications({ type: 0, page, limit }); // type: 0 - Personal, 4 bildirim getir
            if (result.success) {
                if (page === 1) {
                    // İlk sayfa ise, eski verileri temizle
                    setNotifications(result.data);
                } else {
                    // Diğer sayfalar için eski verilerin üstüne ekle
                    setNotifications(prevNotifications => [
                        ...prevNotifications,
                        ...result.data
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
        router.push('/notifications')
    };

    const handleMarkAsSeen = async (notification, fetchNotifications) => {
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
                        <h4>Personal Notifications</h4>
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
                                                        <Col md={7}>
                                                            From: <span className="text-danger fw-bold">{notification.created_by}</span>
                                                        </Col>
                                                    </Row>

                                                    {/* Is Seen */}
                                                    <div>
                                                        Seen: <span className={notification.is_seen ? 'text-success' : 'text-danger' + ' fw-bold'}>{notification.is_seen ? 'Yes' : 'No'}</span>
                                                    </div>

                                                    {/* Mark as Seen */}
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
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {hasMore && (
                                    <div className="d-flex justify-content-center mb-3">
                                        <Button variant="link" className="text-secondary" onClick={handleBack}>
                                            Back
                                        </Button>
                                        <Button variant="link" onClick={handleViewMore}>
                                            View More
                                        </Button>
                                    </div>
                                )}
                            </>
                        )}
                    </Col>
                </Row>
            </Container>
            <ToastContainer />
        </>

    );
};

export default PersonalNotifications;
