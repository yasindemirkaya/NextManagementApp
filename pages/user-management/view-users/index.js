import React from "react";
import Table from "@/components/Common/Table";

const ViewUsers = () => {
    const headers = ["Name", "Email", "Role"];
    const data = [
        { Name: "John Doe", Email: "john@example.com", Role: "Admin" },
        { Name: "Jane Smith", Email: "jane@example.com", Role: "User" },
        { Name: "Michael Johnson", Email: "michael@example.com", Role: "Editor" },
        { Name: "Sara Lee", Email: "sara@example.com", Role: "User" },
        { Name: "David Brown", Email: "david@example.com", Role: "Admin" },
        { Name: "Emily Clark", Email: "emily@example.com", Role: "Editor" },
        { Name: "Luke Walker", Email: "luke@example.com", Role: "User" },
        { Name: "Sophie Turner", Email: "sophie@example.com", Role: "Admin" },
    ];

    return (
        <div>
            <Table headers={headers} data={data} itemsPerPage={5} />
        </div>
    );
}

export default ViewUsers;