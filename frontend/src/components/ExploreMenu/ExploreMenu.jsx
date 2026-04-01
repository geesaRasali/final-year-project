"use client";

import { menu_list } from "../../assets/assets";

const ExploreMenu = ({ category, setCategory }) => {
  return (
    <section id="explore-menu" className="mb-14 w-full">
      <div className="rounded-[30px] bg-[#f2f4f7] px-6 py-10 sm:px-8 lg:px-10">
        <div className="mb-10">
          <h2 className="text-4xl font-extrabold leading-tight text-slate-900 sm:text-5xl lg:text-[56px]">
            Explore our <span className="text-orange-500">menu</span>
          </h2>
          <p className="mt-4 max-w-6xl text-base leading-relaxed text-slate-600 sm:text-lg">
            Choose from a diverse menu featuring a delectable array of dishes.
            Our mission is to satisfy your cravings and elevate your dining
            experience, one delicious meal at a time.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
          {menu_list.map((item) => {
            const isActive = category === item.menu_name;
            const menuImageSrc =
              typeof item.menu_image === "string"
                ? item.menu_image
                : item.menu_image?.src;

            return (
              <button
                key={item.menu_name}
                type="button"
                aria-pressed={isActive}
                onClick={() =>
                  setCategory((prev) =>
                    prev === item.menu_name ? "All" : item.menu_name,
                  )
                }
                className="group flex flex-col items-center text-center transition-all duration-300"
              >
                <div
                  className={`relative rounded-full border border-slate-200 bg-white p-1.5 transition-all duration-300 ${
                    isActive
                      ? "ring-4 ring-orange-500/80 shadow-[0_12px_30px_rgba(249,115,22,0.28)]"
                      : "shadow-sm group-hover:-translate-y-1 group-hover:shadow-[0_12px_24px_rgba(15,23,42,0.12)]"
                  }`}
                >
                  <div className="rounded-full bg-white p-0.5">
                    <img
                      src={menuImageSrc}
                      alt={item.menu_name}
                      className="h-24 w-24 rounded-full object-cover sm:h-28 sm:w-28"
                      loading="lazy"
                    />
                  </div>
                </div>

                <span
                  className={`mt-4 text-base font-semibold transition-colors duration-300 ${
                    isActive
                      ? "text-orange-500"
                      : "text-slate-700 group-hover:text-orange-500"
                  }`}
                >
                  {item.menu_name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ExploreMenu;
