import React, { useState } from 'react';

import Header from '@/components/Common/Header';
import Breadcrumb from '@/components/Common/Breadcrumb';
import Footer from '@/components/Common/Footer';
import Sidebar from '@/components/Common/Sidebar';

import styles from './index.module.scss';

const DefaultLayout = ({ children }) => {
    const [isSidebarVisible, setSidebarVisible] = useState(false);
    const toggleSidebar = () => setSidebarVisible(!isSidebarVisible);

    return (
        <div className={styles.layout}>
            <Header className={styles.header} toggleSidebar={toggleSidebar} />
            <Breadcrumb />
            <Sidebar isSidebarVisible={isSidebarVisible} toggleSidebar={toggleSidebar} />
            <main className={styles.mainContent}>{children}</main>
            <Footer className={styles.footer} />
        </div>
    );
};

export async function getStaticProps(context) {
    const commonMessages = await import(`../../../public/locales/common/${context.locale}.json`);

    return {
        props: {
            messages: {
                ...commonMessages.default,
            },
        },
    };
}

export default DefaultLayout;