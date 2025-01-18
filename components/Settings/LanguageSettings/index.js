import { useTranslations } from "next-intl";
import { Container, Row, Col } from "react-bootstrap";
import Select from "react-select";
import styles from './index.module.scss';
import toast from '@/utils/toastify';
import { ToastContainer } from 'react-toastify';

import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { clearUser } from '@/redux/userSlice';
import { setUserSettings } from "@/redux/settingsSlice";
import Cookies from 'js-cookie';

import { createUserSettings } from '@/services/userSettingsApi';

const LanguageSettings = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const t = useTranslations();

    const language = useSelector(state => state.settings.userSettings.language);

    const languageOptions = [
        { value: "tr", label: t("Turkish") },
        { value: "en", label: t("English") }
    ];

    // Create or Update User Settings (Language)
    const updateUserSettings = async (selectedLanguage) => {
        const result = await createUserSettings({ language: selectedLanguage });

        if (result.success) {
            toast('SUCCESS', result.message)
        } else {
            toast('SUCCESS', result.error)
        }
    };

    // On language change
    const handleLanguageChange = (selectedOption) => {
        const selectedLanguage = selectedOption.value;
        dispatch(setUserSettings({
            language: selectedLanguage,
        }));

        updateUserSettings(selectedLanguage);
    };

    // Handle logout
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
                        <em>{t("You must log in again for the changes to take effect")}</em>
                    </span>
                </Col>
            </Row>
            <ToastContainer />
        </Container>
    );
};

export default LanguageSettings;