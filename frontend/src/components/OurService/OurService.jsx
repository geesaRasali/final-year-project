import React from "react";
import { assets } from "../../assets/assets";
import {
  FaUtensils,
  FaCreditCard,
  FaClipboardList,
  FaUsers,
  FaTruck,
  FaEnvelope,
  FaRobot,
  FaChartBar,
  FaMapMarkedAlt,
} from "react-icons/fa";

const features = [
  {
    icon: <FaUtensils />,
    title: "Easy Online Ordering",
    desc: "Customers can browse the menu, customize meals, and place orders quickly through a smooth online ordering system.",
  },
  {
    icon: <FaCreditCard />,
    title: "Secure Payments",
    desc: "Supports safe online payments and cash-on-delivery options for a flexible and secure checkout experience.",
  },
  {
    icon: <FaClipboardList />,
    title: "Smart Menu Management",
    desc: "Manage food items, prices, availability, and menu updates in real time with ease.",
  },
  {
    icon: <FaUsers />,
    title: "Multi-Role Dashboard",
    desc: "Dedicated access for Admin, Restaurant Staff, Kitchen Staff, and Delivery Staff for better workflow control.",
  },
  {
    icon: <FaMapMarkedAlt />,
    title: "Order Tracking",
    desc: "Track order status from confirmation to preparation and final delivery in real time.",
  },
  {
    icon: <FaRobot />,
    title: "24/7 Chat Support",
    desc: "A built-in chatbot helps customers with inquiries, recommendations, and instant support anytime.",
  },
  {
    icon: <FaEnvelope />,
    title: "Email Updates",
    desc: "Customers receive email notifications for order confirmation, progress updates, and delivery alerts.",
  },
  {
    icon: <FaTruck />,
    title: "Fast Local Delivery",
    desc: "Meals are delivered quickly to nearby customers, ensuring fresh food reaches them on time.",
  },
  {
    icon: <FaChartBar />,
    title: "Best-Selling Items Chart",
    desc: "Displays the most sold food items in chart form, helping admins understand trends and popular dishes.",
  },
];

const stats = [
  { value: "500+", label: "Orders Processed" },
  { value: "4.8★", label: "Customer Rating" },
  { value: "99%", label: "Order Accuracy" },
  { value: "Fast", label: "Local Delivery" },
];

const KeyFeatures = () => {
  return (
    <section className="bg-linear-to-b from-[#fff4e8] via-[#ffe8d1] to-[#ffd2a6]">
      <div
        className="bg-cover bg-center bg-no-repeat py-20"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255, 247, 237, 0.9), rgba(255, 237, 213, 0.92)), url(" +
            assets.ourservice +
            ")",
        }}
      >
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h2 className="text-4xl font-extrabold text-black sm:text-5xl">
            Designed to Elevate Your Online Food Ordering Experience
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-black-50">
            Reliable, seamless, and efficient — our platform is designed to
            simplify online food ordering and management for a smarter
            restaurant experience.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-16">
        <h3 className="text-center text-4xl font-extrabold text-slate-900 sm:text-5xl">
          Our Services
        </h3>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((item, index) => (
            <div
              key={index}
              className="group rounded-[28px] border border-orange-200/90 bg-[#fff9f2] p-8 shadow-[0_10px_30px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-2 hover:border-orange-300 hover:shadow-[0_18px_40px_rgba(249,115,22,0.15)]"
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-2xl text-orange-500 transition duration-300 group-hover:bg-orange-500 group-hover:text-white">
                {item.icon}
              </div>

              <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>

              <p className="mt-3 text-sm leading-7 text-slate-500">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#ffe7cf] py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h3 className="text-center text-2xl font-extrabold text-slate-900 sm:text-5xl">
            Why Choose Us
          </h3>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-orange-200 bg-[#fffaf4] px-8 py-10 text-center shadow-sm"
              >
                <p className="text-5xl font-extrabold text-orange-500">{item.value}</p>
                <p className="mt-4 text-xl font-semibold text-slate-800">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default KeyFeatures;