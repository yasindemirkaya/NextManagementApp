import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Link from 'next/link';
import styles from './index.module.scss';
import footerMenu from '@/static/components/footer';
import { useTranslations } from 'next-intl';

const Footer = () => {
    const t = useTranslations();
    return (
        <footer className={styles.footer}>
            <Container>
                <Row className="align-items-center h-100">
                    <Col md={6} className="d-flex justify-content-center justify-content-md-start h-100">
                        <p className="mb-0">
                            &copy; {new Date().getFullYear()} MyApp {t("All rights reserved")}
                        </p>
                    </Col>

                    <Col md={6} className="d-flex justify-content-center justify-content-md-end h-100">
                        {footerMenu.map((menu) => (
                            <div key={menu.id} className={styles.links}>
                                <Link href={menu.link} className="me-3">
                                    {t(menu.name)}
                                </Link>
                            </div>
                        ))}
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;
