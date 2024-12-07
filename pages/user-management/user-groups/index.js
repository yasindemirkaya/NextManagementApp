import React, { useState, useEffect } from "react";
import { Spinner, Alert, Badge } from 'react-bootstrap';
import Table from "@/components/Common/Table";
import axios from "@/utils/axios";
import { useSelector } from "react-redux";

const UserGroups = () => {
    const headers = ["Group Name", "Description", "Type", 'Group Leader', 'Created By', 'Last Updated By', 'Is Active']
    const [groupData, setGroupData] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        getUserGroups();
    }, [])

    const getUserGroups = () => {
        setLoading(true)

        axios.get('/private/groups/get-user-groups')
            .then(response => {
                if (response.code === 1) {
                    setGroupData(response.groups);
                    setLoading(false)
                    setError(null)
                }
            })
            .catch(error => {
                setGroupData([])
                setError(error.message);
                setLoading(false);
            });
    };

    // Group verisini tabloya gönderilecek şekilde formatlıyoruz
    const formatGroupData = (groupData) => {
        const formattedData = groupData.map(group => ({
            id: group.id,
            "Group Name": group.group_name,
            "Description": group.description,
            "Type": group.type,
            "Group Leader": group.group_leader,
            "Created By": group.created_by,
            "Last Updated By": group.updated_by,
            "Is Active": (
                <Badge bg={group.is_active ? "success" : "danger"}>
                    {group.is_active ? "Yes" : "No"}
                </Badge>
            ),
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

    if (error || !groupData) {
        return (
            <Alert variant="warning">Group data is not available. Please try again later.</Alert>
        )
    }

    return (
        <div>
            <Table headers={headers} data={formatGroupData(groupData)} itemsPerPage={5} from="user-groups" />
        </div>
    );
}

export default UserGroups;