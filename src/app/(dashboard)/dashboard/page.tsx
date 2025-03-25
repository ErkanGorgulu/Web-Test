import { BarChart, Clock, Users, TrendingUp } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="px-2 sm:px-0">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-900">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Stats cards */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-gray-700 text-sm font-medium">
              Total Projects
            </h3>
            <div className="p-2 bg-blue-50 rounded-lg">
              <BarChart className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-gray-900">12</p>
          <p className="text-sm text-gray-600 mt-1">
            <span className="text-green-600">↑ 16%</span> vs last month
          </p>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-gray-700 text-sm font-medium">In Progress</h3>
            <div className="p-2 bg-purple-50 rounded-lg">
              <Clock className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-gray-900">7</p>
          <p className="text-sm text-gray-600 mt-1">
            <span className="text-green-600">↑ 8%</span> vs last month
          </p>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-gray-700 text-sm font-medium">Team Members</h3>
            <div className="p-2 bg-green-50 rounded-lg">
              <Users className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-gray-900">16</p>
          <p className="text-sm text-gray-600 mt-1">
            <span className="text-green-600">↑ 24%</span> vs last month
          </p>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-gray-700 text-sm font-medium">
              Completion Rate
            </h3>
            <div className="p-2 bg-amber-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-amber-600" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-gray-900">68%</p>
          <p className="text-sm text-gray-600 mt-1">
            <span className="text-green-600">↑ 7%</span> vs last month
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Project summary chart placeholder */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-3 sm:mb-4 text-gray-900">
            Project Progress
          </h3>
          <div className="h-48 sm:h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-600">Project Chart Placeholder</p>
          </div>
        </div>

        {/* Recent activity placeholder */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-3 sm:mb-4 text-gray-900">
            Recent Activity
          </h3>
          <div className="space-y-3 sm:space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex items-start pb-3 sm:pb-4 border-b border-gray-100"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gray-100 flex-shrink-0 mr-3"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    John updated Project Alpha
                  </p>
                  <p className="text-xs text-gray-600">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
