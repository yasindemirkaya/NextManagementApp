import React from "react";
import Link from "next/link";
import { Card, Button, Row, Col } from "react-bootstrap";
import sidebarMenu from "@/static/components/sidebar";
import styles from './index.module.scss'

const GroupTypeManagement = () => {
    // Group Type Management menüsünü ve alt menülerini bul
    const groupTypeManagementMenu = sidebarMenu.find(menu => menu.name === "Group Type Management");

    return (
        <div className="container mt-5">
            <h1 className="mb-4">Group Type Management</h1>
            <Row>
                {groupTypeManagementMenu?.subMenus.map(subMenu => (
                    <Col key={subMenu.id} md={4} className="mb-3">
                        <Card className="h-100">
                            <Card.Body className="d-flex flex-column justify-content-between">
                                <Card.Title>{subMenu.name}</Card.Title>
                                <Card.Text>{subMenu.description}</Card.Text>
                                <Link href={subMenu.link} passHref>
                                    <Button variant="primary" className="mt-auto">
                                        Go to {subMenu.name}
                                    </Button>
                                </Link>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default GroupTypeManagement;
