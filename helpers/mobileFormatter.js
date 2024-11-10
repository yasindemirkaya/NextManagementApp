export const mobileFormatter = (phoneNumber) => {
    // Telefon numarasını temizle (sadece sayıları al)
    const cleaned = phoneNumber.replace(/\D/g, '');

    // Numara doğru uzunlukta ise formatla
    if (cleaned.length === 10) {
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)} ${cleaned.slice(6, 8)} ${cleaned.slice(8, 10)}`;
    }

    // Geçersiz numara ise geri dön
    return phoneNumber;
};