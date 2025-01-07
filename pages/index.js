import React, { useEffect } from 'react';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import { useRouter } from 'next/router';
import styles from './index.module.scss';
import { isTokenExpiredClient } from '@/helpers/tokenVerifier';
import Cookies from 'js-cookie';
import { useTranslations } from 'next-intl';

const Home = () => {
  const t = useTranslations();
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('token');

    if (token && !isTokenExpiredClient(token)) {
      router.push('/dashboard');
    }
  }, [router]);

  const handleLogin = () => {
    router.push('/login');
  };

  const handleRegister = () => {
    router.push('/register');
  };

  // Change language
  const changeLanguage = (lang) => {
    localStorage.setItem("language", lang);
    router.push(router.asPath, router.asPath, { locale: lang });
  };

  return (
    <>
      <Row>
        <Col md={12} className="d-flex justify-content-center justify-content-md-end">
          <Button
            variant="link"
            onClick={() => changeLanguage(router.locale === 'en' ? 'tr' : 'en')}
            className={styles.languageSwitch}
          >
            {router.locale === 'en' ? 'EN' : 'TR'}
          </Button>
        </Col>
      </Row>
      <Container className={`mt-5 ${styles.homeContainer}`}>
        <Card className="text-center">
          <Card.Header>{t("Welcome")}</Card.Header>
          <Card.Body>
            <Card.Title>{t("Get Started")}</Card.Title>
            <Card.Text>
              {t("Please login or register to continue")}
            </Card.Text>
            <Button variant="primary" onClick={handleLogin} className="me-2">
              {t("Login")}
            </Button>
            <Button variant="secondary" onClick={handleRegister}>
              {t("Register")}
            </Button>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export async function getStaticProps(context) {
  const authMessages = await import(`../public/locales/auth/${context.locale}.json`);
  const formMessages = await import(`../public/locales/form/${context.locale}.json`);
  const commonMessages = await import(`../public/locales/common/${context.locale}.json`);
  const validationMessages = await import(`../public/locales/validation/${context.locale}.json`);

  return {
    props: {
      messages: {
        ...authMessages.default,
        ...formMessages.default,
        ...commonMessages.default,
        ...validationMessages.default,
      },
    },
  };
}

export default Home;