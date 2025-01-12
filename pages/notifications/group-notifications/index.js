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
import { useTranslations } from 'next-intl';

const GroupNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1); // Başlangıç sayfası
    const [limit] = useState(4)
    const [hasMore, setHasMore] = useState(true); // Diğer sayfa var mı kontrolü

    const router = useRouter();
    const t = useTranslations();

    // Group bildirimleri çekme
    const fetchNotifications = async () => {
        setLoading(true);
        setError(null);

        try {
            const result = await getNotifications({ type: 1, page, limit }); // type: 1 - Group, 4 bildirim getir
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
        router.push('/notifications')
    };

    const handleMarkAsSeen = async (notification, fetchNotifications) => {
        const type = 1;

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
                    <Col md={8}>
                        <h4>{t("Group Notifications")}</h4>
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
                                                        <p className="mb-2">{notification.date}</p>
                                                    </Row>

                                                    <hr />

                                                    {/* Type & From */}
                                                    <Row className="mb-2">
                                                        <Col md={5}>
                                                            {t("Type")}: <span className={getStyleForNotificationType(notification.type)}>{notification.type}</span>
                                                        </Col>
                                                        <Col md={7}>
                                                            {t("From")}: <span className="text-danger fw-bold">{notification.created_by}</span>
                                                        </Col>
                                                    </Row>

                                                    <Row className="mb-2">
                                                        <Col md={5}>
                                                            {t("Seen")}: <span className={notification.is_seen ? 'text-success fw-bold' : 'text-danger fw-bold'}>{notification.is_seen ? t('Yes') : t('No')}</span>
                                                        </Col>
                                                        <Col md={7}>
                                                            {t("Group Name")}: <span className="text-info fw-bold">{notification.group}</span>
                                                        </Col>
                                                    </Row>

                                                    {/* Mark as Seen */}
                                                    <Row>
                                                        <Col md={12}>
                                                            <div className={`mt-3 ${styles.markAsSeen}`}>
                                                                {!notification.is_seen && (
                                                                    <div className="d-inline-flex align-items-center">
                                                                        <div onClick={() => handleMarkAsSeen(notification)} className={styles.markAsSeenButton}>
                                                                            <FontAwesomeIcon icon={icons.faEye} className="me-2 text-info" />
                                                                            <em className={`text-info ${styles.markAsSeenButton}`}>
                                                                                {t("Mark as seen")}
                                                                            </em>
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {notification.is_seen && (
                                                                    <em className={`${styles.seenAtDate}`}>
                                                                        ({t("Seen at")} {notification.updatedAt})
                                                                    </em>
                                                                )}

                                                                {/* Info Icon */}
                                                                <OverlayTrigger
                                                                    placement="right"
                                                                    overlay={
                                                                        <Tooltip>
                                                                            {t("Notifications marked as seen will be removed from your page")}
                                                                        </Tooltip>
                                                                    }
                                                                >
                                                                    <FontAwesomeIcon icon={icons.faInfoCircle} className="ms-2 text-info" />
                                                                </OverlayTrigger>
                                                            </div>
                                                        </Col>
                                                    </Row>

                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="d-flex justify-content-center mb-3">
                                    <Button variant="link" className="text-secondary" onClick={handleBack}>
                                        {t("Back")}
                                    </Button>
                                    {hasMore && (
                                        <Button variant="link" onClick={handleViewMore}>
                                            {t("View More")}
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

export async function getStaticProps(context) {
    const commonMessages = await import(`../../../public/locales/common/${context.locale}.json`);
    const validationMessages = await import(`../../../public/locales/validation/${context.locale}.json`);
    const formMessages = await import(`../../../public/locales/form/${context.locale}.json`);
    const responseMessages = await import(`../../../public/locales/response/${context.locale}.json`);

    return {
        props: {
            messages: {
                ...commonMessages.default,
                ...validationMessages.default,
                ...formMessages.default,
                ...responseMessages.default,
            },
        },
    };
}

export default GroupNotifications;
