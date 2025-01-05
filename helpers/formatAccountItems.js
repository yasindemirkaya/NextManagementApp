import { Badge } from 'react-bootstrap';
const getLanguage = () => localStorage.getItem("language") || "en";

export const formatAccountRole = (role) => {
    const lang = getLanguage();
    return (
        <Badge
            bg={role === 0 ? "secondary" : role === 1 ? "warning" : role === 2 ? "danger" : "secondary"}
        >
            {role === 0
                ? lang === "en"
                    ? "Standard User"
                    : "Standart Kullanıcı"
                : role === 1
                    ? lang === "en"
                        ? "Admin"
                        : "Yönetici"
                    : role === 2
                        ? lang === "en"
                            ? "Super Admin"
                            : "Sistem Yetkilisi"
                        : lang === "en"
                            ? "Undefined Role"
                            : "Tanımsız Rol"}
        </Badge>
    );
};

export const formatAccountStatus = (status) => {
    const lang = getLanguage();
    return (
        <Badge bg={status ? "success" : "danger"}>
            {status
                ? lang === "en"
                    ? "Active"
                    : "Aktif"
                : lang === "en"
                    ? "Not Active"
                    : "Pasif"}
        </Badge>
    );
};

export const formatAccountVerification = (verification) => {
    const lang = getLanguage();
    return (
        <Badge bg={verification ? "success" : "danger"}>
            {verification
                ? lang === "en"
                    ? "Verified"
                    : "Doğrulandı"
                : lang === "en"
                    ? "Not Verified"
                    : "Doğrulanmadı"}
        </Badge>
    );
};