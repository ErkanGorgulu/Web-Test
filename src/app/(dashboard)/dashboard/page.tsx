"use client";

import { memo } from "react";
import { BarChart, Clock, Users, TrendingUp } from "lucide-react";
import DashboardShell from "@/components/layout/DashboardShell";
import StatCard from "@/components/dashboard/StatCard";
import Card from "@/components/ui/Card";

/**
 * Dashboard data fetching component
 */
const Dashboard = memo(() => {
  // In a real app, we would fetch this data from an API
  // and use React Query or SWR for data fetching
  const dashboardStats = [
    {
      title: "Total Projects",
      value: 12,
      icon: <BarChart className="w-5 h-5" />,
      changeValue: "16%",
      changeDirection: "up" as const,
      iconBgColor: "bg-primary-50",
      iconColor: "text-primary-600",
    },
    {
      title: "In Progress",
      value: 7,
      icon: <Clock className="w-5 h-5" />,
      changeValue: "8%",
      changeDirection: "up" as const,
      iconBgColor: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      title: "Team Members",
      value: 16,
      icon: <Users className="w-5 h-5" />,
      changeValue: "24%",
      changeDirection: "up" as const,
      iconBgColor: "bg-success-50",
      iconColor: "text-success-600",
    },
    {
      title: "Completion Rate",
      value: "68%",
      icon: <TrendingUp className="w-5 h-5" />,
      changeValue: "7%",
      changeDirection: "up" as const,
      iconBgColor: "bg-warning-50",
      iconColor: "text-warning-600",
    },
  ];

  return (
    <DashboardShell heading="Dashboard">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {dashboardStats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            changeValue={stat.changeValue}
            changeDirection={stat.changeDirection}
            iconBgColor={stat.iconBgColor}
            iconColor={stat.iconColor}
          />
        ))}
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Charts */}
        <Card title="Project Progress" className="h-full">
          <div className="h-48 sm:h-64 flex items-center justify-center bg-secondary-50 rounded-lg">
            <p className="text-secondary-600">Project Chart Placeholder</p>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card title="Recent Activity" className="h-full">
          <div className="space-y-3 sm:space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex items-start pb-3 sm:pb-4 border-b border-secondary-100"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-secondary-100 flex-shrink-0 mr-3" />
                <div>
                  <p className="text-sm font-medium text-secondary-900">
                    John updated Project Alpha
                  </p>
                  <p className="text-xs text-secondary-600">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardShell>
  );
});

Dashboard.displayName = "Dashboard";

export default Dashboard;
