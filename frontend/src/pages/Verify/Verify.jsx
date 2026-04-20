import React, { useContext, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'
import toast from 'react-hot-toast'

const Verify = () => {
    const [searchParams] = useSearchParams();
    const success = searchParams.get("success")
    const orderId = searchParams.get("orderId")
    const { url, setCartItems } = useContext(StoreContext);
    const navigate = useNavigate();

    const verifyPayment = async () => {
        if (!orderId || success === null) {
            navigate("/");
            return;
        }

        try {
            const response = await axios.post(url + "/api/order/verify", {
                success,
                orderId
            });
            
            if (response.data.success) {
                const emailStatus = response.data.emailStatus || "unknown";
                if (emailStatus === "sent") {
                    toast.success("Payment successful. Order placed. Confirmation email sent.");
                } else if (emailStatus.startsWith("error:")) {
                    toast.error(`Payment successful. Order placed. Email failed: ${emailStatus}`);
                } else {
                    toast.success("Payment successful. Order placed.");
                }

                setCartItems({});
                localStorage.removeItem("cartItems");
                navigate(`/success?orderId=${orderId}`);
            } else {
                toast.error("Payment was not successful. Order not placed.");
                navigate("/");
            }
        } catch (error) {
            console.log(error);
            toast.error("Could not verify payment. Please contact support.");
            navigate("/");
        }
    }

    useEffect(() => {
        verifyPayment();
    }, [orderId, success])

    return (
        <div className="grid min-h-[60vh] place-items-center">
            <div className="h-[100px] w-[100px] rounded-full border-[5px] border-[#bdbdbd] border-t-[tomato] animate-spin"></div>
        </div>
    )
}

export default Verify