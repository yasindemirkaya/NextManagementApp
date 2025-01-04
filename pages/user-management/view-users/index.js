import React, { useState, useEffect } from "react";
import { Spinner, Alert, Badge } from 'react-bootstrap';
import Table from "@/components/Common/Table";
import { mobileFormatter } from '@/helpers/mobileFormatter';
import { useSelector } from "react-redux";
import { getUsers } from "@/services/userApi";
import { useTranslations } from 'next-intl';

const ViewUsers = () => {
    const t = useTranslations();
    const headers = ["Name", "Surname", "Email", 'Role', 'Mobile', 'Is Active', 'Is Verified']
    const [userData, setUserData] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const [totalData, setTotalData] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)

    const loggedInUser = useSelector(state => state.user.user);

    useEffect(() => {
        fetchUsers({ page: 1, limit: 10 });
    }, [])

    const fetchUsers = async (params) => {
        setLoading(true);
        const result = await getUsers(params);

        if (result.success) {
            setUserData(result.data);
            if (result.pagination) {
                setTotalData(result.pagination.totalData)
                setTotalPages(result.pagination.totalPages)
                setCurrentPage(result.pagination.currentPage)
            }
            setError(null);
        } else {
            setError(result.error);
            setUserData([]);
        }

        setLoading(false);
    };

    // User verisini tabloya gönderilecek şekilde formatlıyoruz
    const formatUserData = (userData) => {
        const formattedData = userData.map(user => ({
            id: user._id,
            Name: user.first_name,
            Surname: user.last_name,
            Email: user.email,
            Role: (
                <Badge bg={user.role === 2 ? "danger" : user.role === 1 ? "warning" : "secondary"}>
                    {user.role === 2 ? "Super Admin" : user.role === 1 ? "Admin" : "Standard User"}
                </Badge>
            ),
            Mobile: mobileFormatter(user.mobile),
            "Is Active": (
                <Badge bg={user.is_active ? "success" : "danger"}>
                    {user.is_active ? "Yes" : "No"}
                </Badge>
            ),
            "Is Verified": (
                <Badge bg={user.is_verified ? "success" : "danger"}>
                    {user.is_verified ? "Yes" : "No"}
                </Badge>
            ),
            isSelf: loggedInUser ? user._id == loggedInUser.id : null,
            userRole: user.role,
        }));
        return formattedData;
    };

    if (loading) {
        return (
            <div>
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    if (error || !userData) {
        return (
            <Alert variant="warning">User data is not available. Please try again later.</Alert>
        )
    }

    return (
        <div>
            <Table
                headers={headers}
                data={formatUserData(userData)}
                itemsPerPage={5}
                from="view-users"
                fetchUsers={fetchUsers}
                totalData={totalData}
                totalPages={totalPages}
                currentPage={currentPage}
            />
        </div>
    );
}

export async function getStaticProps(context) {
    const headerMessages = await import(`../../../public/locales/common/${context.locale}.json`);
    const formMessages = await import(`../../../public/locales/form/${context.locale}.json`);

    return {
        props: {
            messages: {
                ...headerMessages.default,
                ...formMessages.default,
            },
        },
    };
}


export default ViewUsers;