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
        ],
    },
];

export default sidebarMenu;
