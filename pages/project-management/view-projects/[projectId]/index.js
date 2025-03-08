import { getProjectById } from "@/services/projectApi";

import { useRouter } from "next/router";
import { useTranslations } from "next-intl";

import { useEffect, useState } from "react";
import { Container, Row, Col, Alert, Card } from "react-bootstrap";

import toast from '@/utils/toastify';
import { ToastContainer } from 'react-toastify';

import ProjectCard from "@/components/ProjectManagement/ViewProjects/ProjectCard";
import UserAndGroupManagement from "@/components/ProjectManagement/ViewProjects/UserAndGroupManagement";

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
            <Container>
                <Row>
                    {/* Left Column - ProjectCard */}
                    <Col md={4} className="mb-4">
                        <ProjectCard project={project} fetchProjectDetails={fetchProjectDetails} />
                    </Col>

                    {/* Middle Column - User and Group Management (Placeholder) */}
                    <Col md={4} className="mb-4">
                        <UserAndGroupManagement project={project} fetchProjectDetails={fetchProjectDetails} />
                    </Col>

                    {/* Right Column - Task Creation (Placeholder) */}
                    <Col md={4} className="mb-4">
                        <Card>
                            <Card.Body>
                                <Card.Title>Create Task</Card.Title>
                                {/* İçerik buraya gelecek */}
                            </Card.Body>
                        </Card>
                    </Col>

                    <ToastContainer />
                </Row>
            </Container>
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