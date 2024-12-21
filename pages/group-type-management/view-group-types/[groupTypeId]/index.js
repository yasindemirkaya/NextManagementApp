import { useRouter } from "next/router";
import styles from './index.module.scss';
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import ProfileCard from "@/components/GroupTypeManagement/ViewGroupTypes/GroupTypeProfile/ProfileCard";
import { getGroupTypeById } from "@/services/groupTypeApi";

const UserDetailPage = () => {
    const [groupType, setGroupType] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const router = useRouter();
    const { groupTypeId } = router.query;


    useEffect(() => {
        const groupTypeDataFromQuery = queryFormatter(groupTypeId)
        if (groupTypeDataFromQuery.id) {
            fetchGroupTypeById(groupTypeDataFromQuery.id)
        }
    }, [groupTypeId])

    // Formatter fonksiyonu
    const queryFormatter = (groupTypeId) => {
        if (groupTypeId) {
            // groupTypeId örneği: "finance-6766de1f962f3e072e36bb1a"
            const parts = groupTypeId.split('-');

            const typeName = parts[0];
            const id = parts[1];

            return { typeName, id };
        }
        return {};
    };

    // Get User By ID
    const fetchGroupTypeById = async (groupTypeId) => {
        setLoading(true);

        // getGroupTypeById fonksiyonunu kullanarak group type'ı alıyoruz
        const result = await getGroupTypeById(groupTypeId);

        if (result.success) {
            setGroupType(result.data);
            setError(null);
        } else {
            setError(result.error);
            setGroupType(null);
        }

        setLoading(false);
    };

    return (
        <Container className={styles.profilePage}>
            <Row className="d-flex justify-content-center h-100">
                <Col md={4}>
                    <ProfileCard
                        groupType={groupType}
                        loading={loading}
                        error={error}
                        from={'view-group-types'}
                        fetchGroupTypeById={fetchGroupTypeById}
                    />
                </Col>
            </Row>
        </Container>
    );
};

export default UserDetailPage;
