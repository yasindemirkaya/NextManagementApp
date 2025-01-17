import React, { useState, Suspense, lazy } from "react";
import { Container, Row, Col, ListGroup, Card, Alert } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styles from './index.module.scss';
import { useTranslations } from "next-intl";
import { generalSettings } from "@/static/data/settings";

// Dynamic component import
const LanguageSettings = lazy(() => import('@/components/Settings/LanguageSettings'));
const ThemeSettings = lazy(() => import('@/components/Settings/ThemeSettings'));

const Settings = () => {
    const t = useTranslations();
    const [activeTab, setActiveTab] = useState(generalSettings[0].id);

    const renderContent = () => {
        switch (activeTab) {
            case 0:
                return <LanguageSettings />;
            case 1:
                return <ThemeSettings />;
            default:
                return <Alert variant="danger">{t('Select a setting from the menu')}</Alert>;
        }
    };

    return (
        <Container fluid className="px-5">
            <Row>
                {/* Left Menu */}
                <Col md={3}>
                    <ListGroup className={styles.settingsMenu}>
                        {generalSettings.map((setting) => (
                            <ListGroup.Item
                                key={setting.id}
                                action
                                active={activeTab === setting.id}
                                onClick={() => setActiveTab(setting.id)}
                                className={styles.menuItem}
                            >
                                <FontAwesomeIcon icon={setting.icon} className={`${styles.menuIcon} me-2`} />
                                {t(setting.title)}
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Col>

                {/* Right Content */}
                <Col md={9}>
                    <Card className={styles.settingsContent}>
                        <Card.Body>
                            <Suspense fallback={<div>Loading...</div>}>
                                {renderContent()}
                            </Suspense>
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
