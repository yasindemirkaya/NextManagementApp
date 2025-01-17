import { useTranslations } from "next-intl";
import { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Select from "react-select";
import styles from './index.module.scss';

import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { clearUser } from '@/redux/userSlice';
import Cookies from 'js-cookie';

const LanguageSettings = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const t = useTranslations();
    const [language, setLanguage] = useState(localStorage.getItem("language") || "tr");

    const languageOptions = [
        { value: "0", label: t("Turkish") },
        { value: "1", label: t("English") }
    ];

    const handleLanguageChange = (selectedOption) => {
        const selectedLanguage = selectedOption.value;
        setLanguage(selectedLanguage);
        localStorage.setItem("language", selectedLanguage);
    };

    const handleLogout = () => {
        Cookies.remove('token');
        dispatch(clearUser());
        router.push('/login');
    };

    return (
        <Container>
            <Row>
                <Col md={12} className={styles.colContainer}>
                    <h5>{t("Language Settings")}</h5>
                    <p>{t("Here you can choose the default language that will be opened every time you log in to the system")}</p>

                    <Select
                        options={languageOptions}
                        value={languageOptions.find(option => option.value === language)}
                        onChange={handleLanguageChange}
                        className={styles.formControl}
                        classNamePrefix="select"
                        theme={(theme) => ({
                            ...theme,
                            colors: {
                                ...theme.colors,
                                primary25: 'var(--primary-25)',
                                primary: 'var(--primary)',
                                neutral0: 'var(--neutral-0)',
                                neutral80: 'var(--neutral-80)',
                                neutral25: 'var(--neutral-25)',
                            },
                        })}
                    />

                    <span className={`${styles.infoText} text-danger`} onClick={handleLogout}>
                        <em>{t("Değişikliklerin geçerli olması için yeniden giriş yapmanız gereklidir")}</em>
                    </span>
                </Col>
            </Row>
        </Container>
    );
};

export default LanguageSettings;