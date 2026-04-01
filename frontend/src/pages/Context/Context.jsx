import React, { useContext, useMemo } from "react";
import { StoreContext } from "../../context/StoreContext";

const Context = () => {
  const { food_list, cartItems, token, getTotalCartAmount } = useContext(StoreContext);

  const totalItems = useMemo(() => {
    return Object.values(cartItems || {}).reduce((sum, qty) => {
      return qty > 0 ? sum + qty : sum;
    }, 0);
  }, [cartItems]);

  const cartPreview = useMemo(() => {
    return Object.entries(cartItems || {})
      .filter(([, qty]) => qty > 0)
      .slice(0, 6)
      .map(([id, qty]) => {
        const product = (food_list || []).find((item) => item._id === id);
        return {
          id,
          qty,
          name: product?.name || "Unknown item",
          price: product?.price || 0,
        };
      });
  }, [cartItems, food_list]);

  return (
    <section className="min-h-screen bg-linear-to-b from-orange-50 via-white to-orange-100 px-4 py-10 sm:px-8 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-4xl font-extrabold tracking-tight text-[#111827] sm:text-5xl">
          Store Context Dashboard
        </h1>
        <p className="mt-3 text-base text-zinc-600 sm:text-lg">
          This page shows live data from your React StoreContext provider.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-orange-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold uppercase text-zinc-500">Auth Status</p>
            <p className="mt-2 text-xl font-bold text-zinc-900">{token ? "Logged In" : "Guest"}</p>
          </div>

          <div className="rounded-2xl border border-orange-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold uppercase text-zinc-500">Foods Loaded</p>
            <p className="mt-2 text-xl font-bold text-zinc-900">{food_list?.length || 0}</p>
          </div>

          <div className="rounded-2xl border border-orange-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold uppercase text-zinc-500">Cart Quantity</p>
            <p className="mt-2 text-xl font-bold text-zinc-900">{totalItems}</p>
          </div>

          <div className="rounded-2xl border border-orange-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold uppercase text-zinc-500">Cart Total</p>
            <p className="mt-2 text-xl font-bold text-zinc-900">Rs. {getTotalCartAmount()}</p>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-orange-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-zinc-900">Cart Preview</h2>

          {cartPreview.length === 0 ? (
            <p className="mt-3 text-zinc-600">No items in cart yet.</p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-130 border-collapse text-left">
                <thead>
                  <tr className="border-b border-orange-100 text-sm text-zinc-600">
                    <th className="py-3 pr-4 font-semibold">Item</th>
                    <th className="py-3 pr-4 font-semibold">Qty</th>
                    <th className="py-3 pr-4 font-semibold">Price</th>
                    <th className="py-3 font-semibold">Line Total</th>
                  </tr>
                </thead>
                <tbody>
                  {cartPreview.map((item) => (
                    <tr key={item.id} className="border-b border-orange-50 text-sm text-zinc-700">
                      <td className="py-3 pr-4">{item.name}</td>
                      <td className="py-3 pr-4">{item.qty}</td>
                      <td className="py-3 pr-4">Rs. {item.price}</td>
                      <td className="py-3">Rs. {item.price * item.qty}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Context;
