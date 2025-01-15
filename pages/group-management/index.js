import React from "react";
import Link from "next/link";
import { Card, Button, Row, Col } from "react-bootstrap";
import sidebarMenu from "@/static/components/sidebar";
import styles from './index.module.scss'
import { useTranslations } from "next-intl";

const GroupManagement = () => {
    const lang = typeof window !== "undefined" ? localStorage.getItem("language") : "tr";
    const t = useTranslations();
    // User Management menüsünü ve alt menülerini bul
    const GroupManagementMenu = sidebarMenu.find(menu => menu.name === "Group Management");

    return (
        <div className="container mt-5">
            <h1 className="mb-4">{t("Group Management")}</h1>
            <Row>
                {GroupManagementMenu?.subMenus.map(subMenu => (
                    <Col key={subMenu.id} md={4} className="mb-3">
                        <Card className="h-100">
                            <Card.Body className="d-flex flex-column justify-content-between">
                                <Card.Title>{subMenu.name}</Card.Title>
                                <Card.Text>{lang == 'tr' ? subMenu.descriptionTR : subMenu.description}</Card.Text>
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

export async function getStaticProps(context) {
    const commonMessages = await import(`../../public/locales/common/${context.locale}.json`);

    return {
        props: {
            messages: {
                ...commonMessages.default,
            },
        },
    };
}

export default GroupManagement;
