import { useRouter } from "next/router";
import axios from '@/utils/axios';
import styles from './index.module.scss';
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import ProfileCard from "@/components/GroupManagement/UserGroups/ViewUserGroups/UserGroupProfile/GroupProfileCard";


const GroupDetail = () => {
    const [userGroup, setUserGroup] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const router = useRouter();
    const { groupId } = router.query;

    // Query Formatter
    const queryFormatter = (queryString) => {
        const lastDashIndex = queryString.lastIndexOf("-");

        if (lastDashIndex === -1) {
            return null;  // Geçersiz format durumunda null döndürüyoruz
        }

        // Son "-" karakterinden sonrasını groupId olarak alıyoruz
        const groupId = queryString.substring(lastDashIndex + 1);

        return groupId;
    };

    useEffect(() => {
        if (groupId) {  // 'groupId' parametresi varsa işlemi başlat
            const groupIdFromQuery = queryFormatter(groupId);

            if (groupIdFromQuery) {
                getUserGroupDetails(groupIdFromQuery);
            }
        }
    }, [groupId]);


    // Get User Group By ID
    const getUserGroupDetails = (id) => {
        setLoading(true);

        axios.get('/private/group/get-user-group-by-id', {
            params: {
                id
            },
        })
            .then((response) => {
                if (response.code === 1) {
                    setUserGroup(response.group);
                    setLoading(false);
                } else {
                    setLoading(false);
                    setError(response.message);
                }
            })
            .catch((error) => {
                setLoading(false);
                setError('An error occurred when receiving user group data. Please try again later.');
            });
    };


    return (
        <Container className={styles.profilePage}>
            <Row className="d-flex justify-content-center h-100">
                <Col md={4}>
                    <ProfileCard
                        userGroup={userGroup}
                        loading={loading}
                        error={error}
                        from={'view-user-groups'}
                        getUserGroupDetails={getUserGroupDetails}
                    />
                </Col>
            </Row>
        </Container>
    );
}

export default GroupDetail;