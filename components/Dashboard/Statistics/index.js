import { Row, Col, Card, Alert } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icons } from '@/static/icons';
import styles from './index.module.scss';
import { useEffect } from "react";
import { useRouter } from 'next/router';
import { useTranslations } from "next-intl";

import { useDispatch, useSelector } from 'react-redux';
import { setStats } from '@/redux/statSlice';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import 'react-resizable/css/styles.css';

const Statistics = ({ stats }) => {
    const t = useTranslations();
    const router = useRouter();
    const dispatch = useDispatch();

    // Get statistics from redux
    const statistics = useSelector(state => state.stats.dashboardStats);

    // Set statistics if there is none
    useEffect(() => {
        if (statistics.length === 0) {
            dispatch(setStats(stats));
        }
    }, [stats, statistics, dispatch]);

    // Remove stats from screen
    const removeStat = (index) => {
        const updatedStats = statistics.filter((_, i) => i !== index);
        dispatch(setStats(updatedStats));
    };

    // Page redirect on stat click
    const handleStatClick = (link) => {
        router.push(`/${router.locale}${link}`);
    };

    // Update stats when dragging ends
    const onDragEnd = (result) => {
        const { destination, source } = result;
        if (!destination) return;

        if (destination.index === source.index) return;

        const reorderedStats = Array.from(statistics);
        const [movedStat] = reorderedStats.splice(source.index, 1);
        reorderedStats.splice(destination.index, 0, movedStat);
        dispatch(setStats(reorderedStats));
    };

    // Get column size based on number of stats
    const getColumnSize = (statCount) => {
        if (statCount === 3) {
            return { xs: 12, sm: 12, md: 4 };
        }
        if (statCount === 2) {
            return { xs: 12, sm: 12, md: 6 };
        }
        return { xs: 12, sm: 12, md: 12 };
    };

    if (!statistics) {
        return null;
    }

    if (statistics.length === 0) {
        return (
            <Alert variant="warning" className="text-center">
                {t("Statistics not available Please try again later")}
            </Alert>
        );
    }

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable" direction="horizontal">
                {(provided) => (
                    <Row ref={provided.innerRef} {...provided.droppableProps}>
                        {statistics.map((stat, index) => (
                            <Draggable key={index} draggableId={String(index)} index={index}>
                                {(provided) => (
                                    <Col
                                        xs={getColumnSize(statistics.length).xs}
                                        sm={getColumnSize(statistics.length).sm}
                                        md={getColumnSize(statistics.length).md}
                                        className="mb-3"
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                    >
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
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </Row>
                )}
            </Droppable>
        </DragDropContext>
    );
};

export default Statistics;
