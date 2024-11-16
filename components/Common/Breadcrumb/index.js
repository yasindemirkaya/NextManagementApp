import React from 'react';
import { Breadcrumb } from 'react-bootstrap';
import { useRouter } from 'next/router';
import styles from './index.module.scss';

const BreadcrumbComponent = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    if (!token) {
        return null;
    }

    // Next.js'in useRouter hook'u ile mevcut URL'yi alıyoruz
    const router = useRouter();
    const pathSegments = router.pathname.split('/').filter(Boolean);

    // Breadcrumb linklerini formatlamak için
    const segmentFormatter = (segment) => {
        return segment.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    }

    return (
        <Breadcrumb className={styles.breadcrumb}>
            <Breadcrumb.Item className={styles.breadcrumbItem} href="/">Home</Breadcrumb.Item>
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
