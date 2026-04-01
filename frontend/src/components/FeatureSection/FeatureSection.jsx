import React from "react";
import chefmeal from "../../assets/chefmeal.png";
import ingredients from "../../assets/ingredients.png";
import delivery from "../../assets/delivery.png";
import ordering from "../../assets/online-ordering.png";
import service from "../../assets/service.png";
const features = [
  {
    title: "Chef Crafted Meals",
    description:
      "Delicious meals prepared fresh every day by our experienced chefs using rich flavors and care. Every dish is made to give you a satisfying and memorable taste experience.",
    image: chefmeal,
  },
  {
    title: "Fresh Ingredients",
    description:
      "We use only high-quality, fresh ingredients to ensure every meal is healthy and full of flavor. Carefully selected items bring out the best taste in every bite.",
    image: ingredients,
  },
  {
    title: "Fast Delivery",
    description:
      "Enjoy your favorite meals delivered quickly while still hot and ready to eat. We make sure your food reaches you fresh and on time.",
    image: delivery,
  },
  {
    title: "Easy Online Ordering",
    description:
      "Order your favorite dishes easily through our simple and user-friendly system. Just a few clicks and your meal is on the way.",
    image: ordering,
  },
  {
    title: "Quality Service",
    description:
      "We focus on clean preparation, friendly service, and customer satisfaction. Your comfort and happiness are always our priority.",
    image: service,
  },
];

const FeatureSection = () => {
  return (
    <section className="w-full bg-gradient-to-b from-[#fff7ef] via-[#fffaf5] to-[#fff1e6] py-16">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <h3 className="mb-3 text-center text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Our{" "}
          <span className="rounded-md bg-orange-600 px-2.5 py-0.5 text-white">
            Features
          </span>
        </h3>
        <p className="mx-auto max-w-2xl text-center text-sm leading-7 text-slate-600 sm:text-base"></p>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature, index) => (
            <article
              key={feature.title}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-orange-300 hover:shadow-xl"
            >
              <div className="mb-5 inline-flex rounded-2xl bg-orange-50 p-3 ring-1 ring-orange-100">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="h-[78px] w-[78px] object-contain transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"
                  loading={index === 0 ? "eager" : "lazy"}
                />
              </div>

              <h3 className="mb-3 text-xl font-semibold text-slate-900">
                {feature.title}
              </h3>
              <p className="mb-5 text-sm leading-7 text-slate-600">
                {feature.description}
              </p>

              <button
                type="button"
                className="relative text-sm font-semibold text-orange-400 after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-orange-400 after:transition-all after:duration-300 group-hover:after:w-full"
              >
                Learn More
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
