import React from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from './index.module.scss';

const Login = () => {
    const router = useRouter();

    const handleBack = () => {
        router.back();
    };

    return (
        <Container className={`mt-5 ${styles.loginContainer}`}>
            <h2>Login</h2>
            <Form>
                {/* Email */}
                <Form.Group controlId="formBasicEmail" className="mt-1">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" />
                </Form.Group>

                {/* Password */}
                <Form.Group controlId="formBasicPassword" className="mt-1">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Enter password" />
                </Form.Group>

                <Row className="mt-3">
                    <Col>
                        {/* Back Butonu */}
                        <Button variant="secondary" onClick={handleBack} className="w-100">
                            Back
                        </Button>
                    </Col>
                    <Col>
                        {/* Login Butonu */}
                        <Button variant="primary" type="submit" className="w-100">
                            Login
                        </Button>
                    </Col>
                </Row>
            </Form>

            <Row className="mt-3">
                <p>
                    Don't have an account?{' '}
                    <Link href="/register" className={styles.link}>Sign up now!</Link>
                </p>
            </Row>

            <Row>
                <p>
                    Back to <Link href="/" className={styles.link}>Homepage</Link>
                </p>
            </Row>
        </Container >
    );
};

export default Login;