import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Link from 'next/link';
import styles from './index.module.scss';
import footerMenu from '@/static/components/footer';

const Footer = () => {
    const lang = typeof window !== "undefined" ? localStorage.getItem("language") : "en"; // Dil parametresini al

    return (
        <footer className={styles.footer}>
            <Container>
                <Row className="align-items-center h-100">
                    <Col md={6} className="d-flex justify-content-center justify-content-md-start h-100">
                        <p className="mb-0">
                            &copy; {new Date().getFullYear()} Your Company. All rights reserved.
                        </p>
                    </Col>

                    <Col md={6} className="d-flex justify-content-center justify-content-md-end h-100">
                        {footerMenu.map((menu) => (
                            <div key={menu.id} className={styles.links}>
                                <Link href={menu.link} className="me-3">
                                    {lang === "tr" ? menu.nameTR : menu.name}
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
