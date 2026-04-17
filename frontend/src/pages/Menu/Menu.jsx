import React, { useState } from "react";
import ExploreMenu from "../../components/ExploreMenu/ExploreMenu";
import FoodDisplay from "../../components/FoodDisplay/FoodDisplay";

const Menu = () => {
  const [category, setCategory] = useState("All");

  return (
    <section className="min-h-screen w-full bg-linear-to-br from-[#fff4e8] via-[#ffe2c3] to-[#f6b173] py-12">
      <div className="mx-auto w-full max-w-screen-2xl rounded-3xl border border-orange-200/70 bg-white/55 px-4 py-6 shadow-[0_14px_35px_rgba(0,0,0,0.08)] backdrop-blur-[2px] sm:px-6 lg:px-8">
        <ExploreMenu category={category} setCategory={setCategory} />
        <FoodDisplay category={category} />
      </div>
    </section>
  );
};

export default Menu;
