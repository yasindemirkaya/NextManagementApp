import { Container, Button } from 'react-bootstrap';
import { useRouter } from 'next/router';
import styles from './index.module.scss';
import NotFoundLayout from '@/components/Layouts/404';

const NotFoundPage = () => {
    const router = useRouter();

    const goHome = () => {
        router.push('/');
    };

    return (
        <NotFoundLayout>
            <h1 className={`text-primary ${styles.heading}`}>404</h1>
            <h3 className={styles.subheading}>Page Not Found</h3>
            <p className={styles.description}>
                Oops! The page you're looking for doesn't exist or has been moved.
            </p>
            <Button className={styles.buttonClass} onClick={goHome} variant="primary" size="lg">
                Go to Home
            </Button>
        </NotFoundLayout>
    );
};

export default NotFoundPage;