import React, { useContext } from "react";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";

const FoodItem = ({ id, name, price, description, image }) => {
  const store = useContext(StoreContext) || {};
  const {
    cartItems = {},
    addToCart = () => {},
    removeFromCart = () => {},
    url = "",
  } = store;
  const quantity = cartItems[id] ?? 0;

  const imageUrl =
    typeof image === "string" && !image.startsWith("data:") && !image.startsWith("http")
      ? `${url}/images/${image}`
      : image;

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-3xl border border-[#f0e5db] bg-white shadow-[0_8px_22px_rgba(15,23,42,0.08)] transition duration-300 ease-out hover:-translate-y-1 hover:cursor-pointer hover:shadow-[0_18px_34px_rgba(249,115,22,0.17)]">
      <div className="relative m-2 aspect-[4/3] overflow-hidden rounded-[18px]">
        <img className="block h-full w-full object-cover" src={imageUrl} alt={name} />

        {!quantity ? (
          <img
            className="absolute bottom-4 right-4 w-[38px] cursor-pointer rounded-full shadow-[0_8px_18px_rgba(15,23,42,0.2)]"
            onClick={() => addToCart(id)}
            src={assets.add_icon_white}
            alt="Add"
          />
        ) : (
          <div className="absolute bottom-4 right-4 flex items-center gap-2.5 rounded-[50px] bg-white p-[7px] shadow-[0_8px_20px_rgba(15,23,42,0.16)]">
            <img
              className="w-[30px] cursor-pointer"
              onClick={() => removeFromCart(id)}
              src={assets.remove_icon_red}
              alt="Remove"
            />
            <p className="m-0 font-medium">{quantity}</p>
            <img
              className="w-[30px] cursor-pointer"
              onClick={() => addToCart(id)}
              src={assets.add_icon_green}
              alt="Add"
            />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col px-4 pb-4 pt-3">
        <div className="mb-2 flex items-start justify-between gap-2.5">
          <p className="m-0 line-clamp-2 min-h-[48px] text-[22px] leading-[1.1] font-semibold text-slate-900">{name}</p>
          <img className="mt-1 w-[68px]" src={assets.rating_starts} alt="Rating" />
        </div>
        <p className="m-0 line-clamp-2 text-[13px] leading-[1.5] text-slate-500">{description}</p>
        <p className="mt-auto inline-flex items-end gap-2 rounded-lg  px-2.5 py-1.5 text-orange-600">
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em]">LKR</span>
          <span className="text-3xl leading-none font-black">{price}</span>
        </p>
      </div>
    </div>
  );
};

export default FoodItem;