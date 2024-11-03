import React from 'react';
import Footer from '@/components/Common/Footer';
import Header from '@/components/Common/Header';

import styles from './index.module.scss';

const DefaultLayout = ({ children }) => {
    return (
        <div className={styles.layout}>
            <Header />
            <main className={styles.mainContent}>{children}</main>
            <Footer />
        </div>
    );
};

export default DefaultLayout;