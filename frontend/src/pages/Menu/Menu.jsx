import React, { useState } from "react";
import ExploreMenu from "../../components/ExploreMenu/ExploreMenu";
import FoodDisplay from "../../components/FoodDisplay/FoodDisplay";

const Menu = () => {
  const [category, setCategory] = useState("All");

  return (
    <section className="min-h-screen w-full bg-[#f7f0e8] py-12">
      <div className="mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        <ExploreMenu category={category} setCategory={setCategory} />
        <FoodDisplay category={category} />
      </div>
    </section>
  );
};

export default Menu;
