import { useTranslations } from "next-intl";
import { useState } from "react";
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

const ThemeSettings = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const t = useTranslations();

    const theme = useSelector(state => state.settings.userSettings.theme);

    const themeOptions = [
        { value: "light", label: t("Light Theme") },
        { value: "dark", label: t("Dark Theme") }
    ];

    // Create or Update User Settings (Theme)
    const updateUserSettings = async (selectedTheme) => {
        const result = await createUserSettings({ theme: selectedTheme });

        if (result.success) {
            toast('SUCCESS', result.message)
        } else {
            toast('SUCCESS', result.error)
        }
    };

    const handleThemeChange = (selectedOption) => {
        const selectedTheme = selectedOption.value;
        dispatch(setUserSettings({
            theme: selectedTheme,
        }));

        updateUserSettings(selectedTheme);
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
                    <h5>{t("Theme Settings")}</h5>
                    <p>{t("Here you can choose the default theme that will be opened every time you log in to the system")}</p>

                    <Select
                        options={themeOptions}
                        value={themeOptions.find(option => option.value === theme)}
                        onChange={handleThemeChange}
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

export default ThemeSettings;