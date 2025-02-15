import { Row, Col, Card } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icons } from '@/static/icons';
import styles from './index.module.scss';
import { useEffect } from "react";
import { useRouter } from 'next/router';

import { useDispatch, useSelector } from 'react-redux';
import { setDashboardStats, setIsDashboardStatsInitialized } from '@/redux/statSlice';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useTranslations } from "use-intl";

const Statistics = ({ stats }) => {
    const t = useTranslations()
    const router = useRouter();
    const dispatch = useDispatch();

    // Get statistics from redux
    const statistics = useSelector(state => state.stats.dashboardStats);
    const isDashboardStatsInitialized = useSelector(state => state.stats.isDashboardStatsInitialized);
    const showDashboardStats = useSelector(state => state.stats.showDashboardStats)

    // Set statistics if there is none
    useEffect(() => {
        if (stats.length > 0 && statistics.length === 0 && !isDashboardStatsInitialized) {
            dispatch(setDashboardStats(stats));
            dispatch(setIsDashboardStatsInitialized(true));
        }
    }, [stats, statistics, dispatch, isDashboardStatsInitialized]);

    // Remove stats from screen
    const removeStat = (index) => {
        const updatedStats = statistics.filter((_, i) => i !== index);
        dispatch(setDashboardStats(updatedStats));
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
        dispatch(setDashboardStats(reorderedStats));
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

    if (!statistics || !showDashboardStats) {
        return null;
    }

    return (
        <>
            {showDashboardStats ?
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="droppable" direction="horizontal">
                        {(provided) => (
                            <Row ref={provided.innerRef} {...provided.droppableProps}>
                                {statistics.map((stat, index) => (
                                    <Draggable key={index} draggableId={String(index)} index={index} >
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
                                                            <Card.Title className={styles.statTitle} onClick={() => handleStatClick(stat.link)}>{t(stat.title)}</Card.Title>
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
                </DragDropContext >
                : null
            }
        </>

    );
};

export default Statistics;
