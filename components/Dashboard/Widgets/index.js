import { useState } from "react";
import { Button } from "react-bootstrap";
import styles from "./index.module.scss";
import { icons } from '@/static/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Widget = () => {
    const [isPanelOpen, setIsPanelOpen] = useState(false);

    const togglePanel = () => {
        setIsPanelOpen(prev => !prev);
    };

    return (
        <>
            <Button
                className={styles.widgetButton}
                onClick={togglePanel}
            >
                <FontAwesomeIcon icon={icons.faCog} />
            </Button>

            {/* Panel */}
            {isPanelOpen && (
                <div className={styles.widgetPanel}>
                    <div className={styles.panelHeader}>
                        <span>Widgets</span>
                        <Button
                            variant="link"
                            onClick={togglePanel}
                            className={styles.closeButton}
                        >
                            <FontAwesomeIcon icon={icons.faTimes} />
                        </Button>
                    </div>
                    <div className={styles.panelBody}>
                        Widgets
                    </div>
                </div>
            )}
        </>
    );
};

export default Widget;
