import React, { useContext, useEffect, useState } from 'react'
import { StoreContext } from '../../context/StoreContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const PlaceOrder = () => {

  const {getTotalCartAmount,token,food_list,cartItems,url} = useContext(StoreContext)
   const navigate = useNavigate()
  const subtotal = getTotalCartAmount()
  const deliveryFee = subtotal === 0 ? 0 : 2
  const total = subtotal + deliveryFee
  const inputClass = 'w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-zinc-800 outline-none transition placeholder:text-zinc-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-100'
   
   const [data,setData] = useState({
      firstName:"",
      lastName:"",
      email:"",
      street:"",
      city:"",
      state:"",
      zipcode:"",
      country:"",
      phone:""

   })
   
   const onChangeHandler = (event) =>{
     const name = event.target.name;
     const value = event.target.value;
     setData(data=>({...data,[name]:value}))
   }

     const placeOrder = async (event) =>{
       event.preventDefault();
       let orderItems = [];
       food_list.forEach((item)=>{
         if (cartItems[item._id]>0){
          orderItems.push({ ...item, quantity: cartItems[item._id] })
         }
       })
       let orderData = {
        address:data,
        items:orderItems,
        amount:total
       }
       try {
         let response = await axios.post(url+"/api/order/place",orderData,{headers:{token}});
         if (response.data.success) {
           const {success_url} = response.data;
           window.location.replace(success_url);
         }
         else{
           alert("Error placing order");
         }
       } catch (error) {
         console.error("Error:", error);
         alert("Network error. Please try again.");
       }
   }

   useEffect(()=>{
     if (!token) {
       navigate('/cart')
     }
     else if(subtotal===0)
     {
       navigate('/cart')
     }
   },[token, subtotal, navigate])

  return (
    <form onSubmit={placeOrder} className='mt-10 mb-26 flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between'>
      <div className="w-full lg:max-w-140">
        <p className='mb-6 text-3xl font-bold text-slate-900'>Delivery Information</p>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <input required name='firstName' onChange={onChangeHandler} value={data.firstName} type="text" placeholder='First Name' className={inputClass} />
          <input required name="lastName" onChange={onChangeHandler} value={data.lastName} type="text" placeholder='Last Name' className={inputClass} />

          <input required name="email" onChange={onChangeHandler} value={data.email} type='email' placeholder='Email address' className={`${inputClass} sm:col-span-2`} />
          <input required name='street' onChange={onChangeHandler} value={data.street} type='text' placeholder='Street' className={`${inputClass} sm:col-span-2`} />

          <input required name='city' onChange={onChangeHandler} value={data.city} type="text" placeholder='City' className={inputClass} />
          <input required name="state" onChange={onChangeHandler} value={data.state} type="text" placeholder='State' className={inputClass} />

          <input required name='zipcode' onChange={onChangeHandler} value={data.zipcode} type="text" placeholder='Zip code' className={inputClass} />
          <input required name="country" onChange={onChangeHandler} value={data.country} type="text" placeholder='Country' className={inputClass} />

          <input required name="phone" onChange={onChangeHandler} value={data.phone} type="text" placeholder='Phone' className={`${inputClass} sm:col-span-2`} />
        </div>
      </div>

      <div className="w-full lg:max-w-105">
            <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
                  <h2 className='text-2xl font-bold text-zinc-900'>Cart Totals</h2>
                  <div className='mt-5'>
         <div className="flex items-center justify-between text-zinc-600">
            <p>Subtotal</p>
            <p>${subtotal}</p>
          </div>
          <div className="mt-3 flex items-center justify-between text-zinc-500">
            <p>Delivery Fee</p>
            <p>${deliveryFee}</p>
          </div>
          <div className='my-4 h-px bg-zinc-200' />
          <div className="flex items-center justify-between text-zinc-900">
            <b className='text-lg'>Total</b>
            <b className='text-2xl'>${total}</b>
          </div>
          <button type="submit" className='mt-6 w-full rounded-xl bg-orange-500 px-5 py-3.5 text-base font-bold tracking-wide text-white shadow-[0_10px_20px_rgba(249,115,22,0.32)] transition duration-200 hover:scale-[1.02] hover:bg-orange-600 active:scale-[0.99]'>PROCEED TO PAYMENT</button>
        </div>
            </div>
      </div>
    </form>
  )
}

export default PlaceOrder