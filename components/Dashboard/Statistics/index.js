import { Row, Col, Card } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icons } from '@/static/icons';
import styles from './index.module.scss';
import { useState } from "react";
import { useRouter } from 'next/router';

const stats = [
    { title: "Users", value: 25, icon: icons.faUser, link: '/user-management' },
    { title: "Groups", value: 6, icon: icons.faUsers, link: '/group-management' },
    { title: "Group Types", value: 2, icon: icons.faUser, link: '/group-type-management' },
    { title: "Notifications", value: 0, icon: icons.faUsers, link: '/notifications' },
];

const Statistics = () => {
    const router = useRouter();

    const [visibleStats, setVisibleStats] = useState(stats);

    // Remove stats
    const removeStat = (index) => {
        const updatedStats = visibleStats.filter((_, i) => i !== index);
        setVisibleStats(updatedStats);
    };

    // Page redirection
    const handleStatClick = (link) => {
        router.push(`/${router.locale}${link}`);
    };

    return (
        <Row>
            {visibleStats.map((stat, index) => (
                <Col key={index} xs={12} sm={6} md={3} className="mb-3">
                    <Card className="d-flex">
                        <Card.Body className={styles.statsBody}>
                            <div>
                                <Card.Title className={styles.statTitle} onClick={() => handleStatClick(stat.link)}>{stat.title}</Card.Title>
                                <Card.Text className={styles.statValue}>{stat.value}</Card.Text>
                            </div>
                            <div className={styles.iconFrame}>
                                <FontAwesomeIcon icon={stat.icon} className={styles.icon} />
                            </div>
                            <div className={styles.removeButton} onClick={() => removeStat(index)}>
                                <FontAwesomeIcon icon={icons.faTimes} className={styles.removeIcon} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            ))}
        </Row>
    );
}

export default Statistics;
