import { Row, Col, Card } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icons } from '@/static/icons';
import styles from './index.module.scss';
import { useEffect, useState } from "react";
import { useRouter } from 'next/router';

const Statistics = ({ stats, statsData }) => {
    const router = useRouter();

    const [visibleStats, setVisibleStats] = useState(stats);

    useEffect(() => {
        const updatedStats = stats.map(stat => {
            let value;

            // Stat Title değerine göre statsData'dan ilgili değerleri al
            switch (stat.title) {
                case "Users":
                    value = statsData.userCount;
                    break;
                case "Groups":
                    value = statsData.userGroupCount;
                    break;
                case "Group Types":
                    value = statsData.userGroupTypeCount;
                    break;
                default:
                    value = 0;
            }

            return { ...stat, value: value || 0 };
        });
        setVisibleStats(updatedStats);
    }, [stats, statsData]);

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
                <Col key={index} xs={12} sm={12} md={4} className="mb-3">
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
