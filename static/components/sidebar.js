const sidebarMenu = [
    {
        id: 1,
        name: "User Management",
        link: "/user-management",
        iconPrimary: "faChevronUp",
        iconSecondary: "faChevronCircleUp",
        subMenus: [
            {
                id: 1,
                name: "View Users",
                link: "/user-management/view-users",
                iconPrimary: "faUser",
                iconSecondary: "",
            },
            {
                id: 2,
                name: "User Groups",
                link: "/user-management/user-groups",
                iconPrimary: "faUsers",
                iconSecondary: ""
            },
        ],
    },
];

export default sidebarMenu;
