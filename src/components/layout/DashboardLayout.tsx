"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/helpers";
import {
  LayoutDashboard,
  FolderKanban,
  Calendar,
  MessageSquare,
  Users,
  CircleUser,
  HelpCircle,
  Shield,
  Menu,
  X,
} from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const mainNavItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Project", href: "/projects", icon: FolderKanban },
    { name: "Employee", href: "/employee", icon: Users },
    { name: "Payroll", href: "/payroll", icon: Calendar },
  ];

  const otherNavItems = [
    { name: "Schedule", href: "/schedule", icon: Calendar },
    { name: "Open Hiring", href: "/hiring", icon: Users },
    { name: "Integration", href: "/integration", icon: MessageSquare },
  ];

  const preferenceNavItems = [
    { name: "Security", href: "/security", icon: Shield },
    { name: "Help Center", href: "/help", icon: HelpCircle },
  ];

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50 relative">
      {/* Application header */}
      <header className="fixed top-0 left-0 right-0 h-10 bg-white border-b border-gray-200 flex items-center px-4 z-20">
        <div className="md:hidden">
          <button onClick={toggleMobileMenu} className="p-1">
            <Menu className="w-6 h-6 text-gray-600" />
          </button>
        </div>
        <div className="flex-1"></div>
        <div className="flex items-center gap-2">
          <CircleUser className="w-6 h-6 text-gray-600" />
        </div>
      </header>

      {/* Mobile sidebar overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          w-64 bg-white border-r border-gray-200 pt-10 fixed h-screen z-40
          transition-transform duration-300 ease-in-out
          md:translate-x-0 md:z-10
          ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center">
            <div className="bg-blue-600 rounded-md p-2 mr-3">
              <FolderKanban className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900">Perfect Pixelz</h1>
              <p className="text-xs text-gray-500">Premium Plan</p>
            </div>
          </div>
          <button onClick={toggleMobileMenu} className="md:hidden p-1">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Search bar */}
        <div className="px-6 py-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-8 pr-3 py-1.5 text-sm bg-gray-100 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 absolute left-2.5 top-2 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Main Navigation */}
        <div className="mt-4 overflow-y-auto">
          <h2 className="px-6 py-2 text-xs font-medium uppercase text-gray-500">
            General
          </h2>
          <nav>
            <ul>
              {mainNavItems.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center px-6 py-2 text-sm",
                        isActive
                          ? "font-medium text-blue-600"
                          : "text-gray-700 hover:bg-gray-100"
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <item.icon
                        className={cn(
                          "w-5 h-5 mr-3",
                          isActive ? "text-blue-600" : "text-gray-500"
                        )}
                      />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* Others Navigation */}
        <div className="mt-4">
          <h2 className="px-6 py-2 text-xs font-medium uppercase text-gray-500">
            Others
          </h2>
          <nav>
            <ul>
              {otherNavItems.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center px-6 py-2 text-sm",
                        isActive
                          ? "font-medium text-blue-600"
                          : "text-gray-700 hover:bg-gray-100"
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <item.icon
                        className={cn(
                          "w-5 h-5 mr-3",
                          isActive ? "text-blue-600" : "text-gray-500"
                        )}
                      />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* Preferences Navigation */}
        <div className="mt-4">
          <h2 className="px-6 py-2 text-xs font-medium uppercase text-gray-500">
            Preferences
          </h2>
          <nav>
            <ul>
              {preferenceNavItems.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center px-6 py-2 text-sm",
                        isActive
                          ? "font-medium text-blue-600"
                          : "text-gray-700 hover:bg-gray-100"
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <item.icon
                        className={cn(
                          "w-5 h-5 mr-3",
                          isActive ? "text-blue-600" : "text-gray-500"
                        )}
                      />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* Upgrade promotion */}
        <div className="hidden md:block absolute bottom-0 w-64 p-4 border-t border-gray-200">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
            <div className="flex justify-center mb-2">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 3L21 12L5 21V3Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
            <h3 className="font-medium text-sm">Up To Enterprise</h3>
            <p className="text-xs text-gray-500 mb-2">
              Get full access to all features...
            </p>
            <button className="w-full py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700">
              Upgrade Now
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 mt-10 md:ml-64">
        {children}
      </main>
    </div>
  );
}
