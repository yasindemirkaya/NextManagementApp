import React from 'react';
import { Breadcrumb } from 'react-bootstrap';
import { useRouter } from 'next/router';
import styles from './index.module.scss';
import { useSelector } from 'react-redux';
import Cookies from 'js-cookie';

const BreadcrumbComponent = () => {
    const loggedInUser = useSelector(state => state.user.user);
    const token = Cookies.get('token')

    if (!loggedInUser || !token) {
        return null;
    }

    const router = useRouter();
    const pathSegments = router.pathname.split('/').filter(Boolean);

    // Breadcrumb linklerini formatlamak için
    const segmentFormatter = (segment) => {
        switch (true) {
            case segment.includes('[userId]'):
                return 'User Detail';
            case segment.includes('[groupId]'):
                return 'Group Detail';
            case segment.includes('[groupTypeId]'):
                return 'Group Type Detail';
            default:
                return segment.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        }
    };


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
                        {segmentFormatter(segment)}
                    </Breadcrumb.Item>
                );
            })}
        </Breadcrumb>
    );
};

export default BreadcrumbComponent;
