import { useEffect, useState } from 'react';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Container, Row, Col, Card } from 'react-bootstrap';
import styles from './index.module.scss';

import toast from '@/utils/toastify';
import { ToastContainer } from 'react-toastify';
import { useRouter } from 'next/router';

const ViewTasks = () => {
    const router = useRouter();

    return (
        <>
        </>
    )

}

export default ViewTasks;