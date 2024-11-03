import React from 'react';
import Footer from '@/components/Common/Footer';
import styles from './index.module.scss';

const DefaultLayout = ({ children }) => {
    return (
        <div className={styles.layout}>
            <main className={styles.mainContent}>{children}</main>
            <Footer />
        </div>
    );
};

export default DefaultLayout;