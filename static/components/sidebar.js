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
                name: "User Groups",
                link: "/user-management/user-groups",
                description: "Here you can see user groups and create a new user group.",
                iconPrimary: "faUsers",
                iconSecondary: "",
                permission: 1
            },
        ],
    },
];

export default sidebarMenu;
