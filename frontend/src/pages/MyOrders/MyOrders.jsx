import React, { useContext, useState, useEffect } from 'react';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { assets } from '../../assets/assets';

const MyOrders = () => {
    const { url, token } = useContext(StoreContext);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log("Fetching orders with token:", token);
            console.log("URL:", url + "/api/order/userorders");
            
            const response = await axios.post(url + "/api/order/userorders", {}, { headers: { token } });
            console.log("Orders response:", response.data);
            
            if (response.data.success) {
                setData(response.data.data || []);
            } else {
                setError(response.data.message || "Failed to fetch orders");
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
            setError("Failed to load orders. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (token) {
            fetchOrders();
        } else {
            setLoading(false);
            setError("Please log in to view your orders");
        }
    }, [token])

    if (loading) {
        return (
            <div className="my-12">
                <h2 className="mb-[30px] text-2xl font-bold text-black">My Orders</h2>
                <div className="p-10 text-center text-lg text-[#666]">Loading your orders...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="my-12">
                <h2 className="mb-[30px] text-2xl font-bold text-black">My Orders</h2>
                <div className="rounded-lg border border-[#ff4444] bg-[#fff5f5] p-10 text-center text-lg text-[#ff4444]">{error}</div>
            </div>
        );
    }

    return (
        <div className="my-12">
            <h2 className="mb-[30px] text-2xl font-bold text-black">My Orders</h2>
            <div className="mt-[30px] flex flex-col gap-5">
                {data.length === 0 ? (
                    <div className="p-[60px_20px] text-center text-lg text-[#666]">
                        <p>No orders found. Start ordering some delicious food!</p>
                    </div>
                ) : (
                    data.map((order, index) => (
                        <div
                            key={order._id || index}
                            className="grid grid-cols-[0.5fr_2fr_1fr_1fr_2fr_1fr] items-center gap-[30px] rounded border border-black p-[10px_15px] text-[13px] text-[#454545] max-[900px]:grid-cols-[1fr_2fr_1fr] max-[900px]:gap-y-[5px] max-[900px]:text-xs"
                        >
                            <img
                                src={assets.parcel_icon}
                                alt="Order"
                                className="w-[50px] max-[900px]:justify-self-center"
                            />
                            <p>{order.items && order.items.map((item, itemIndex) => {
                                if (itemIndex === order.items.length - 1) {
                                    return item.name + " x " + item.quantity;
                                } else {
                                    return item.name + " x " + item.quantity + ", ";
                                }
                            })}</p>
                            <p>LKR {order.amount}.00</p>
                            <p>Items: {order.items ? order.items.length : 0}</p>
                            <p><span className="text-[tomato]">&#x25cf;</span> <b className="font-medium text-[#454545]">{order.status || "Food Processing"}</b></p>
                            <button
                                onClick={fetchOrders}
                                className="cursor-pointer rounded bg-[#ffe1e1] px-0 py-3 text-[#454545] transition-colors hover:bg-[#ffcfcf]"
                            >
                                Track Order
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default MyOrders