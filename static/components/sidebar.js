const sidebarMenu = [
    {
        id: 1,
        name: "User Management",
        link: "/user-management",
        icon: "user-icon",
        subMenus: [
            {
                id: 1,
                name: "View Users",
                link: "/user-management/view-users",
                icon: "view-icon",
            },
            {
                id: 2,
                name: "Create User Group",
                link: "/user-management/user-groups",
                icon: "group-icon",
            },
        ],
    },
];

export default sidebarMenu;
