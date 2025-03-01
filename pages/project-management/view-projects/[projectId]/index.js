import { getProjectById } from "@/services/projectApi";

import { useRouter } from "next/router";
import { useTranslations } from "next-intl";

import { useEffect, useState } from "react";
import { Container, Row, Col, Alert } from "react-bootstrap";

import toast from '@/utils/toastify';
import { ToastContainer } from 'react-toastify';

const ProjectDetailPage = () => {
    const router = useRouter();
    const t = useTranslations();

    const { projectId } = router.query;

    const [project, setProject] = useState({})
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    // Get Project by ID
    const fetchProjectDetails = async (projectId) => {
        const result = await getProjectById(projectId)

        if (result.success) {
            setLoading(false)
            setProject(result.data)
        } else {
            setLoading(false)
            setError(result.error)
            toast('ERROR', result.error)
        }
    }

    useEffect(() => {
        fetchProjectDetails(projectId)
    }, [])

    // Error
    if (error) {
        return <Alert variant="danger">{t('An error occurred when fetching the requested project Please try again')}</Alert>;
    }

    return (
        <>
            Project Detail {projectId}
            <ToastContainer />
        </>
    )
}

export async function getStaticPaths() {
    return {
        paths: [], // Başlangıçta hiçbir sayfa oluşturulmayacak
        fallback: 'blocking', // İlk ziyaret sırasında sayfa oluşturulacak
    };
}

export async function getStaticProps(context) {
    const formMessages = await import(`../../../../public/locales/form/${context.locale}.json`);
    const commonMessages = await import(`../../../../public/locales/common/${context.locale}.json`);
    const validationMessages = await import(`../../../../public/locales/validation/${context.locale}.json`);

    return {
        props: {
            messages: {
                ...formMessages.default,
                ...commonMessages.default,
                ...validationMessages.default,
            },
        },
    };
}

export default ProjectDetailPage;