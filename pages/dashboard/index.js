import { useState, useEffect } from "react";
import { getDashboardStatistics } from '@/services/statisticsApi';
import { dashboardStatistics } from "@/static/components/statistics";

import Statistics from "@/components/Dashboard/Statistics";
import Widgets from "@/components/Dashboard/Widgets"

const Dashboard = () => {
    const [stats, setDashboardStats] = useState([]);

    // Get dashboard statistics
    const fetchDashboardStatistics = async () => {
        const result = await getDashboardStatistics();

        if (result.success) {
            const formattedStats = formatDashboardStatistics(dashboardStatistics, result.data);
            setDashboardStats(formattedStats);
        } else {
            setDashboardStats([]);
        }
    };

    // Format dashboard statistics
    const formatDashboardStatistics = (dashboardStatistics, data) => {
        return dashboardStatistics.map(stat => {
            let value = 0;

            switch (stat.title) {
                case "Users":
                    value = data.userCount;
                    break;
                case "Groups":
                    value = data.userGroupCount;
                    break;
                case "Group Types":
                    value = data.userGroupTypeCount;
                    break;
                default:
                    value = 0;
            }

            return { ...stat, value };
        });
    };

    useEffect(() => {
        fetchDashboardStatistics();
    }, []);

    return (
        <>
            {/* STATISTICS */}
            <Statistics stats={stats} />
            {/* WIDGETS */}
            <Widgets statsData={stats} />
        </>

    );
};

export async function getStaticProps(context) {
    const commonMessages = await import(`.././../public/locales/common/${context.locale}.json`);

    return {
        props: {
            messages: {
                ...commonMessages.default,
            },
        },
    };
}

export default Dashboard;
