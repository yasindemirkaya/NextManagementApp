import React, { useState, useEffect } from "react";
import styles from "./index.module.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icons } from '@/static/icons';
import { Badge, Button } from 'react-bootstrap';
import Pagination from "../Pagination";
import { useRouter } from "next/router";
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';

const Table = ({ headers, data, itemsPerPage, from }) => {
    const [searchTerm, setSearchTerm] = useState(''); // Search metni
    const [sortedData, setSortedData] = useState([]); // Verilerin sortlanmış hali
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" }); // Sıralamanın hangi sütunda olduğunu ve sıralama yönünü tutar
    const loggedInUser = useSelector(state => state.user.user);

    const router = useRouter()

    // Başlangıçta sortedData'yı default şekilde data ile setliyoruz
    useEffect(() => {
        setSortedData(data);
    }, [data]);

    // Tablonun kullanıldığı sayfaya göre ekle butonunu özelleştirme
    const buttonCustomizer = (from) => {
        switch (from) {
            case 'view-users':
                return {
                    text: 'Add New User',
                    link: '/user-management/create-user'
                };
            case 'user-groups':
                return {
                    text: 'Add New User Group',
                    link: '/user-management/create-user-group'
                };
            default:
                return {
                    text: 'Add New Item',
                    link: '#'
                };
        }
    }

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

    // Satırın üzerine tıklandığında detay sayfasına yönlendirme
    const handleRowClick = (row) => {
        // Datayı Table hangi sayfada kullanılacaksa ona göre dizayn etmeliyiz.
        let Name, Surname, id, userRole, GroupName;

        switch (from) {
            case "view-users":
                ({ Name, Surname, id, userRole } = row);
                break;
            case "user-groups":
                // Boşluk içeren anahtar adı için köşeli parantez kullanımı
                GroupName = row["Group Name"];
                ({ id } = row);
                break;
            default:
                return;
        }

        if (userRole == 2 && loggedInUser.id !== id) {
            Swal.fire({
                title: 'Error',
                icon: 'error',
                text: "You are not allowed to update this data",
            });
        } else {
            let dynamicPath = "";

            // Dynamic path değerini table hangi sayfada kullanılacaksa ona göre dizayn etmeliyiz
            switch (from) {
                case "view-users":
                    dynamicPath = `/user-management/${from}/${Name.toLowerCase()}-${Surname.toLowerCase()}-${id}`;
                    break;
                case "user-groups":
                    // Boşlukları "-" ile değiştirerek URL dostu hale getiriyoruz
                    const formattedGroupName = GroupName.toLowerCase().replace(/\s+/g, "-");
                    dynamicPath = `/user-management/${from}/${formattedGroupName}-${id}`;
                    break;
                default:
                    return;
            }
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
            <div className={styles.searchContainer}>
                <input
                    type="text"
                    className={styles.searchInput}
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
                <Button variant="primary" type="submit" href={buttonCustomizer(from).link}>
                    <FontAwesomeIcon icon={icons.faPlusCircle} className="me-2" />
                    {buttonCustomizer(from).text}
                </Button>
            </div>

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
