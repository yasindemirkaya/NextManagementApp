import React, { useState, useEffect } from "react";
import { Spinner, Alert } from 'react-bootstrap';
import Table from "@/components/Common/Table";
import axios from "@/utils/axios";
import { isTokenExpiredClient } from "@/helpers/tokenVerifier";

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

    const formatUserData = (userData) => {
        const formattedData = userData.map(user => ({
            Name: user.first_name,
            Surname: user.last_name,
            Email: user.email,
            Role: user.role === 2 ? "Super Admin" : user.role === 1 ? "Admin" : "Standard User",
            Mobile: user.mobile,
            "Is Active": user.is_active ? "Yes" : "No",
            "Is Verified": user.is_verified ? "Yes" : "No"
        }))
        return formattedData
    }

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
            <Table headers={headers} data={formatUserData(userData)} itemsPerPage={5} />
        </div>
    );
}

export default ViewUsers;