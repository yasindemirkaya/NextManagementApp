const sidebarMenu = [
    {
        id: 1,
        name: "User Management",
        link: "/user-management",
        iconPrimary: "faChevronUp",
        iconSecondary: "faChevronCircleUp",
        permission: 1,
        subMenus: [
            {
                id: 1,
                name: "View Users",
                link: "/user-management/view-users",
                description: "You can see all users here and examine each user's information in detail.",
                iconPrimary: "faUser",
                iconSecondary: "",
                permission: 1,
            },
            {
                id: 2,
                name: "Create User",
                link: "/user-management/create-user",
                description: "Here you can create accounts for new users.",
                iconPrimary: "faUserPlus",
                iconSecondary: "",
                permission: 1
            },
            {
                id: 3,
                name: "View User Groups",
                link: "/user-management/user-groups",
                description: "Here you can see user groups and create a new user group.",
                iconPrimary: "faUsers",
                iconSecondary: "",
                permission: 1
            },
            {
                id: 4,
                name: "Create User Group",
                link: "/user-management/create-user-group",
                description: "Here you can create user groups to manage common tasks for users.",
                iconPrimary: "faUsers",
                iconSecondary: "",
                permission: 1
            },
        ],
    },
];

export default sidebarMenu;
