import { useState, useEffect } from "react";
import Statistics from "@/components/Dashboard/Statistics";
import { getDashboardStatistics } from '@/services/statisticsApi';
import { dashboardStatistics } from "@/static/components/statistics";

const Dashboard = () => {
    const [stats, setStats] = useState({
        userCount: 0,
        userGroupCount: 0,
        userGroupTypeCount: 0,
        error: null,
    });

    // Get dashboard statistics
    const fetchDashboardStatistics = async () => {
        const result = await getDashboardStatistics();

        if (result.success) {
            setStats(result.data);
        } else {
            setStats({
                userCount: 0,
                userGroupCount: 0,
                userGroupTypeCount: 0,
                error: result.error || null,
            });
        }
    };

    useEffect(() => {
        fetchDashboardStatistics();
    }, []);

    return (
        <>
            <Statistics stats={dashboardStatistics} statsData={stats} />
        </>

    );
};

export default Dashboard;
