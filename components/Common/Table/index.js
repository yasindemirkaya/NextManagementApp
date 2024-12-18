import React, { useEffect, useState } from "react";
import styles from "./index.module.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icons } from '@/static/icons';
import { Row, Col, Badge, Button, Pagination, Form, InputGroup } from 'react-bootstrap';
import { useRouter } from "next/router";
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import * as XLSX from 'xlsx'

const Table = ({ headers, data, itemsPerPage, from, totalPages, totalData, currentPage, fetchUsers, getUserGroups }) => {
    const [currentPageState, setCurrentPageState] = useState(currentPage);

    // Sorting
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
    const [sortedData, setSortedData] = useState(data);

    // Searching
    const [searchQuery, setSearchQuery] = useState("");

    const loggedInUser = useSelector(state => state.user.user);

    const router = useRouter()

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
            case 'view-user-groups':
                return {
                    text: 'Add New User Group',
                    link: '/group-management/user-groups/create-user-group'
                };
            default:
                return {
                    text: 'Add New Item',
                    link: '#'
                };
        }
    }

    // Sayfa değişimi
    const handlePageChange = (page) => {
        setCurrentPageState(page)

        switch (from) {
            case "view-users":
                fetchUsers({ page: page, limit: itemsPerPage });
                break;
            case "view-user-groups":
                getUserGroups(page, itemsPerPage)
                break;
            default:
                return;
        }
    };

    // Sütuna göre sıralama methodu
    const handleSort = (column) => {
        let direction = "asc";
        if (sortConfig.key === column && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key: column, direction });

        // Sıralama işlemi
        const sorted = [...data].sort((a, b) => {
            const aValue = a[column] || "";
            const bValue = b[column] || "";

            if (aValue < bValue) return direction === "asc" ? -1 : 1;
            if (aValue > bValue) return direction === "asc" ? 1 : -1;
            return 0;
        });

        setSortedData(sorted);
    };

    // Search
    const handleSearch = () => {
        if (searchQuery.length >= 3) {

            switch (from) {
                case "view-users":
                    let search = searchQuery
                    fetchUsers({ currentPage, itemsPerPage, search });
                    break;
                case "view-user-groups":
                    getUserGroups(currentPage, itemsPerPage, searchQuery);
                    break;
                default:
                    return;
            }
        }
    }

    // Clear search
    const handleClearSearch = () => {
        setSearchQuery(''); // Arama sorgusunu temizle

        switch (from) {
            case "view-users":
                getUsers(currentPage, itemsPerPage, '');
                break;
            case "view-user-groups":
                getUserGroups(currentPage, itemsPerPage, '')
                break;
            default:
                return;
        }
    };

    // Satırın üzerine tıklandığında detay sayfasına yönlendirme
    const handleRowClick = (row) => {
        // Datayı Table hangi sayfada kullanılacaksa ona göre dizayn etmeliyiz.
        let Name, Surname, id, userRole, GroupName;

        switch (from) {
            case "view-users":
                ({ Name, Surname, id, userRole } = row);
                break;
            case "view-user-groups":
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
                case "view-user-groups":
                    // Boşlukları "-" ile değiştirerek URL dostu hale getiriyoruz
                    const formattedGroupName = GroupName.toLowerCase().replace(/\s+/g, "-");
                    dynamicPath = `/group-management/user-groups/${from}/${formattedGroupName}-${id}`;
                    break;
                default:
                    return;
            }
            router.push(dynamicPath);
        }
    }

    // To format the data before exporting to excel
    const processExportData = (data, from) => {
        switch (from) {
            case 'view-users':
                return data.map((item) => ({
                    // id: item.id,
                    Name: item.Name,
                    Surname: item.Surname,
                    Email: item.Email,
                    Mobile: item.Mobile,
                    Role: item.Role?.props?.children || '',
                    'Is Active': item['Is Active']?.props?.children || '',
                    'Is Verified': item['Is Verified']?.props?.children || '',
                    // isSelf: item.isSelf ? 'Yes' : 'No',
                    // userRole: item.userRole,
                }));

            case 'view-user-groups':
                return data.map((item) => ({
                    id: item.id,
                    'Group Name': item['Group Name'],
                    'Group Leader': item['Group Leader'],
                    Description: item.Description,
                    'Created By': item['Created By'],
                    'Updated By': item['Updated By'],
                    Type: item.Type,
                    'Is Active': item['Is Active']?.props?.children || '',
                }));

            default:
                return {
                    text: 'Add New Item',
                    link: '#',
                };
        }
    };

    // Excel export method
    const exportToExcel = () => {
        const processedData = processExportData(data, from);

        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(processedData);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        XLSX.writeFile(workbook, `${from}-data.xlsx`);
    };

    return (
        <div className={styles.tableContainer}>
            {/* Search */}
            <div className={`d-flex justify-content-between ${styles.searchContainer}`}>
                {/* Search Input ve Button */}
                <InputGroup className={`${styles.inputGroup} me-3`} style={{ maxWidth: '400px' }}>
                    <Form.Control
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {/* Search */}
                    <InputGroup.Text style={{ cursor: "pointer" }} onClick={handleSearch}>
                        <FontAwesomeIcon icon={icons.faSearch} />
                    </InputGroup.Text>
                    {/* Clear Search */}
                    <Button variant="danger" onClick={handleClearSearch}>
                        <FontAwesomeIcon icon={icons.faDeleteLeft} />
                    </Button>
                </InputGroup>

                {/* Sağdaki Butonlar */}
                <div className="d-flex">
                    <Button variant="primary" type="submit" href={buttonCustomizer(from).link} className="me-2">
                        <FontAwesomeIcon icon={icons.faPlusCircle} className="me-2" />
                        {buttonCustomizer(from).text}
                    </Button>
                    <Button variant="success" onClick={exportToExcel}>
                        <FontAwesomeIcon icon={icons.faFileExcel} />
                    </Button>
                </div>
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
                    {sortedData.length === 0 ? (
                        <tr>
                            <td colSpan={headers.length} className={styles.noData}>
                                No data available
                            </td>
                        </tr>
                    ) : (
                        sortedData.map((row, rowIndex) => (
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

            <div className={styles.pageInfo}>
                There are {totalData} records in the table. Page {currentPage} of {totalPages} is currently displayed.
            </div>

            {/* Pagination */}
            <div className={styles.pagination}>
                <Pagination size="md">
                    <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPageState === 1} />
                    <Pagination.Prev onClick={() => handlePageChange(currentPageState - 1)} disabled={currentPageState === 1} />

                    {[...Array(totalPages)].map((_, index) => (
                        <Pagination.Item
                            key={index + 1}
                            active={index + 1 === currentPageState}
                            onClick={() => handlePageChange(index + 1)}
                        >
                            {index + 1}
                        </Pagination.Item>
                    ))}

                    <Pagination.Next onClick={() => handlePageChange(currentPageState + 1)} disabled={currentPageState === totalPages} />
                    <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPageState === totalPages} />
                </Pagination>
            </div>
        </div>
    );
};

export default Table;
