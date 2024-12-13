import React, { useState, useEffect } from "react";
import { Spinner, Alert, Badge } from 'react-bootstrap';
import Table from "@/components/Common/Table";
import axios from "@/utils/axios";
import { mobileFormatter } from '@/helpers/mobileFormatter';
import { useSelector } from "react-redux";

const ViewUsers = () => {
    const headers = ["Name", "Surname", "Email", 'Role', 'Mobile', 'Is Active', 'Is Verified']
    const [userData, setUserData] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const [totalData, setTotalData] = useState(0)
    const [totalPages, setTotalPages] = useState(0)

    const loggedInUser = useSelector(state => state.user.user);

    useEffect(() => {
        getUsers(1, 10);
    }, [])

    const getUsers = (page, limit) => {
        setLoading(true)

        axios.get('/private/users/get-users', {
            params: {
                page: page,
                limit: limit
            }
        })
            .then(response => {
                if (response.code === 1) {
                    setUserData(response.users);
                    setTotalData(response.totalData);
                    setTotalPages(response.totalPages);
                    setLoading(false)
                    setError(null)
                }
            })
            .catch(error => {
                setUserData([])
                setError(error.message);
                setLoading(false);
            });
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
            isSelf: loggedInUser ? user.id == loggedInUser.id : null,
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
            <Table headers={headers} data={formatUserData(userData)} itemsPerPage={5} from="view-users" getUsers={getUsers} totalData={totalData} totalPages={totalPages} />
        </div>
    );
}

export default ViewUsers;