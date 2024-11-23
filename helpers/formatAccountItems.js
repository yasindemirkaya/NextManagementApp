import { Badge } from 'react-bootstrap';

export const formatAccountRole = (role) => (
    <Badge bg={
        role === 0 ? "secondary" : role === 1 ? "warning" : role === 2 ? "danger" : "secondary"
    }>
        {role === 0 ? "Standard User" : role === 1 ? "Admin" : role === 2 ? "Super Admin" : "Undefined Role"}
    </Badge>
);

export const formatAccountStatus = (status) => (
    <Badge bg={status === 1 ? "success" : "danger"}>
        {status === 1 ? "Active" : "Not Active"}
    </Badge>
);

export const formatAccountVerification = (verification) => (
    <Badge bg={verification === 1 ? "success" : "danger"}>
        {verification === 1 ? "Verified" : "Not Verified"}
    </Badge>
);