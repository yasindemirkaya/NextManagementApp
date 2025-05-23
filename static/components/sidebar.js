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
                description: "You can see all users here and examine each user's information in detail",
                iconPrimary: "faUser",
                iconSecondary: "",
                permission: 1,
            },
            // CREATE NEW USER
            {
                id: 12,
                name: "Create New User",
                link: "/user-management/create-user",
                description: "Here you can create accounts for new users",
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
        link: "/group-management",
        iconPrimary: "faChevronUp",
        iconSecondary: "faChevronCircleUp",
        permission: 1,
        subMenus: [
            // USER GROUPS
            {
                id: 21,
                name: "User Groups",
                description: "From here you can create user groups, edit and delete existing groups",
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
                        description: "Here you can see user groups and create a new user group",
                        iconPrimary: "faUsers",
                        iconSecondary: "",
                        permission: 1,
                    },
                    // CREATE NEW USER GROUP
                    {
                        id: 212,
                        name: "Create New User Group",
                        link: "/group-management/user-groups/create-user-group",
                        description: "Here you can create user groups to manage common tasks for users",
                        iconPrimary: "faUserPlus",
                        iconSecondary: "",
                        permission: 1,
                    },
                ],
            }
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
                description: "From here you can review, update and delete existing group types",
                iconPrimary: "faUser",
                iconSecondary: "",
                permission: 1,
            },
            // CREATE NEW GROUP TYPE
            {
                id: 32,
                name: "Create New Group Type",
                link: "/group-type-management/create-group-type",
                description: "Here you can create groups for your common operations",
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
        link: "/notifications",
        iconPrimary: "faChevronUp",
        iconSecondary: "faChevronCircleUp",
        permission: 0,
        subMenus: [
            // VIEW NOTIFICATIONS
            {
                id: 41,
                name: "View Notifications",
                link: "/notifications",
                description: "Here you can view the personal and group notifications you have created and sent to you",
                iconPrimary: "faBell",
                iconSecondary: "",
                permission: 0,
            },
            // CREATE NOTIFICATION
            {
                id: 42,
                name: "Create Notification",
                link: "/notifications/create-notification",
                description: "From here you can create personal and group notifications for your users",
                iconPrimary: "faPlus",
                iconSecondary: "",
                permission: 1,
            },
        ],
    },
    // DEMANDS
    {
        id: 5,
        name: "Demands",
        link: "/demands",
        iconPrimary: "faChevronUp",
        iconSecondary: "faChevronCircleUp",
        permission: 0,
        subMenus: [
            // CREATE DEMAND
            {
                id: 51,
                name: "Create Demand",
                link: "/demands/create-demand",
                description: "From here, you can create requests such as equipment and permissions to present to your managers",
                iconPrimary: "faHandPointUp",
                iconSecondary: "",
                permission: 0,
            },
            // VIEW DEMANDS
            {
                id: 52,
                name: "View Demands",
                link: "/demands/view-demands",
                description: "From here you can follow the stage of your requests",
                iconPrimary: "faFileInvoice",
                iconSecondary: "",
                permission: 0,
            },
        ]
    },
    // PROJECTS
    {
        id: 6,
        name: "Projects",
        link: "/project-management",
        iconPrimary: "faChevronUp",
        iconSecondary: "faChevronCircleUp",
        permission: 0,
        subMenus: [
            // CREATE PROJECT
            {
                id: 61,
                name: "Create Project",
                link: "/project-management/create-project",
                description: "From here, you can create projects for yourself, your staff or teams",
                iconPrimary: "faDiagramProject",
                iconSecondary: "",
                permission: 1,
            },
            // VIEW PROJECTS
            {
                id: 62,
                name: "View Projects",
                link: "/project-management/view-projects",
                description: "You can update details about your projects from here",
                iconPrimary: "faListCheck",
                iconSecondary: "",
                permission: 0,
            },
        ]
    },
    // TASKS
    {
        id: 7,
        name: "Tasks",
        link: "/task-management",
        iconPrimary: "faChevronUp",
        iconSecondary: "faChevronCircleUp",
        permission: 0,
        subMenus: [
            // CREATE TASK
            {
                id: 71,
                name: "Create Task",
                link: "/task-management/create-task",
                description: "From here, you can create tasks for your projects and assign them to yourself, your staff or teams.",
                iconPrimary: "faDiagramProject",
                iconSecondary: "",
                permission: 1,
            },
            // VIEW TASKS
            {
                id: 72,
                name: "View Tasks",
                link: "/task-management/view-tasks",
                description: "You can update details about your tasks and create new tasks for your projects from here",
                iconPrimary: "faListCheck",
                iconSecondary: "",
                permission: 1,
            },
        ]
    },
    // SETTINGS
    {
        id: 8,
        name: "Settings",
        link: "/settings",
        iconPrimary: "faChevronUp",
        iconSecondary: "faChevronCircleUp",
        permission: 0,
        subMenus: [
            // USER SETTINGS
            {
                id: 81,
                name: "User Settings",
                link: "/settings",
                description: "From here you can edit the application's settings for your account",
                iconPrimary: "faCog",
                iconSecondary: "",
                permission: 0,
            },
            // SERVICE LOGS
            {
                id: 82,
                name: "Service Logs",
                link: "/settings/service-logs",
                description: "From here you can review the detailed logs, requests and responses of the web services",
                iconPrimary: "faFileInvoice",
                iconSecondary: "",
                permission: 2,
            },
        ],
    },
];

export default sidebarMenu;
