import React from 'react';
import Header from '@/components/Common/Header';
import Breadcrumb from '@/components/Common/Breadcrumb';
import Footer from '@/components/Common/Footer';
import Sidebar from '@/components/Common/Sidebar';

import styles from './index.module.scss';

const DefaultLayout = ({ children }) => {
    return (
        <div className={styles.layout}>
            <Header className={styles.header} />
            <Breadcrumb />
            <Sidebar />
            <main className={styles.mainContent}>{children}</main>
            <Footer className={styles.footer} />
        </div>
    );
};

export default DefaultLayout;