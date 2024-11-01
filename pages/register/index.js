import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from './index.module.scss';

const SignUp = () => {
    const router = useRouter();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [mobile, setMobile] = useState('');

    const handleBack = () => {
        router.back();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    return (
        <Container className={`mt-5 ${styles.signupContainer}`}>
            <h2>Register</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formBasicName" className="mt-1">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter your first name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </Form.Group>

                <Form.Group controlId="formBasicLastName" className="mt-1">
                    <Form.Label>Surname</Form.Label>
                    <Form.Control type="text" placeholder="Enter your last name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </Form.Group>

                <Form.Group controlId="formBasicEmail" className="mt-1">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </Form.Group>

                <Form.Group controlId="formBasicPassword" className="mt-1">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </Form.Group>

                <Form.Group controlId="formBasicMobile" className="mt-1">
                    <Form.Label>Mobile</Form.Label>
                    <Form.Control type="tel" placeholder="Enter your mobile number" value={mobile} onChange={(e) => setMobile(e.target.value)} />
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
                            Sign Up
                        </Button>
                    </Col>
                </Row>

                <Row className="mt-3">
                    <p>
                        Alerady have an account?{' '}
                        <Link href="/login" className={styles.link}>Login now!</Link>
                    </p>
                </Row>

                <Row>
                    <p>
                        Back to <Link href="/" className={styles.link}>Homepage</Link>
                    </p>
                </Row>
            </Form>
        </Container>
    );
};

export default SignUp;