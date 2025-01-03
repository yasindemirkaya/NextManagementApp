import React, { useState } from 'react';
import { Container, Card, Form, Button, Row, Col, ToggleButtonGroup, ToggleButton } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import toast from '@/utils/toastify';
import { ToastContainer } from 'react-toastify';
import { getServiceLogsByGUID, getServiceLogsByDate } from '@/services/serviceLogsApi';
import { JSONTree } from 'react-json-tree';
import styles from './index.module.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icons } from '@/static/icons';

const GetServiceLogs = () => {
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm();
    const [logs, setLogs] = useState(null);
    const [invertTheme, setInvertTheme] = useState(false);
    const [activeTab, setActiveTab] = useState('guid'); // State to control which tab is active

    const toggleTheme = () => {
        setInvertTheme(prevState => !prevState);
    };

    // Submit GUID form
    const onSubmitGUID = async (data) => {
        try {
            const response = await getServiceLogsByGUID(data.guid);
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

    // Submit date form
    const onSubmitDate = async (data) => {
        const { startDate, endDate, userEmail, userId } = data;
        try {
            const response = await getServiceLogsByDate(startDate, endDate, userEmail, userId);
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

    const handleSwitch = (value) => {
        setActiveTab(value);
        setLogs(null)
    };

    return (
        <>
            <Container>
                <Row>
                    <Col md={12} className="d-flex justify-content-center mb-4 mt-4" >
                        <ToggleButtonGroup
                            type="radio"
                            name="notificationType"
                            value={activeTab}
                            onChange={handleSwitch}
                            className={styles.toggleButton}
                        >
                            <ToggleButton id="guid" value="guid" variant="outline-primary">
                                Get Logs by GUID
                            </ToggleButton>
                            <ToggleButton id="date" value="date" variant="outline-primary">
                                Get Logs by Date
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Col>
                </Row>

                <Row>
                    {/* GUID*/}
                    {activeTab === 'guid' && (
                        <Col md={12}>
                            <Card className={styles.serviceLogsContainer}>
                                <Card.Body>
                                    <Row className="align-items-center mb-4">
                                        <Col xs={9} sm={9} md={9}>
                                            <h3 className="mb-0 text-center text-md-left">Get Service Logs by GUID</h3>
                                        </Col>
                                        <Col xs={3} sm={3} md={3} className="d-flex justify-content-center justify-content-md-end">
                                            <Button onClick={toggleTheme} className="mb-0">
                                                <FontAwesomeIcon icon={invertTheme ? icons.faMoon : icons.faSun} />
                                            </Button>
                                        </Col>
                                    </Row>

                                    <Form onSubmit={handleSubmit(onSubmitGUID)}>
                                        <Row>
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
                                        <Button variant="primary" type="submit" disabled={isSubmitting} className="mt-3">
                                            {isSubmitting ? 'Fetching Logs...' : 'Get Logs'}
                                        </Button>
                                    </Form>

                                    {logs && (
                                        <div className="mt-4">
                                            <h4>Logs:</h4>
                                            <JSONTree data={logs} theme="tomorrow" invertTheme={invertTheme} />
                                        </div>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>
                    )}

                    {/* DATE */}
                    {activeTab === 'date' && (
                        <Col md={12}>
                            <Card className={styles.serviceLogsContainer}>
                                <Card.Body>
                                    <Row className="align-items-center mb-4">
                                        <Col xs={9} sm={9} md={9}>
                                            <h3 className="mb-0 text-center text-md-left">Get Service Logs by Date</h3>
                                        </Col>
                                        <Col xs={3} sm={3} md={3} className="d-flex justify-content-center justify-content-md-end">
                                            <Button onClick={toggleTheme} className="mb-0">
                                                <FontAwesomeIcon icon={invertTheme ? icons.faMoon : icons.faSun} />
                                            </Button>
                                        </Col>
                                    </Row>
                                    <Form onSubmit={handleSubmit(onSubmitDate)}>
                                        <Row>
                                            <Col md={12}>
                                                <Form.Group controlId="startDate">
                                                    <Form.Label>Start Date</Form.Label>
                                                    <Form.Control
                                                        type="date"
                                                        isInvalid={!!errors.startDate}
                                                        {...register("startDate", {
                                                            required: "Start date is required",
                                                        })}
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {errors.startDate?.message}
                                                    </Form.Control.Feedback>
                                                </Form.Group>
                                            </Col>

                                            <Col md={12} className="mt-3">
                                                <Form.Group controlId="endDate">
                                                    <Form.Label>End Date</Form.Label>
                                                    <Form.Control
                                                        type="date"
                                                        isInvalid={!!errors.endDate}
                                                        {...register("endDate", {
                                                            required: "End date is required",
                                                        })}
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {errors.endDate?.message}
                                                    </Form.Control.Feedback>
                                                </Form.Group>
                                            </Col>

                                            <Col md={12} className="mt-3">
                                                <Form.Group controlId="userEmail">
                                                    <Form.Label>User Email (Optional)</Form.Label>
                                                    <Form.Control
                                                        type="email"
                                                        placeholder="Enter User Email"
                                                        {...register("userEmail")}
                                                    />
                                                </Form.Group>
                                            </Col>

                                            <Col md={12} className="mt-3">
                                                <Form.Group controlId="userId">
                                                    <Form.Label>User ID (Optional)</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="Enter User ID"
                                                        {...register("userId")}
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Button variant="primary" type="submit" className="mt-3">
                                            {isSubmitting ? 'Fetching Logs...' : 'Get Logs'}
                                        </Button>
                                    </Form>

                                    {logs && (
                                        <div className="mt-4">
                                            <h4>Logs:</h4>
                                            <JSONTree data={logs} theme="tomorrow" invertTheme={invertTheme} />
                                        </div>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>
                    )}
                </Row>
            </Container >
            <ToastContainer />
        </>
    );
};

export default GetServiceLogs;
