import React, { useState, useEffect } from "react";
import styles from "./index.module.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icons } from '@/static/icons';
import { Badge } from 'react-bootstrap';
import Pagination from "../Pagination";
import { useRouter } from "next/router";
import Swal from 'sweetalert2';

const Table = ({ headers, data, itemsPerPage }) => {
    const [searchTerm, setSearchTerm] = useState(''); // Search metni
    const [sortedData, setSortedData] = useState([]); // Verilerin sortlanmış hali
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" }); // Sıralamanın hangi sütunda olduğunu ve sıralama yönünü tutar

    const router = useRouter()

    // Başlangıçta sortedData'yı default şekilde data ile setliyoruz
    useEffect(() => {
        setSortedData(data);
    }, [data]);

    // Search methodu
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        // Arama sonucu 1. sayfada gösterilmeli
        setCurrentPage(1);
    };

    // Sayfa değişimi
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Sıralama methodu
    const handleSort = (column) => {
        const newSortConfig = { ...sortConfig };
        // Eğer aynı sütuna tekrar tıklanırsa sırayla asc ve desc arasında geçiş yapılır
        if (newSortConfig.key === column) {
            newSortConfig.direction = newSortConfig.direction === "asc" ? "desc" : "asc";
        }
        // Başka sütuna tıklanırsa önce asc sıralama yapılır
        else {
            newSortConfig.key = column;
            newSortConfig.direction = "asc";
        }
        setSortConfig(newSortConfig);
    };

    // Data sıralama
    const getSortedData = () => {
        const sorted = [...sortedData];
        // asc seçili ise önce küçük değerler, desc seçili ise önce büyük değerler olacak şekilde sort yapılır
        if (sortConfig.key) {
            sorted.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "asc" ? -1 : 1;
                if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "asc" ? 1 : -1;
                return 0;
            });
        }
        return sorted;
    };

    // Kullanıcının üzerine tıklandığında user detail sayfasına yönlendirme
    const handleRowClick = (row) => {
        const { Name, Surname, id, userRole } = row;

        if (userRole == 2) {
            Swal.fire({
                title: 'Error',
                icon: 'error',
                text: "You are not allowed to update this user's account.",
            });
        } else {
            const dynamicPath = `/user-management/view-users/${Name.toLowerCase()}-${Surname.toLowerCase()}-${id}`;
            router.push(dynamicPath);
        }
    }

    // Sıralanan veriler arasında filtreleme
    const filteredData = getSortedData().filter((item) =>
        Object.values(item).some((value) =>
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const currentData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className={styles.tableContainer}>
            {/* Search */}
            <input
                type="text"
                className={styles.searchInput}
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearchChange}
            />

            {/* Table */}
            <table className={styles.table}>
                {/* Head */}
                <thead>
                    <tr>
                        {headers.map((header, index) => (
                            <th
                                key={index}
                                onClick={() => handleSort(header)}
                                className={`${styles.tableHeader} ${sortConfig.key === header ? styles.activeSort : ""}`}
                            >
                                {header}
                                {sortConfig.key === header && (
                                    <FontAwesomeIcon
                                        icon={sortConfig.direction === "asc" ? icons.faChevronUp : icons.faChevronDown}
                                        className={styles.sortIcon}
                                    />
                                )}
                            </th>
                        ))}
                    </tr>
                </thead>
                {/* Body */}
                <tbody>
                    {currentData.length === 0 ? (
                        <tr>
                            <td colSpan={headers.length} className={styles.noData}>
                                No data available
                            </td>
                        </tr>
                    ) : (
                        currentData.map((row, rowIndex) => (
                            <tr
                                key={rowIndex}
                                className={styles.tableRow}
                                onClick={() => handleRowClick(row)}
                            >
                                {headers.map((header, colIndex) => (
                                    <td key={colIndex} className={styles.tableCell}>
                                        {row[header] || "-"}
                                        {row.isSelf && header === "Name" && (
                                            <Badge bg="success" className={styles.selfBadge}>Self</Badge>
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {/* Pagination */}
            <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={handlePageChange}
            />
        </div >
    );
};

export default Table;
