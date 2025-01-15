import { useRef, useState, useEffect } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useTranslations } from "next-intl";

import styles from "./index.module.scss";
import { icons } from '@/static/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useDispatch, useSelector } from "react-redux";
import { setShowDashboardStats, resetDashboardStats } from "@/redux/statSlice";

const Widget = () => {
    const t = useTranslations();
    const dispatch = useDispatch();

    const showDashboardStats = useSelector(state => state.stats.showDashboardStats);
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const panelRef = useRef(null);

    // Toggle panel
    const togglePanel = () => {
        setIsPanelOpen(prev => !prev);
    };

    // Close panel on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (panelRef.current && !panelRef.current.contains(event.target)) {
                setIsPanelOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Show & Hide Statistics
    const handleStatisticsToggle = (e) => {
        dispatch(setShowDashboardStats(e.target.checked));
    };

    // Reset Statistics to Default
    const handleResetStatistics = () => {
        dispatch(resetDashboardStats());
    };

    return (
        <>
            {/* Widgets Button */}
            <Button
                className={styles.widgetButton}
                onClick={togglePanel}
            >
                <FontAwesomeIcon icon={icons.faCog} />
            </Button>

            {/* Panel */}
            {isPanelOpen && (
                <div className={styles.widgetPanel} ref={panelRef}>
                    <div className={styles.panelHeader}>
                        <span>{t("Widgets")}</span>
                        <Button
                            variant="link"
                            onClick={togglePanel}
                            className={styles.closeButton}
                        >
                            <FontAwesomeIcon icon={icons.faTimes} />
                        </Button>
                    </div>
                    <Container className={styles.panelBody}>
                        {/* Statistics */}
                        <Row>
                            <Col>
                                <Form>
                                    <h5>{t("Statistics Settings")}</h5>
                                    {/* Show & Hide Statistics */}
                                    <Form.Group controlId="showStatistics">
                                        <Form.Check
                                            type="switch"
                                            className={styles.formCheck}
                                            label={t("Show & Hide Statistics")}
                                            checked={showDashboardStats}
                                            onChange={handleStatisticsToggle}
                                        />
                                    </Form.Group>
                                    {/* Reset to Default */}
                                    <Form.Group controlId="resetStatistics">
                                        <Button
                                            variant="success"
                                            size="sm"
                                            className={styles.resetButton}
                                            onClick={handleResetStatistics}
                                        >
                                            {t("Reset Statistics")}
                                        </Button>
                                    </Form.Group>
                                </Form>
                            </Col>
                        </Row>
                    </Container>
                </div>
            )}
        </>
    );
};

export default Widget;
