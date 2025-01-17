const sidebarMenu = [
    // USER MANAGEMENT
    {
        id: 1,
        name: "User Management",
        nameTR: "Kullanıcı Yönetimi",
        link: "/user-management",
        iconPrimary: "faChevronUp",
        iconSecondary: "faChevronCircleUp",
        permission: 1,
        subMenus: [
            // VIEW USERS
            {
                id: 11,
                name: "View Users",
                nameTR: "Kullanıcıları Görüntüle",
                link: "/user-management/view-users",
                description: "You can see all users here and examine each user's information in detail.",
                descriptionTR: "Burada tüm kullanıcıları görebilir ve her bir kullanıcının bilgilerini detaylı olarak inceleyebilirsiniz.",
                iconPrimary: "faUser",
                iconSecondary: "",
                permission: 1,
            },
            // CREATE NEW USER
            {
                id: 12,
                name: "Create New User",
                nameTR: "Yeni Kullanıcı Oluştur",
                link: "/user-management/create-user",
                description: "Here you can create accounts for new users.",
                descriptionTR: "Burada yeni kullanıcılar için hesaplar oluşturabilirsiniz.",
                iconPrimary: "faUserPlus",
                iconSecondary: "",
                permission: 1,
            },
        ],
    },
    // GROUP MANAGEMENT
    {
        id: 2,
        name: "Group Management",
        nameTR: "Grup Yönetimi",
        link: "/group-management",
        iconPrimary: "faChevronUp",
        iconSecondary: "faChevronCircleUp",
        permission: 1,
        subMenus: [
            // USER GROUPS
            {
                id: 21,
                name: "User Groups",
                nameTR: "Kullanıcı Grupları",
                description: "From here you can create user groups, edit and delete existing groups.",
                descriptionTR: "Buradan kullanıcı grupları oluşturabilir, mevcut grupları düzenleyebilir ve silebilirsiniz.",
                link: "/group-management/user-groups",
                iconPrimary: "faUsers",
                iconSecondary: "",
                permission: 1,
                subMenus: [
                    // VIEW USER GROUPS
                    {
                        id: 211,
                        name: "View User Groups",
                        nameTR: "Kullanıcı Gruplarını Görüntüle",
                        link: "/group-management/user-groups/view-user-groups",
                        description: "Here you can see user groups and create a new user group.",
                        descriptionTR: "Burada kullanıcı gruplarını görebilir ve yeni bir kullanıcı grubu oluşturabilirsiniz.",
                        iconPrimary: "faUsers",
                        iconSecondary: "",
                        permission: 1,
                    },
                    // CREATE NEW USER GROUP
                    {
                        id: 212,
                        name: "Create New User Group",
                        nameTR: "Yeni Kullanıcı Grubu Oluştur",
                        link: "/group-management/user-groups/create-user-group",
                        description: "Here you can create user groups to manage common tasks for users.",
                        descriptionTR: "Burada kullanıcılar için ortak görevleri yönetmek üzere kullanıcı grupları oluşturabilirsiniz.",
                        iconPrimary: "faUserPlus",
                        iconSecondary: "",
                        permission: 1,
                    },
                ],
            },
            // TEST GROUPS
            {
                id: 31,
                name: "Test Groups",
                nameTR: "Test Grupları",
                description: "Test description",
                descriptionTR: "Test açıklaması",
                link: "",
                iconPrimary: "faUsers",
                iconSecondary: "",
                permission: 1,
                subMenus: [
                    // VIEW USER GROUPS
                    {
                        id: 311,
                        name: "View User Groups",
                        nameTR: "Kullanıcı Gruplarını Görüntüle",
                        link: "",
                        description: "Here you can see user groups and create a new user group.",
                        descriptionTR: "Burada kullanıcı gruplarını görebilir ve yeni bir kullanıcı grubu oluşturabilirsiniz.",
                        iconPrimary: "",
                        iconSecondary: "",
                        permission: 1,
                    },
                    // CREATE NEW USER GROUP
                    {
                        id: 312,
                        name: "Create New User Group",
                        nameTR: "Yeni Kullanıcı Grubu Oluştur",
                        link: "",
                        description: "Here you can create user groups to manage common tasks for users.",
                        descriptionTR: "Burada kullanıcılar için ortak görevleri yönetmek üzere kullanıcı grupları oluşturabilirsiniz.",
                        iconPrimary: "",
                        iconSecondary: "",
                        permission: 1,
                    },
                ],
            },
        ],
    },
    // GROUP TYPE MANAGEMENT
    {
        id: 3,
        name: "Group Type Management",
        nameTR: "Grup Tipi Yönetimi",
        link: "/group-type-management",
        iconPrimary: "faChevronUp",
        iconSecondary: "faChevronCircleUp",
        permission: 2,
        subMenus: [
            // VIEW GROUP TYPES
            {
                id: 31,
                name: "View Group Types",
                nameTR: "Grup Tiplerini Görüntüle",
                link: "/group-type-management/view-group-types",
                description: "From here you can review, update and delete existing group types.",
                descriptionTR: "Buradan mevcut grup tiplerini inceleyebilir, güncelleyebilir ve silebilirsiniz.",
                iconPrimary: "faUser",
                iconSecondary: "",
                permission: 1,
            },
            // CREATE NEW GROUP TYPE
            {
                id: 32,
                name: "Create New Group Type",
                nameTR: "Yeni Grup Tipi Oluştur",
                link: "/group-type-management/create-group-type",
                description: "Here you can create groups for your common operations.",
                descriptionTR: "Burada ortak işlemleriniz için gruplar oluşturabilirsiniz.",
                iconPrimary: "faUserPlus",
                iconSecondary: "",
                permission: 1,
            },
        ],
    },
    // NOTIFICATIONS
    {
        id: 4,
        name: "Notifications",
        nameTR: "Bildirimler",
        link: "/notifications",
        iconPrimary: "faChevronUp",
        iconSecondary: "faChevronCircleUp",
        permission: 0,
        subMenus: [
            // VIEW NOTIFICATIONS
            {
                id: 41,
                name: "View Notifications",
                nameTR: "Bildirimleri Görüntüle",
                link: "/notifications",
                description: "Here you can view the personal and group notifications you have created and sent to you.",
                descriptionTR: "Burada oluşturduğunuz ve size gönderilen kişisel ve grup bildirimlerini görebilirsiniz.",
                iconPrimary: "faBell",
                iconSecondary: "",
                permission: 0,
            },
            // CREATE NOTIFICATION
            {
                id: 42,
                name: "Create Notification",
                nameTR: "Yeni Bildirim Oluştur",
                link: "/notifications/create-notification",
                description: "From here you can create personal and group notifications for your users.",
                descriptionTR: "Buradan kullanıcılarınız için kişisel ve grup bildirimleri oluşturabilirsiniz.",
                iconPrimary: "faPlus",
                iconSecondary: "",
                permission: 1,
            },
        ],
    },
    // SETTINGS
    {
        id: 5,
        name: "Settings",
        nameTR: "Ayarlar",
        link: "/settings",
        iconPrimary: "faChevronUp",
        iconSecondary: "faChevronCircleUp",
        permission: 0,
        subMenus: [
            // GENERAL SETTINGS
            {
                id: 51,
                name: "General Settings",
                nameTR: "Genel Ayarlar",
                link: "/settings",
                description: "From here you can edit the application's settings.",
                descriptionTR: "Buradan uygulamanın ayarlarını düzenleyebilirsiniz.",
                iconPrimary: "faCog",
                iconSecondary: "",
                permission: 2,
            },
            // SERVICE LOGS
            {
                id: 52,
                name: "Service Logs",
                nameTR: "Servis Kayıtları",
                link: "/settings/service-logs",
                description: "From here you can review the detailed logs, requests and responses of the web services.",
                descriptionTR: "Buradan web servislerinin detaylı loglarını, isteklerini ve yanıtlarını inceleyebilirsiniz.",
                iconPrimary: "faFileInvoice",
                iconSecondary: "",
                permission: 2,
            },
        ],
    },
];

export default sidebarMenu;
