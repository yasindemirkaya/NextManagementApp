import React, { useState, useEffect } from "react";
import { Spinner, Alert } from 'react-bootstrap';
import Table from "@/components/Common/Table";
import { getDemands } from "@/services/demandApi";
import { useTranslations } from 'next-intl';

const ViewUsers = () => {
    const t = useTranslations();
    const headers = ["Demand Owner", "Title", "Description", "Start Date", 'End Date', 'Recipient', 'Status', 'Admin Response']
    const [demandData, setDemandData] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const [totalData, setTotalData] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)

    useEffect(() => {
        fetchDemands({ page: 1, limit: 10 });
    }, [])

    const fetchDemands = async (params) => {
        setLoading(true);
        const result = await getDemands(params);

        if (result.success) {
            setDemandData(result.data);
            if (result.pagination) {
                setTotalData(result.pagination.totalData)
                setTotalPages(result.pagination.totalPages)
                setCurrentPage(result.pagination.currentPage)
            }
            setError(null);
        } else {
            setError(result.error);
            setDemandData([]);
        }

        setLoading(false);
    };

    // Demand verisini tabloya gönderilecek şekilde formatlıyoruz
    const formatDemandData = (demandData) => {
        const formattedData = demandData.map(demand => ({
            id: demand._id,
            'Demand Owner': demand.userId.user,
            Title: t(demand.title),
            Description: demand.description,
            'Start Date': demand.start_date,
            'End Date': demand.end_date,
            'Recipient': demand.targetId?.user || t('Closed Demand'),
            'Status': t(demand.status.label),
            'Admin Response': demand.admin_response,
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

    if (error || !demandData) {
        return (
            <Alert variant="warning">{t("Demand data is not available Please try again later")}</Alert>
        )
    }

    return (
        <div>
            <Table
                headers={headers}
                data={formatDemandData(demandData)}
                itemsPerPage={5}
                from="view-demands"
                fetchDemands={fetchDemands}
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
    const responseMessages = await import(`../../../public/locales/response/${context.locale}.json`);
    const validationMessages = await import(`../../../public/locales/validation/${context.locale}.json`);

    return {
        props: {
            messages: {
                ...headerMessages.default,
                ...formMessages.default,
                ...responseMessages.default,
                ...validationMessages.default,
            },
        },
    };
}


export default ViewUsers;