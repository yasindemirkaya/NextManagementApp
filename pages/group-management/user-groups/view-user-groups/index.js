import React, { useState, useEffect } from "react";
import { Spinner, Alert, Badge } from 'react-bootstrap';
import Table from "@/components/Common/Table";
import { getAllUserGroups } from '@/services/userGroupApi';

const UserGroups = () => {
    const headers = ["Group Name", "Description", "Type", 'Group Leader', 'Created By', 'Updated By', 'Is Active']
    const [groupData, setGroupData] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const [totalData, setTotalData] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)

    useEffect(() => {
        getUserGroups(1, 5);
    }, [])

    const getUserGroups = async (page, limit, search) => {
        setLoading(true);

        // İstek atmak için gerekli parametreleri oluştur
        const params = {
            page: page,
            limit: limit,
            search: search,
        };

        // API metodunu çağır ve sonucu al
        const result = await getAllUserGroups(params);

        if (result.success) {
            setGroupData(result.data);

            if (result.pagination) {
                setTotalData(result.pagination.totalData);
                setTotalPages(result.pagination.totalPages);
                setCurrentPage(result.pagination.currentPage);
            }

            setError(null);
        } else {
            setError(result.error);
            setGroupData([]);
        }

        setLoading(false);
    };

    // Group verisini tabloya gönderilecek şekilde formatlıyoruz
    const formatGroupData = (groupData) => {
        const formattedData = groupData.map(group => ({
            id: group._id,
            "Group Name": group.group_name,
            "Description": group.description,
            "Type": group.type,
            "Group Leader": group.group_leader,
            "Created By": group.created_by,
            "Updated By": group.updated_by,
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
            <Table
                headers={headers}
                data={formatGroupData(groupData)}
                itemsPerPage={5}
                from="view-user-groups"
                getUserGroups={getUserGroups}
                totalData={totalData}
                totalPages={totalPages}
                currentPage={currentPage}
            />
        </div>
    );
}

export async function getStaticProps(context) {
    const headerMessages = await import(`../../../../public/locales/common/${context.locale}.json`);
    const formMessages = await import(`../../../../public/locales/form/${context.locale}.json`);

    return {
        props: {
            messages: {
                ...headerMessages.default,
                ...formMessages.default,
            },
        },
    };
}

export default UserGroups;