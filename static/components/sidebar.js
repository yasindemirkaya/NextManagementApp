const sidebarMenu = [
    // USER MANAGEMENT
    {
        id: 1,
        name: "User Management",
        link: "/user-management",
        iconPrimary: "faChevronUp",
        iconSecondary: "faChevronCircleUp",
        permission: 1,
        subMenus: [
            // VIEW USERS
            {
                id: 11,
                name: "View Users",
                link: "/user-management/view-users",
                description: "You can see all users here and examine each user's information in detail.",
                iconPrimary: "faUser",
                iconSecondary: "",
                permission: 1,
            },
            // CREATE NEW USER
            {
                id: 12,
                name: "Create New User",
                link: "/user-management/create-user",
                description: "Here you can create accounts for new users.",
                iconPrimary: "faUserPlus",
                iconSecondary: "",
                permission: 1
            },
        ],
    },
    // GROUP MANAGEMENT
    {
        id: 2,
        name: "Group Management",
        link: "/group-management",
        iconPrimary: "faChevronUp",
        iconSecondary: "faChevronCircleUp",
        permission: 1,
        subMenus: [
            // USER GROUPS
            {
                id: 21,
                name: "User Groups",
                description: "From here you can create user groups, edit and delete existing groups.",
                link: "/group-management/user-groups",
                iconPrimary: "faUsers",
                iconSecondary: "",
                permission: 1,
                subMenus: [
                    // VIEW USER GROUPS
                    {
                        id: 211,
                        name: "View User Groups",
                        link: "/group-management/user-groups/view-user-groups",
                        description: "Here you can see user groups and create a new user group.",
                        iconPrimary: "faUsers",
                        iconSecondary: "",
                        permission: 1
                    },
                    // CREATE NEW USER GROUP
                    {
                        id: 212,
                        name: "Create New User Group",
                        link: "/group-management/user-groups/create-user-group",
                        description: "Here you can create user groups to manage common tasks for users.",
                        iconPrimary: "faUserPlus",
                        iconSecondary: "",
                        permission: 1
                    },
                ],
            },
            // TEST GROUPS
            {
                id: 31,
                name: "Test Groups",
                description: "Test decription",
                link: "",
                iconPrimary: "faUsers",
                iconSecondary: "",
                permission: 1,
                subMenus: [
                    // VIEW USER GROUPS
                    {
                        id: 311,
                        name: "View User Groups",
                        link: "",
                        description: "Here you can see user groups and create a new user group.",
                        iconPrimary: "",
                        iconSecondary: "",
                        permission: 1
                    },
                    // CREATE NEW USER GROUP
                    {
                        id: 312,
                        name: "Create New User Group",
                        link: "",
                        description: "Here you can create user groups to manage common tasks for users.",
                        iconPrimary: "",
                        iconSecondary: "",
                        permission: 1
                    },
                ],
            },
        ],
    },
    // GROUP TYPE MANAGEMENT
    {
        id: 3,
        name: "Group Type Management",
        link: "/group-type-management",
        iconPrimary: "faChevronUp",
        iconSecondary: "faChevronCircleUp",
        permission: 2,
        subMenus: [
            // VIEW GROUP TYPES
            {
                id: 31,
                name: "View Group Types",
                link: "/group-type-management/view-group-types",
                description: "From here you can review, update and delete existing group types.",
                iconPrimary: "faUser",
                iconSecondary: "",
                permission: 1,
            },
            // CREATE NEW GROUP TYPE
            {
                id: 32,
                name: "Create New Group Type",
                link: "/group-type-management/create-group-type",
                description: "Here you can create groups for your common operations.",
                iconPrimary: "faUserPlus",
                iconSecondary: "",
                permission: 1
            },
        ],
    },
];

export default sidebarMenu;
