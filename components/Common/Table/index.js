import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import styles from "./index.module.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icons } from '@/static/icons';
import { Badge, Button, Pagination, Form, InputGroup } from 'react-bootstrap';
import { useRouter } from "next/router";
import { useSelector } from 'react-redux';
import * as XLSX from 'xlsx'
import toast from '@/utils/toastify';
import { ToastContainer } from 'react-toastify';
import { useTranslations } from "next-intl";

const UpdateDemandModal = dynamic(() => import("@/components/Demands/UpdateDemand"), {
    ssr: false
});

const Table = ({ headers, data, itemsPerPage, from, totalPages, totalData, currentPage, fetchUsers, getUserGroups, getAllGroupTypes, fetchDemands }) => {
    // Update demand states
    const [showModal, setShowModal] = useState(false);
    const [demandData, setDemandData] = useState({});

    const [currentPageState, setCurrentPageState] = useState(currentPage);

    // Sorting
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
    const [sortedData, setSortedData] = useState(data);

    // Searching
    const [searchQuery, setSearchQuery] = useState("");

    const loggedInUser = useSelector(state => state.user.user);

    const router = useRouter()
    const t = useTranslations()

    useEffect(() => {
        setSortedData(data);
    }, [data]);

    // Tablonun kullanıldığı sayfaya göre ekle butonunu özelleştirme
    const buttonCustomizer = (from) => {
        switch (from) {
            case 'view-users':
                return {
                    text: t('Add New User'),
                    link: '/user-management/create-user'
                };
            case 'view-user-groups':
                return {
                    text: t('Add New User Group'),
                    link: '/group-management/user-groups/create-user-group'
                };
            case 'view-group-types':
                return {
                    text: t('Add New Group Type'),
                    link: '/group-type-management/create-group-type'
                };
            case 'view-demands':
                return {
                    text: t('Add New Demand'),
                    link: '/demands/create-demand'
                }
            default:
                return {
                    text: t('Add New Item'),
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
            case 'view-group-types':
                getAllGroupTypes(page, itemsPerPage)
                break;
            case 'view-demands':
                fetchDemands({ page: page, limit: itemsPerPage })
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
                    fetchUsers({ page: '', limit: '', search: searchQuery });
                    break;
                case "view-user-groups":
                    getUserGroups(currentPage, itemsPerPage, searchQuery);
                    break;
                case "view-group-types":
                    getAllGroupTypes(currentPage, itemsPerPage, searchQuery);
                    break;
                case "view-demands":
                    fetchDemands({ page: '', limit: '', search: searchQuery });
                default:
                    return;
            }
        }
    }

    // Clear search
    const handleClearSearch = () => {
        setSearchQuery("");

        switch (from) {
            case "view-users":
                fetchUsers({ page: 1, limit: 5, search: '' });
                break;
            case "view-user-groups":
                getUserGroups(currentPage, itemsPerPage, '')
                break;
            case "view-group-types":
                getAllGroupTypes(currentPage, itemsPerPage, '')
                break;
            case "view-demands":
                fetchDemands({ page: 1, limit: 5, search: '' })
            default:
                return;
        }
    };

    // Satırın üzerine tıklandığında detay sayfasına yönlendirme
    const handleRowClick = (row) => {
        // Datayı Table hangi sayfada kullanılacaksa ona göre dizayn etmeliyiz.
        let Name, Surname, id, userRole, GroupName, TypeName;

        switch (from) {
            case "view-users":
                ({ Name, Surname, id, userRole } = row);
                break;
            case "view-user-groups":
                // Boşluk içeren anahtar adı için köşeli parantez kullanımı
                GroupName = row["Group Name"];
                ({ id } = row);
                break;
            case "view-group-types":
                // Boşluk içeren anahtar adı için köşeli parantez kullanımı
                TypeName = row["Type Name"];
                ({ id } = row);
                break;
            // View demands için sayfa yönlendirmesi yok, modal açarak update yaptırıyoruz
            case "view-demands":
                if (loggedInUser.role !== 0) {
                    if (loggedInUser.role === 1 && (row.Status == "Sistem Yetkilisi Onayında" || row.Status == "Pending Super Admin Approval")) {
                        toast('ERROR', t('This demand cannot be updated as it is awaiting super admin approval'));
                        return;
                    }
                    if (loggedInUser.role === 2 && row.Status == "Kabul Edildi" || row.Status == "Accepted" || row.Status == "Rejected" || row.Status == "Reddedildi") {
                        toast('ERROR', t('This demand cannot be updated as it already accepted or rejected'))
                        return;
                    }
                    setDemandData(row);
                    setShowModal(true);
                } else {
                    toast('ERROR', t('You are not allowed to update this demand'))
                }

                return;
            default:
                return;
        }

        if (userRole == 2 && loggedInUser.id !== id) {
            toast('ERROR', t('You are not allowed to update this data'));
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
                case "view-group-types":
                    // Boşlukları "-" ile değiştirerek URL dostu hale getiriyoruz
                    const formattedTypeName = TypeName.toLowerCase().replace(/\s+/g, "-");
                    dynamicPath = `/group-type-management/${from}/${formattedTypeName}-${id}`;
                    break;
                case "view-demands":
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
                    'Name': item.Name,
                    'Surname': item.Surname,
                    'Email': item.Email,
                    'Mobile': item.Mobile,
                    'Role': item.Role?.props?.children || '',
                    'Is Active': item['Is Active']?.props?.children || '',
                    'Is Verified': item['Is Verified']?.props?.children || '',
                    // isSelf: item.isSelf ? t('Yes') : t('No'),
                    // userRole: item.userRole,
                }));

            case 'view-user-groups':
                return data.map((item) => ({
                    // id: item.id,
                    'Group Name': item['Group Name'],
                    'Group Leader': item['Group Leader'],
                    'Description': item.Description,
                    'Created By': item['Created By'],
                    'Updated By': item['Updated By'],
                    'Type': item.Type,
                    'Is Active': item['Is Active']?.props?.children || '',
                }));

            case 'view-group-types':
                return data.map((item) => ({
                    // id: item.id,
                    'Type Name': item['Type Name'],
                    'Created By': item['Created By'],
                    'Updated By': item['Updated By'],
                }));
            case 'view-demands':
                return data.map((item) => ({
                    // id: item.id,
                    'Title': item['Title'],
                    'Description': item['Description'],
                    'Start Date': item['Start Date'],
                    'End Date': item['End Date'],
                    'Recipient': item['Recipient'],
                    'Status': item['Status'],
                    'Admin Response': item['Admin Response']
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

    // Show past demands
    const handleShowPastDemandsClick = () => {
        fetchDemands({ page: 1, limit: 5, status: 2 })
    }

    return (
        <>
            <div className={styles.tableContainer}>
                {/* Search */}
                <div className={`d-flex justify-content-between ${styles.searchContainer}`}>
                    {/* Search Input ve Button */}
                    <InputGroup className={`${styles.inputGroup} me-3`} style={{ maxWidth: '400px' }}>
                        <Form.Control
                            type="text"
                            placeholder={t("Search")}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {/* Search */}
                        <InputGroup.Text style={{ cursor: "pointer" }} onClick={handleSearch}>
                            <FontAwesomeIcon icon={icons.faSearch} />
                        </InputGroup.Text>
                        {/* Clear Search */}
                        <Button variant="danger" onClick={handleClearSearch} disabled={searchQuery == null}>
                            <FontAwesomeIcon icon={icons.faDeleteLeft} />
                        </Button>
                    </InputGroup>

                    {/* Sağdaki Butonlar */}
                    <div className="d-flex">
                        <Button variant="primary" type="submit" href={buttonCustomizer(from).link} className="me-2">
                            <FontAwesomeIcon icon={icons.faPlusCircle} className="me-2" />
                            {buttonCustomizer(from).text}
                        </Button>
                        {/* Show Past Demands for Admins */}
                        {from == 'view-demands' && loggedInUser?.role != 0 &&
                            <Button className="me-2" onClick={handleShowPastDemandsClick}>
                                {t('Show Past Demands')}
                            </Button>
                        }

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

                {/* Text */}
                <div className={styles.pageInfo}>
                    {t("There are")} {totalData} {t("records in the table")}. {t("Page")} {currentPage} {t("of")} {totalPages} {t("is currently displayed")}.
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
            <ToastContainer />

            {/* Update demand modal */}
            {from === "view-demands" && showModal && <UpdateDemandModal
                show={showModal}
                onHide={() => setShowModal(false)}
                demandId={demandData.id}
                fetchDemands={fetchDemands}
                loggedInUser={loggedInUser} />
            }
        </>
    );
};

export default Table;
