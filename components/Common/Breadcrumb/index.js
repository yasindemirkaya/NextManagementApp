import React from 'react';
import { Breadcrumb } from 'react-bootstrap';
import { useRouter } from 'next/router';
import styles from './index.module.scss';
import { useSelector } from 'react-redux';
import Cookies from 'js-cookie';

const BreadcrumbComponent = () => {
    const loggedInUser = useSelector(state => state.user.user);
    const lang = useSelector(state => state.settings.userSettings.language)
    const token = Cookies.get('token');
    const router = useRouter();
    const pathSegments = router.pathname.split('/').filter(Boolean);

    // Breadcrumb linklerini formatlamak için
    const segmentFormatter = (segment) => {
        switch (true) {
            case segment.includes('[userId]'):
                return lang === "en" ? 'User Detail' : "Kullanıcı Detayı";
            case segment.includes('[groupId]'):
                return lang === "en" ? 'Group Detail' : "Grup Detayı";
            case segment.includes('[groupTypeId]'):
                return lang === "en" ? 'Group Type Detail' : "Grup Türü Detayı";
            case segment.includes('[notificationId]'):
                return lang === "en" ? 'Notification Detail' : "Bildirim Detayı";
            case segment.includes('[projectId]'):
                return lang === "en" ? 'Project Detail' : "Proje Detayı";
            default:
                return segment.split('-')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');
        }
    };

    // Kullanıcı giriş yapmamışsa veya token yoksa null döndür
    if (!loggedInUser || !token) {
        return null;
    }

    return (
        <Breadcrumb className={styles.breadcrumb}>
            <Breadcrumb.Item className={styles.breadcrumbItem} href="/dashboard">Home</Breadcrumb.Item>
            {pathSegments.map((segment, index) => {
                const segmentPath = `/${pathSegments.slice(0, index + 1).join('/')}`;

                return (
                    <Breadcrumb.Item
                        key={index}
                        active={index === pathSegments.length - 1}
                        href={segmentPath}
                        className={styles.breadcrumbItem}
                    >
                        <span>{segmentFormatter(segment)}</span>

                    </Breadcrumb.Item>
                );
            })}
        </Breadcrumb>
    );
};

export default BreadcrumbComponent;
