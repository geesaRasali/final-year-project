import React, { useContext, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'

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
                setCartItems({});
                localStorage.removeItem("cartItems");
                navigate(`/success?orderId=${orderId}`);
            } else {
                navigate("/");
            }
        } catch (error) {
            console.log(error);
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