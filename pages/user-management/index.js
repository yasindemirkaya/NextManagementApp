import React from "react";
import Link from "next/link";
import { Card, Button, Row, Col } from "react-bootstrap";
import sidebarMenu from "@/static/components/sidebar";
import styles from './index.module.scss'

const UserManagement = () => {
    // User Management menüsünü ve alt menülerini bul
    const userManagementMenu = sidebarMenu.find(menu => menu.name === "User Management");

    return (
        <div className="container mt-5">
            <h1 className="mb-4">User Management</h1>
            <Row>
                {userManagementMenu?.subMenus.map(subMenu => (
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

export default UserManagement;
