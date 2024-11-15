import React from "react";
import styles from "./index.module.scss";

const Pagination = ({ totalPages, currentPage, onPageChange }) => {
    // Sayfa numarası aralığını hesaplamak için fonksiyon
    const getPaginationRange = () => {
        // << < ... 4 5 6 ... > >>
        const range = [];
        const maxPagesToShow = 5;

        // Eğer toplam sayfa sayısı maxPagesToShow'dan daha küçükse, tüm sayfaları göster
        if (totalPages <= maxPagesToShow) {
            for (let i = 1; i <= totalPages; i++) {
                range.push(i);
            }
        } else {
            // totalVisiblePages: gösterilecek toplam sayfa sayısı - 2 (ilk ve son sayfa için boşluk bırakıyoruz)
            const totalVisiblePages = maxPagesToShow - 2;
            const startPage = Math.max(1, currentPage - Math.floor(totalVisiblePages / 2));
            const endPage = Math.min(totalPages, currentPage + Math.floor(totalVisiblePages / 2));

            // Başlangıç ve bitiş sayfasını hesaplarken "..." eklemek için aralıkları oluşturuyoruz
            for (let i = startPage; i <= endPage; i++) {
                range.push(i);
            }

            // Eğer aralık başlangıç sayfasından büyükse "..." ekleyelim
            if (startPage > 1) range.unshift("...");
            // Eğer aralık bitiş sayfasından küçükse "..." ekleyelim
            if (endPage < totalPages) range.push("...");
        }

        return range;
    };

    // Pagination range'ini alıyoruz
    const paginationRange = getPaginationRange();

    const handlePageClick = (page) => {
        if (page !== currentPage && page >= 1 && page <= totalPages) {
            onPageChange(page);
        }
    };

    return (
        <div className={styles.pagination}>
            {/* First */}
            <button className={styles.pageButton} onClick={() => handlePageClick(1)} disabled={currentPage === 1}> &lt;&lt;</button>
            {/* Previous */}
            <button className={styles.pageButton} onClick={() => handlePageClick(currentPage - 1)} disabled={currentPage === 1} >&lt;</button>

            {/* Sayfa numaraları */}
            {paginationRange.map((page, index) => {
                if (page === "...") {
                    return <span key={index} className={styles.dots}>...</span>;
                }

                return (
                    <button
                        key={index}
                        className={`${styles.pageButton} ${currentPage === page ? styles.active : ""}`}
                        onClick={() => handlePageClick(page)}
                    >
                        {page}
                    </button>
                );
            })}

            {/* Next*/}
            <button className={styles.pageButton} onClick={() => handlePageClick(currentPage + 1)} disabled={currentPage === totalPages}>&gt;</button>
            {/* Last */}
            <button className={styles.pageButton} onClick={() => handlePageClick(totalPages)} disabled={currentPage === totalPages}>&gt;&gt;</button>
        </div>
    );
};

export default Pagination;
