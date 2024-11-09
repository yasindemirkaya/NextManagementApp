import { Container } from 'react-bootstrap';

const NotFoundLayout = ({ children }) => {
    return (
        <Container className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            {children}
        </Container>
    );
};

export default NotFoundLayout;