import { Badge } from 'react-bootstrap';

export const formatAccountRole = (role, language) => {
    return (
        <Badge
            bg={role === 0 ? "secondary" : role === 1 ? "warning" : role === 2 ? "danger" : "secondary"}
        >
            {role === 0
                ? language === "en"
                    ? "Standard User"
                    : "Standart Kullanıcı"
                : role === 1
                    ? language === "en"
                        ? "Admin"
                        : "Yönetici"
                    : role === 2
                        ? language === "en"
                            ? "Super Admin"
                            : "Sistem Yetkilisi"
                        : language === "en"
                            ? "Undefined Role"
                            : "Tanımsız Rol"}
        </Badge>
    );
};

export const formatAccountStatus = (status, language) => {
    return (
        <Badge bg={status ? "success" : "danger"}>
            {status
                ? language === "en"
                    ? "Active"
                    : "Aktif"
                : language === "en"
                    ? "Not Active"
                    : "Pasif"}
        </Badge>
    );
};

export const formatAccountVerification = (verification, language) => {
    return (
        <Badge bg={verification ? "success" : "danger"}>
            {verification
                ? language === "en"
                    ? "Verified"
                    : "Doğrulandı"
                : language === "en"
                    ? "Not Verified"
                    : "Doğrulanmadı"}
        </Badge>
    );
};