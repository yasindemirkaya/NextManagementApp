import { Card } from "react-bootstrap";
import styles from './index.module.scss'

const UserAndGroupManagement = () => {
    return (
        <>
            <Card className={styles.userAndGroupManagementCard}>
                <Card.Body>
                    <Card.Title>User and Group Management</Card.Title>
                </Card.Body>
            </Card>
        </>
    )
}

export default UserAndGroupManagement;