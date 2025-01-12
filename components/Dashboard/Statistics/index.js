import { Row, Col, Card } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icons } from '@/static/icons';
import styles from './index.module.scss';
import { useEffect, useState } from "react";
import { useRouter } from 'next/router';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import 'react-resizable/css/styles.css';

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

    // Dragging işlemi tamamlandığında sıralamayı güncelleme
    const onDragEnd = (result) => {
        const { destination, source } = result;
        if (!destination) return;

        if (destination.index === source.index) return;

        const reorderedStats = Array.from(visibleStats);
        const [movedStat] = reorderedStats.splice(source.index, 1);
        reorderedStats.splice(destination.index, 0, movedStat);

        setVisibleStats(reorderedStats);
    };

    // Ekrandaki kart sayısına göre sütun boyutunu belirleme
    const getColumnSize = (statCount) => {
        if (statCount === 3) {
            return { xs: 12, sm: 12, md: 4 };
        }
        if (statCount === 2) {
            return { xs: 12, sm: 12, md: 6 };
        }
        return { xs: 12, sm: 12, md: 12 };
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable" direction="horizontal">
                {(provided) => (
                    <Row ref={provided.innerRef} {...provided.droppableProps}>
                        {visibleStats.map((stat, index) => (
                            <Draggable key={index} draggableId={String(index)} index={index}>
                                {(provided) => (
                                    <Col
                                        xs={getColumnSize(visibleStats.length).xs}
                                        sm={getColumnSize(visibleStats.length).sm}
                                        md={getColumnSize(visibleStats.length).md}
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
