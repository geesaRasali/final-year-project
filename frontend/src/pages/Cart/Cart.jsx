import React, { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cartItems, food_list, removeFromCart, getTotalCartAmount, url } =
    useContext(StoreContext);

  const subtotal = getTotalCartAmount();
  const deliveryFee = subtotal === 0 ? 0 : 2;
  const total = subtotal + deliveryFee;
  const cartRows = (food_list || []).filter((item) => cartItems[item._id] > 0);

  const navigate = useNavigate();

  return (
    <div className="mt-24">
      <div className="overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm">
        <div className="hidden grid-cols-[72px_1.5fr_1fr_1fr_1fr_80px] items-center px-4 py-3 text-sm font-semibold text-zinc-500 md:grid">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p className="text-center">Remove</p>
        </div>
        <div className="h-px bg-zinc-200" />

        {cartRows.length === 0 ? (
          <p className="px-4 py-8 text-center text-zinc-500">Your cart is empty.</p>
        ) : (
          cartRows.map((item) => {
            const imageUrl =
              typeof item.image === "string"
                ? url + "/images/" + item.image
                : item.image;

            return (
              <div key={item._id} className="border-b border-zinc-200 px-4 py-4 last:border-b-0">
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 md:grid-cols-[72px_1.5fr_1fr_1fr_1fr_80px] md:items-center">
                  <img
                    src={imageUrl}
                    alt={item.name}
                    className="h-12 w-12 rounded-md object-cover"
                  />
                  <p className="self-center font-medium text-zinc-900">{item.name}</p>

                  <p className="text-sm text-zinc-700 md:text-base">${item.price}</p>
                  <p className="text-sm text-zinc-700 md:text-base">{cartItems[item._id]}</p>
                  <p className="text-sm font-semibold text-zinc-900 md:text-base">
                    ${item.price * cartItems[item._id]}
                  </p>

                  <button
                    type="button"
                    onClick={() => removeFromCart(item._id)}
                    className="w-max rounded-md px-2 py-1 text-left text-sm font-bold text-red-600 transition hover:bg-red-50"
                  >
                    x
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="mt-10 flex flex-col-reverse gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex-1 rounded-2xl border border-orange-100 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-zinc-900">Cart Totals</h2>
          <div className="mt-5 flex items-center justify-between text-zinc-600">
            <p>Subtotal</p>
            <p>${subtotal}</p>
          </div>
          <div className="mt-3 flex items-center justify-between text-zinc-600">
            <p>Delivery Fee</p>
            <p>${deliveryFee}</p>
          </div>
          <div className="my-3 h-px bg-zinc-200" />
          <div className="flex items-center justify-between text-zinc-900">
            <b>Total</b>
            <b>${total}</b>
          </div>

          <button
            type="button"
            onClick={() => navigate("/order")}
            className="mt-6 w-full rounded-xl bg-orange-500 px-4 py-3 text-sm font-bold tracking-wide text-white transition hover:bg-orange-600 sm:w-max sm:min-w-52"
          >
            PROCEED TO CHECKOUT
          </button>
        </div>

        <div className="flex-1 rounded-2xl border border-orange-100 bg-white p-6 shadow-sm">
          <div>
            <p className="text-zinc-600">If you have a promo code, enter it here</p>
            <div className="mt-3 flex items-center justify-between rounded-lg bg-zinc-100 p-1">
              <input
                type="text"
                placeholder="Promo code"
                className="w-full bg-transparent px-3 py-2 text-sm text-zinc-700 outline-none"
              />
              <button
                type="button"
                className="rounded-md bg-zinc-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;