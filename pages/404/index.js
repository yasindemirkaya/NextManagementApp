import { Button } from 'react-bootstrap';
import { useRouter } from 'next/router';
import styles from './index.module.scss';
import NotFoundLayout from '@/components/Layouts/404';
import { useTranslations } from 'next-intl';

const NotFoundPage = () => {
    const router = useRouter();
    const t = useTranslations();

    const goHome = () => {
        router.push('/');
    };

    return (
        <NotFoundLayout>
            <h1 className={`text-primary ${styles.heading}`}>404</h1>
            <h3 className={styles.subheading}>{t("Page Not Found")}</h3>
            <p className={styles.description}>
                {t("Oops! The page you're looking for doesn't exist or has been moved")}
            </p>
            <Button className={styles.buttonClass} onClick={goHome} variant="primary" size="lg">
                {t("Go to Home")}
            </Button>
        </NotFoundLayout>
    );
};

export async function getStaticProps(context) {
    const commonMessages = await import(`../../public/locales/common/${context.locale}.json`);

    return {
        props: {
            messages: {
                ...commonMessages.default
            },
        },
    };
}

export default NotFoundPage;