import React, { useContext, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'
import "./Verify.css"

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
        <div className='verify'>
            <div className="spinner"></div>
        </div>
    )
}

export default Verify