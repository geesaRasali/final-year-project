import React from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../../assets/assets";
import { hasPermission, normalizeRole, ROLE_LABELS } from "../../config/rbac";

const Sidebar = ({ adminUser }) => {
  const role = adminUser?.role;
  const normalizedRole = normalizeRole(role);
  const roleLabel = (ROLE_LABELS[normalizedRole] || normalizedRole || "Admin").toUpperCase();
  const username = adminUser?.username || "admin";

  const menuItems = [
    hasPermission(role, "dashboard") && {
      to: "/",
      icon: assets.order_icon,
      label: "Dashboard",
    },
    hasPermission(role, "addFood") && {
      to: "/add",
      icon: assets.add_icon,
      label: "Add Items",
    },
    hasPermission(role, "listFood") && {
      to: "/list",
      icon: assets.order_icon,
      label: "List Items",
    },
    hasPermission(role, "orders") && {
      to: "/orders",
      icon: assets.order_icon,
      label: "Orders",
    },
    hasPermission(role, "staffUsers") && {
      to: "/staff-users",
      icon: assets.order_icon,
      label: "Staff Users",
    },
  ].filter(Boolean);

  return (
    <aside className="w-[18%] min-h-screen border border-zinc-300 border-t-0 bg-white text-zinc-600 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300">
      <nav className="flex flex-col gap-5 pl-[20%] pt-12">
        <div className="mb-1 rounded-l-sm border border-zinc-300 border-r-0 bg-zinc-50 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900">
          <p className="text-[11px] font-bold tracking-wide text-zinc-400">{roleLabel}</p>
          <p className="text-lg font-extrabold leading-tight text-zinc-900 dark:text-zinc-100">{username}</p>
        </div>
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
            <img src={item.icon} alt="" className="h-5 w-5" />
            <p className="text-[max(1vw,10px)] max-[900px]:hidden">{item.label}</p>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;

