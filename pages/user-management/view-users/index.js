import React, { useState, useEffect } from "react";
import { Spinner, Alert, Badge } from 'react-bootstrap';
import Table from "@/components/Common/Table";
import axios from "@/utils/axios";
import { isTokenExpiredClient } from "@/helpers/tokenVerifier";
import { mobileFormatter } from '@/helpers/mobileFormatter';
import { jwtDecode } from 'jwt-decode'

const ViewUsers = () => {
    const headers = ["Name", "Surname", "Email", 'Role', 'Mobile', 'Is Active', 'Is Verified']
    const [userData, setUserData] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    useEffect(() => {
        // Token varsa ve expire olmadıysa istek atabiliriz
        if (token && !isTokenExpiredClient(token)) {
            getUsers();
        }
    }, [])

    const getUsers = () => {
        setLoading(true)

        axios.get('/private/users/get-users', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                if (response.code === 1) {
                    setUserData(response.users);
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

    // Tokendan kullanıcı ID'sini elde et
    const getUserIdFromToken = (token) => {
        if (token) {
            const decoded = jwtDecode(token);
            return decoded.id;
        }
        return null;
    };

    // User verisini tabloya gönderilecek şekilde formatlıyoruz
    const formatUserData = (userData, token) => {
        const loggedInUserId = getUserIdFromToken(token)

        const formattedData = userData.map(user => ({
            id: user.id,
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
            isSelf: user.id == loggedInUserId
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
            <Table headers={headers} data={formatUserData(userData, token)} itemsPerPage={5} />
        </div>
    );
}

export default ViewUsers;