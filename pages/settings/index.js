import { useState } from "react";
import { Container, Row, Col, ListGroup, Card } from "react-bootstrap";
import styles from './index.module.scss';
import { useTranslations } from "next-intl";

const Settings = () => {
    const t = useTranslations()
    const [activeTab, setActiveTab] = useState("language");

    const renderContent = () => {
        switch (activeTab) {
            case "language":
                return (
                    <>
                        <Card.Title>{t("Language Settings")}</Card.Title>
                        <Card.Text>Here you can configure language-related options.</Card.Text>
                    </>
                );
            case "theme":
                return (
                    <>
                        <Card.Title>{t("Theme Settings")}</Card.Title>
                        <Card.Text>Here you can configure theme-related options.</Card.Text>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <Container fluid className="px-5">
            <Row>
                {/* Left Menu */}
                <Col md={3}>
                    <ListGroup className={styles.settingsMenu}>
                        <ListGroup.Item
                            action
                            active={activeTab === "language"}
                            onClick={() => setActiveTab("language")}
                        >
                            {t("Language Settings")}
                        </ListGroup.Item>
                        <ListGroup.Item
                            action
                            active={activeTab === "theme"}
                            onClick={() => setActiveTab("theme")}
                        >
                            {t("Theme Settings")}
                        </ListGroup.Item>
                    </ListGroup>
                </Col>

                {/* Right Content */}
                <Col md={9}>
                    <Card className={styles.settingsContent}>
                        <Card.Body>
                            {renderContent()}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
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

export default Settings;
