import React from "react";
import { NavLink } from "react-router-dom";
import {
  MdDashboard,
  MdAddBox,
  MdListAlt,
  MdShoppingCart,
  MdPeople,
  MdMessage,
} from "react-icons/md";
import { hasPermission } from "../../config/rbac";

const Sidebar = ({ adminUser }) => {
  const role = adminUser?.role;

  const menuItems = [
    hasPermission(role, "dashboard") && {
      to: "/",
      icon: <MdDashboard />,
      color: "#6366F1",
      label: "Dashboard",
    },
    hasPermission(role, "addFood") && {
      to: "/add",
      icon: <MdAddBox />,
      color: "#22C55E",
      label: "Add Items",
    },
    hasPermission(role, "listFood") && {
      to: "/list",
      icon: <MdListAlt />,
      color: "#0EA5E9",
      label: "List Items",
    },
    hasPermission(role, "orders") && {
      to: "/orders",
      icon: <MdShoppingCart />,
      color: "#F59E0B",
      label: "Orders",
    },
    hasPermission(role, "messages") && {
      to: "/admin/messages",
      icon: <MdMessage />,
      color: "#EF4444",
      label: "Customer Messages",
    },
    hasPermission(role, "staffUsers") && {
      to: "/staff-users",
      icon: <MdPeople />,
      color: "#EC4899",
      label: "Staff Users",
    },
  ].filter(Boolean);

  return (
    <aside className="fixed top-16 left-0 z-30 h-[calc(100vh-4rem)] w-[18%] overflow-y-auto border border-zinc-300 border-t-0 bg-white text-zinc-600 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300">
      <nav className="flex flex-col gap-5 pl-[20%] pt-12 pb-6">
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-l-sm border border-r-0 px-2.5 py-2 transition ${
                isActive
                  ? "border-orange-500 bg-orange-50 text-zinc-700 dark:border-orange-400 dark:bg-zinc-800 dark:text-zinc-100"
                  : "border-zinc-300 text-zinc-600 hover:bg-orange-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              }`
            }
          >
            <span
              className="flex h-5 w-5 items-center justify-center text-xl"
              style={{ color: item.color }}
              aria-hidden="true"
            >
              {item.icon}
            </span>
            <p className="text-[max(1vw,10px)] max-[900px]:hidden">{item.label}</p>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;

