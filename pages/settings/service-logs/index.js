import React, { useState } from 'react';
import { Container, Card, Form, Button, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import toast from '@/utils/toastify';
import { ToastContainer } from 'react-toastify';
import { getServiceLogs } from '@/services/serviceLogsApi';
import { JSONTree } from 'react-json-tree';
import styles from './index.module.scss'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icons } from '@/static/icons';

const GetServiceLogs = () => {
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm();
    const [logs, setLogs] = useState(null);
    const [invertTheme, setInvertTheme] = useState(false);

    const toggleTheme = () => {
        setInvertTheme(prevState => !prevState);
    };

    // Submit form
    const onSubmit = async (data) => {
        try {
            const response = await getServiceLogs(data.guid);

            if (response.success) {
                setLogs(response.data);
                toast('SUCCESS', response.message);
            } else {
                setLogs(null);
                toast('ERROR', response.error);
            }
        } catch (error) {
            setLogs(null);
            toast('ERROR', 'An error occurred while fetching the logs. Please try again later.');
        }
    };

    return (
        <>
            <Container>
                <Card className={styles.serviceLogsContainer}>
                    <Card.Body >
                        <Row className="align-items-center mb-4">
                            <Col xs={8} sm={8} md={8}>
                                <h2 className="mb-0 text-center text-md-left">Get Service Logs</h2>
                            </Col>

                            <Col xs={4} sm={4} md={4} className="d-flex justify-content-center justify-content-md-end">
                                <Button
                                    onClick={toggleTheme}
                                    className="mb-0"
                                >
                                    <FontAwesomeIcon icon={invertTheme ? icons.faMoon : icons.faSun} />
                                </Button>
                            </Col>
                        </Row>


                        <Form onSubmit={handleSubmit(onSubmit)}>
                            <Row>
                                {/* GUID Field */}
                                <Col md={12}>
                                    <Form.Group controlId="guid">
                                        <Form.Label>GUID</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter GUID"
                                            isInvalid={!!errors.guid}
                                            {...register("guid", {
                                                required: "GUID is required",
                                            })}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.guid?.message}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>

                            {/* Submit Button */}
                            <Button variant="primary" type="submit" disabled={isSubmitting} className="mt-3">
                                {isSubmitting ? 'Fetching Logs...' : 'Get Logs'}
                            </Button>
                        </Form>

                        {/* Logs Display */}
                        {logs && (
                            <div className="mt-4">
                                <h4>Logs:</h4>
                                <JSONTree
                                    data={logs}
                                    theme="tomorrow"
                                    invertTheme={invertTheme}
                                />
                            </div>
                        )}
                    </Card.Body>
                </Card>
            </Container>
            <ToastContainer />
        </>
    );
};

export default GetServiceLogs;
