import { Container, Button } from 'react-bootstrap';
import { useRouter } from 'next/router';
import styles from './index.module.scss';

const ErrorPage = () => {
    const router = useRouter();

    const goHome = () => {
        router.push('/');
    };

    return (
        <Container className={`d-flex flex-column justify-content-center align-items-center ${styles.errorContainer}`}>
            <h1 className={`text-danger ${styles.heading}`}>Oops!</h1>
            <h3 className={styles.subheading}>Something went wrong</h3>
            <p className={styles.description}>
                We're sorry, but an error occurred while processing your request. Please try again later.
            </p>
            <Button className={styles.buttonClass} onClick={goHome} variant="danger" size="lg">
                Go to Home
            </Button>
        </Container>
    );
};

export default ErrorPage;