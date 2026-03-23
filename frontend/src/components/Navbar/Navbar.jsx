import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import TrueFocus from "./TrueFocus/TrueFocus";

const Navbar = ({ onUserIconClick, setShowLogin }) => {
  const pathname = useLocation().pathname;
  const [cartCount] = useState(0);

  const handleUserIconClick = () => {
    if (typeof onUserIconClick === "function") {
      onUserIconClick();
      return;
    }

    if (typeof setShowLogin === "function") {
      setShowLogin(true);
    }
  };

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Menu", path: "/menu" },
    { name: "Our Service", path: "/services" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav className="w-full sticky top-0 z-50 bg-linear-to-r from-orange-600/90 via-amber-500/85 to-orange-400/80 backdrop-blur-lg border-b border-orange-300/30 shadow-[0_4px_24px_rgba(251,146,60,0.35)]">
      <div className="w-full px-4 sm:px-6 md:px-10 lg:px-14 xl:px-20">
        <div className="flex items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center shrink-0">
            <div className="navbar-logo">
              <TrueFocus
                sentence="Urban Foods"
                manualMode={false}
                blurAmount={5}
                borderColor="#FDBA74"
                animationDuration={2}
                pauseBetweenAnimations={1}
              />
            </div>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex flex-1 justify-center items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative rounded-full px-4 py-2 text-lg font-bold tracking-wide transition-all duration-300 ${
                  pathname === item.path
                    ? "text-white bg-white/15 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.25)]"
                    : "text-white hover:text-white hover:bg-white/10"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right Side - Login + Cart */}
          <div className="hidden md:flex items-center gap-5 shrink-0 ml-auto">
            <button
              onClick={handleUserIconClick}
              className="flex items-center gap-2 bg-white border border-orange-400 text-orange-500 px-8 py-2.5 rounded-full font-semibold backdrop-blur-sm hover:bg-orange-50 transition-all duration-300 shadow-[0_2px_12px_rgba(0,0,0,0.15)]"
            >
              <svg
                className="w-5 h-5 text-orange-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                />
              </svg>
              <span>Login</span>
            </button>

            <Link
              to="/cart"
              className="relative flex flex-col items-center rounded-xl px-3 py-2 text-white transition-all duration-300 hover:bg-white/10 hover:text-white"
            >
              <div className="relative">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>

                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-white text-[#6B3E26] text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-xs font-bold mt-1">Cart</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
