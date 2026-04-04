import React, { useContext, useState } from "react";
import { StoreContext } from "../context/StoreContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const {
    cartItems,
    food_list,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
  } = useContext(StoreContext);
  const [quantityDrafts, setQuantityDrafts] = useState({});

  const subtotal = getTotalCartAmount();
  const deliveryFee = subtotal === 0 ? 0 : 2;
  const total = subtotal + deliveryFee;
  const cartRows = (food_list || []).filter((item) => cartItems[item._id] > 0);

  const navigate = useNavigate();

  const updateQuantity = async (itemId, targetQty) => {
    const currentQty = cartItems[itemId] || 0;
    const nextQty = Math.max(0, Math.min(99, Number(targetQty) || 0));

    if (nextQty === currentQty) return;

    if (nextQty > currentQty) {
      for (let i = 0; i < nextQty - currentQty; i += 1) {
        await addToCart(itemId);
      }
    } else {
      for (let i = 0; i < currentQty - nextQty; i += 1) {
        await removeFromCart(itemId);
      }
    }
  };

  const handleDraftChange = (itemId, value) => {
    if (/^\d*$/.test(value)) {
      setQuantityDrafts((prev) => ({ ...prev, [itemId]: value }));
    }
  };

  const commitDraft = async (itemId) => {
    const draftValue = quantityDrafts[itemId];
    if (draftValue === undefined) return;

    await updateQuantity(itemId, draftValue === "" ? 0 : Number(draftValue));

    setQuantityDrafts((prev) => {
      const next = { ...prev };
      delete next[itemId];
      return next;
    });
  };

  return (
    <div className="mt-24">
      <div className="overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.08)]">
        <div className="hidden grid-cols-[72px_1.9fr_1fr_1.25fr_1fr_96px] items-center px-5 py-3 text-sm font-semibold text-zinc-500 md:grid">
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
          cartRows.map((item, index) => {
            const imageUrl =
              typeof item.image === "string"
                ? url + "/images/" + item.image
                : item.image;
            const currentQty = cartItems[item._id] || 0;
            const inputValue =
              quantityDrafts[item._id] !== undefined
                ? quantityDrafts[item._id]
                : String(currentQty);

            return (
              <div
                key={item._id}
                className={`border-b border-zinc-200 px-5 py-4 transition-colors duration-200 hover:bg-orange-50/70 last:border-b-0 ${
                  index % 2 === 0 ? "bg-white" : "bg-orange-50/30"
                }`}
              >
                <div className="grid grid-cols-2 gap-x-6 gap-y-3 md:grid-cols-[72px_1.9fr_1fr_1.25fr_1fr_96px] md:items-center">
                  <img
                    src={imageUrl}
                    alt={item.name}
                    className="h-14 w-14 rounded-lg object-cover"
                  />
                  <p className="self-center text-lg font-semibold text-zinc-900">{item.name}</p>

                  <p className="text-sm text-zinc-700 md:text-base">${item.price}</p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => removeFromCart(item._id)}
                      className="h-8 w-8 rounded-full bg-red-100 text-lg font-bold text-red-600 transition hover:bg-red-200"
                    >
                      -
                    </button>
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(event) => handleDraftChange(item._id, event.target.value)}
                      onBlur={() => commitDraft(item._id)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.preventDefault();
                          commitDraft(item._id);
                        }
                      }}
                      className="h-8 w-12 rounded-md border border-zinc-300 bg-white text-center text-sm font-semibold text-zinc-800 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                    />
                    <button
                      type="button"
                      onClick={() => addToCart(item._id)}
                      className="h-8 w-8 rounded-full bg-green-100 text-lg font-bold text-green-600 transition hover:bg-green-200"
                    >
                      +
                    </button>
                  </div>
                  <p className="text-sm font-semibold text-zinc-900 md:text-base">
                    ${item.price * currentQty}
                  </p>

                  <button
                    type="button"
                    onClick={() => updateQuantity(item._id, 0)}
                    className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 text-red-600 transition hover:bg-red-600 hover:text-white"
                    title="Remove item"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7L5 7M10 11v6M14 11v6M7 7l1 12a2 2 0 002 2h4a2 2 0 002-2l1-12M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="mt-14 flex flex-col-reverse gap-8 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex-1 rounded-2xl border border-orange-100 bg-white p-7 shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
          <h2 className="text-2xl font-bold text-zinc-900">Cart Totals</h2>
          <div className="mt-5 flex items-center justify-between text-zinc-600">
            <p>Subtotal</p>
            <p>${subtotal}</p>
          </div>
          <div className="mt-3 flex items-center justify-between text-zinc-600">
            <p>Delivery Fee</p>
            <p>${deliveryFee}</p>
          </div>
          <div className="my-4 h-px bg-zinc-200" />
          <div className="flex items-end justify-between text-zinc-900">
            <b className="text-lg">Total</b>
            <b className="text-3xl leading-none">${total}</b>
          </div>

          <button
            type="button"
            onClick={() => navigate("/order")}
            className="mt-7 w-full rounded-xl bg-orange-500 px-5 py-3.5 text-base font-bold tracking-wide text-white shadow-[0_10px_20px_rgba(249,115,22,0.32)] transition duration-200 hover:scale-[1.02] hover:bg-orange-600 active:scale-[0.99] sm:w-max sm:min-w-56"
          >
            PROCEED TO CHECKOUT
          </button>
        </div>

        <div className="flex-1 rounded-2xl border border-orange-100 bg-white p-7 shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
          <div>
            <p className="text-zinc-600">If you have a promo code, enter it here</p>
            <div className="mt-3 flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 p-1.5 sm:w-max">
              <input
                type="text"
                placeholder="Promo code"
                className="w-44 rounded-md border border-transparent bg-white px-3 py-2 text-sm text-zinc-700 outline-none transition placeholder:text-zinc-400 focus:border-orange-300 focus:ring-2 focus:ring-orange-100"
              />
              <button
                type="button"
                className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800"
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