import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Link from 'next/link';
import styles from './index.module.scss';

const Footer = () => {
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
                        <div className={styles.links}>
                            <Link href="/about" className="me-3">About Us</Link>
                            <Link href="/contact" className="me-3">Contact</Link>
                            <Link href="/privacy">Privacy Policy</Link>
                        </div>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};


export default Footer;