import React, { useEffect, useMemo, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  MdDashboard,
  MdAddBox,
  MdListAlt,
  MdShoppingCart,
  MdPeople,
  MdMessage,
  MdInventory,
  MdKeyboardArrowDown,
} from "react-icons/md";
import { FiPackage, FiPlusCircle, FiRepeat, FiList, FiTruck, FiUserPlus } from "react-icons/fi";
import { hasPermission } from "../../config/rbac";

const Sidebar = ({ adminUser }) => {
  const location = useLocation();
  const role = adminUser?.role;
  const [isStockControlOpen, setIsStockControlOpen] = useState(true);

  const stockControlItems = useMemo(
    () => [
      { to: "/stock-control/add-supplier", label: "Add Supplier", icon: <FiUserPlus /> },
      { to: "/stock-control/add-stock", label: "Add Stock", icon: <FiPlusCircle /> },
      { to: "/stock-control/stock-list", label: "Stock List", icon: <FiList /> },
      { to: "/stock-control/add-new-item", label: "Add New Item", icon: <FiPackage /> },
      { to: "/stock-control/kitchen-transfer-list", label: "Kitchen Transfer List", icon: <FiTruck /> },
      { to: "/stock-control/add-item", label: "Add Item", icon: <FiRepeat /> },
    ],
    [],
  );

  useEffect(() => {
    if (location.pathname.startsWith("/stock-control")) {
      setIsStockControlOpen(true);
    }
  }, [location.pathname]);

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
    hasPermission(role, "stockControl") && {
      to: "/stock-control",
      icon: <MdInventory />,
      color: "#F97316",
      label: "Stock Control",
      textcolour:"black",
      isGroup: true,
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
      <nav className="flex flex-col gap-3 pl-[20%] pt-12 pb-6">
        {menuItems.map((item) => (
          item.isGroup ? (
            <div key={item.to} className="rounded-l-sm border border-zinc-300 border-r-0 dark:border-zinc-700">
              <button
                type="button"
                onClick={() => setIsStockControlOpen((prev) => !prev)}
                className={`flex w-full items-center gap-3 px-2.5 py-2 transition ${
                  location.pathname.startsWith("/stock-control")
                    ? "border-orange-500 bg-orange-50 text-zinc-700 dark:border-orange-400 dark:hover:bg-zinc-700 dark:text-zinc-100"
                    : "text-zinc-600 hover:bg-orange-50 dark:text-zinc-300 dark:hover:bg-zinc-800"
                }`}
              >
                <span
                  className="flex h-5 w-5 items-center justify-center text-xl"
                  style={{ color: item.color }}
                  aria-hidden="true"
                >
                  {item.icon}
                </span>
                <p className="text-[max(1vw,10px)] font-semibold max-[900px]:hidden">{item.label}</p>
                <MdKeyboardArrowDown
                  className={`ml-auto text-lg transition-transform ${isStockControlOpen ? "rotate-180" : "rotate-0"}`}
                  aria-hidden="true"
                />
              </button>

              {isStockControlOpen ? (
                <div className="border-t border-zinc-200 py-2 dark:border-zinc-700">
                  <div className="mt-1 flex flex-col gap-1">
                    {stockControlItems.map((subItem) => (
                      <NavLink
                        key={subItem.to}
                        to={subItem.to}
                        className={({ isActive }) =>
                          `flex items-center gap-3 rounded-l-sm px-2.5 py-2 pl-10 transition ${
                            isActive
                              ? "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100"
                              : "text-zinc-500 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-800"
                          }`
                        }
                      >
                        <span className="flex h-4 w-4 items-center justify-center text-sm" aria-hidden="true">
                          {subItem.icon}
                        </span>
                        <p className="text-[max(0.92vw,9px)] max-[900px]:hidden">{subItem.label}</p>
                      </NavLink>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          ) : (
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
          )
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;

