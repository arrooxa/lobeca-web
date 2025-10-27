import React, { useState } from "react";
import {
  Home,
  Settings,
  Menu,
  X,
  LogOut,
  Calendar,
  Clock,
  Building2,
} from "lucide-react";
import { useUser } from "@/context/UserContext";
import { NavLink, useNavigate } from "react-router";
import { ROUTES } from "@/constants";
import AvatarIcon from "@/components/AvatarIcon";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, logout, isWorker } = useUser();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", href: ROUTES.DASHBOARD, icon: Home },
    {
      name: "Agendamentos",
      href: ROUTES.DASHBOARD_APPOINTMENTS,
      icon: Calendar,
    },
    ...(isWorker
      ? [
          {
            name: "Horários",
            href: ROUTES.DASHBOARD_SCHEDULE,
            icon: Clock,
          },
          {
            name: "Barbearia",
            href: ROUTES.DASHBOARD_ESTABLISHMENT,
            icon: Building2,
          },
        ]
      : []),
    {
      name: "Configurações",
      href: ROUTES.DASHBOARD_SETTINGS,
      icon: Settings,
    },
  ];

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.HOME, { replace: true });
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
        </div>
      )}

      <div
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:relative lg:flex lg:w-64 lg:flex-col
        `}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <NavLink to={ROUTES.HOME}>
            <img
              src="/lobeca-logo.svg"
              alt="Lobeca Logo"
              className="h-8 w-auto"
            />
          </NavLink>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive =
              window.location.pathname === item.href ||
              (window.location.pathname.startsWith(item.href + "/") &&
                item.href !== ROUTES.DASHBOARD);

            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={`
                  flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200
                  ${
                    isActive
                      ? "bg-brand-primary/10 text-brand-primary border-r-2 border-brand-primary"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }
                `}
              >
                <Icon
                  className={`mr-3 h-5 w-5 ${
                    isActive ? "text-brand-primary" : ""
                  }`}
                />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center">
            <AvatarIcon
              name={user?.name || user?.nickname || "Usuário"}
              photoURL={user?.photoURL}
              size="extra-small"
            />
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.phone}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="cursor-pointer mt-3 w-full flex items-center justify-center px-4 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between h-16 px-4 lg:px-6">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                <Menu className="h-6 w-6" />
              </button>

              <div className="lg:ml-0 ml-2">
                <h2 className="text-lg font-semibold text-gray-900">
                  Bem-vindo, {user?.name}!
                </h2>
                <p className="text-sm text-gray-500">
                  Acesse suas informações e funcionalidades aqui.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden md:block">
                <span className="text-sm text-gray-500">
                  {new Date().toLocaleDateString("pt-BR", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto bg-gray-50 p-6">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
