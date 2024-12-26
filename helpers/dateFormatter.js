export const formatDate = (date) => {
    if (!date) return null;

    // Date objesini oluşturur (gerekirse string'i Date objesine çevirir)
    const parsedDate = new Date(date);

    // Tarih geçerli mi kontrolü yap
    if (isNaN(parsedDate)) return null;

    // Yıl, ay ve gün bilgisini al
    const year = parsedDate.getFullYear();
    const month = String(parsedDate.getMonth() + 1).padStart(2, '0'); // Ay 0-11 arası olduğu için 1 ekliyoruz
    const day = String(parsedDate.getDate()).padStart(2, '0'); // Gün bilgisini 2 haneli yapıyoruz

    // "YYYY-MM-DD" formatında tarihi döndür
    return `${year}-${month}-${day}`;
};