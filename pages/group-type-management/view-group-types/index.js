import React, { useState, useEffect } from "react";
import { Spinner, Alert, Badge } from 'react-bootstrap';
import Table from "@/components/Common/Table";
import { getGroupTypes } from "@/services/groupTypeApi";
import { useTranslations } from "next-intl";

const UserGroups = () => {
    const t = useTranslations()
    const headers = ["Type Name", 'Created By', 'Updated By']
    const [groupTypeData, setGroupTypeData] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const [totalData, setTotalData] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)

    useEffect(() => {
        getAllGroupTypes(1, 5);
    }, [])

    const getAllGroupTypes = async (page, limit, search) => {
        setLoading(true);

        // API'ye gerekli parametrelerle istek gönder
        const result = await getGroupTypes({ page, limit, search });

        if (result.success) {
            setGroupTypeData(result.data);

            if (result.pagination) {
                setTotalData(result.pagination.totalData);
                setTotalPages(result.pagination.totalPages);
                setCurrentPage(result.pagination.currentPage);
            }

            setError(null);
        } else {
            setError(result.error);
            setGroupTypeData([]);
        }

        setLoading(false);
    };

    // Group verisini tabloya gönderilecek şekilde formatlıyoruz
    const formatGroupTypeData = (groupTypeData) => {
        const formattedData = groupTypeData.map(item => ({
            id: item._id,
            "Type Name": item.type_name,
            "Created By": item.created_by,
            "Updated By": item.updated_by,
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

    if (error || !groupTypeData) {
        return (
            <Alert variant="warning">{t("Group type data is not available Please try again later")}</Alert>
        )
    }

    return (
        <div>
            <Table
                headers={headers}
                data={formatGroupTypeData(groupTypeData)}
                itemsPerPage={5}
                from="view-group-types"
                getAllGroupTypes={getAllGroupTypes}
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
    const validationMessages = await import(`../../../public/locales/validation/${context.locale}.json`);

    return {
        props: {
            messages: {
                ...headerMessages.default,
                ...formMessages.default,
                ...validationMessages.default,
            },
        },
    };
}

export default UserGroups;