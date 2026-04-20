import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

const List = ({url, adminToken}) => {

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchList = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${url}/api/food/list`);
      console.log("Full response:", response);
      console.log("Response data:", response.data);
      
      if (response.data.success) {
        console.log("Food items:", response.data.data);
        setList(response.data.data);
      } else {
        console.log("API returned success: false");
        toast.error("Error: " + (response.data.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Fetch error:", error);
      console.error("Error response:", error.response);
      toast.error("Failed to fetch food items: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  const removeFood = async (foodId) => {
    try {
      const response = await axios.post(`${url}/api/food/remove`, { id: foodId }, {
        headers: {
          token: adminToken,
          Authorization: `Bearer ${adminToken}`,
        },
      });
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList(); 
      } else {
        toast.error("Error removing food item");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to remove food item");
    }
  }

  useEffect(() => {
    fetchList();
  }, [])

  return (
    <div className='mx-auto w-full max-w-6xl px-4 py-6 md:px-8'>
        <p className='mb-4 text-xl font-bold tracking-tight text-zinc-900'>All Foods List</p>
        {loading ? (
          <p className='text-sm text-zinc-500'>Loading...</p>
        ) : list.length === 0 ? (
          <p className='text-sm text-zinc-500'>No food items found. Check console for errors.</p>
        ) : (
          <div className='overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm'>
            <div className='hidden grid-cols-[0.7fr_2fr_1.2fr_1fr_0.8fr] items-center gap-3 border-b border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-bold text-zinc-700 md:grid'>
                <b>Image</b>
                <b>Name</b>
                <b>Category</b>
                <b>Price</b>
                <b>Action</b>
            </div>
            {list.map((item,index)=>{
                return (
                    <div
                      key={index}
                      className='grid grid-cols-1 gap-3 border-b border-zinc-100 px-4 py-4 last:border-b-0 md:grid-cols-[0.7fr_2fr_1.2fr_1fr_0.8fr] md:items-center'
                    >
                       <img src={`${url}/images/`+item.image} alt='' className='h-14 w-14 rounded-lg object-cover' />
                       <p className='text-sm font-semibold text-zinc-800'>{item.name}</p>
                       <p className='text-sm text-zinc-600'>{item.category}</p>
                       <p className='text-sm font-medium text-zinc-700'>LKR {item.price}</p>
                       <button
                         type='button'
                         onClick={()=>removeFood(item._id)}
                         className='w-fit rounded-md bg-red-50 px-3 py-1.5 text-sm font-semibold text-red-600 transition hover:bg-red-100'
                       >
                         Remove
                       </button>
                    </div>
                )
            })}
          </div>
        )}
    </div>
  )
}

export default List