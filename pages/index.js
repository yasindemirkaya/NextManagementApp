import React, { useEffect } from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import { useRouter } from 'next/router';
import styles from './index.module.scss';
import { isTokenExpiredClient } from '@/helpers/tokenVerifier';


const Home = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');

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

  return (
    <Container className={`mt-5 ${styles.homeContainer}`}>
      <Card className="text-center">
        <Card.Header>Welcome</Card.Header>
        <Card.Body>
          <Card.Title>Get Started</Card.Title>
          <Card.Text>
            Please login or register to continue.
          </Card.Text>
          <Button variant="primary" onClick={handleLogin} className="me-2">
            Login
          </Button>
          <Button variant="secondary" onClick={handleRegister}>
            Register
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Home;