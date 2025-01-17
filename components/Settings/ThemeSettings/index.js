import { useTranslations } from "next-intl";
import { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Select from "react-select";
import styles from './index.module.scss';

const ThemeSettings = () => {
    const t = useTranslations();
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

    const themeOptions = [
        { value: "0", label: t("Light Theme") },
        { value: "1", label: t("Dark Theme") }
    ];

    const handleThemeChange = (selectedOption) => {
        const selectedTheme = selectedOption.value;
        setTheme(selectedTheme);
        localStorage.setItem("theme", selectedTheme);
    };

    return (
        <Container>
            <Row>
                <Col md={12}>
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
                </Col>
            </Row>
        </Container>
    );
};

export default ThemeSettings;