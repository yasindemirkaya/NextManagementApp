export async function getLang(locale) {
    const messages = await import(`../public/locales/${locale}.json`);
    return messages.default;
}