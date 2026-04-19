import React, { useState } from 'react'
import { assets } from '../../assets/assets'
import axios from 'axios'
import { toast } from 'react-toastify'

const Add = ({ url, adminToken }) => {

    const [image, setImage] = useState(false);
    const [data, setData] = useState({
        name: "",
        description: "",
        price: "",
        category: "Salad"
    })

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }))
    }

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append("name", data.name)
        formData.append("description", data.description)
        formData.append("price", Number(data.price))
        formData.append("category", data.category)
        formData.append("image", image)

        const response = await axios.post(`${url}/api/food/add`, formData, {
            headers: {
                token: adminToken,
                Authorization: `Bearer ${adminToken}`,
            },
        });
        if (response.data.success) {
            setData({
                name: "",
                description: "",
                price: "",
                category: "Salad"
            })
            setImage(false)
            toast.success(response.data.message)

        }
        else {
            toast.error(response.data.message)
        }

    }


    return (
        <div className='w-full px-4 py-6 md:px-8'>
            <div className='mx-auto w-full max-w-4xl rounded-2xl border border-orange-100 bg-white p-5 shadow-sm md:p-7'>
                <div className='mb-5'>
                    <h2 className='text-2xl font-bold tracking-tight text-zinc-900'>Add Food Item</h2>
                    <p className='mt-1 text-sm text-zinc-500'>Create a new menu item for your store.</p>
                </div>

                <form className='flex flex-col gap-5' onSubmit={onSubmitHandler}>
                    <div className='flex flex-col gap-2'>
                        <p className='text-sm font-semibold text-zinc-700'>Upload Image</p>
                        <label htmlFor='image' className='w-fit cursor-pointer'>
                            <img
                                src={image ? URL.createObjectURL(image) : assets.upload_area}
                                alt='Upload preview'
                                className='h-30 w-30 rounded-xl border border-zinc-200 object-cover'
                            />
                        </label>
                        <input onChange={(e) => setImage(e.target.files[0])} type='file' id='image' hidden required />
                    </div>

                    <div className='flex flex-col gap-2'>
                        <p className='text-sm font-semibold text-zinc-700'>Product Name</p>
                        <input
                            onChange={onChangeHandler}
                            value={data.name}
                            type='text'
                            name='name'
                            placeholder='Type here'
                            required
                            className='w-full rounded-lg border border-zinc-300 px-3 py-2.5 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100'
                        />
                    </div>

                    <div className='flex flex-col gap-2'>
                        <p className='text-sm font-semibold text-zinc-700'>Product Description</p>
                        <textarea
                            onChange={onChangeHandler}
                            value={data.description}
                            name='description'
                            rows="6"
                            placeholder='Write content here'
                            required
                            className='w-full rounded-lg border border-zinc-300 px-3 py-2.5 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100'
                        />
                    </div>

                    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                        <div className='flex flex-col gap-2'>
                            <p className='text-sm font-semibold text-zinc-700'>Product Category</p>
                            <select
                                onChange={onChangeHandler}
                                value={data.category}
                                name='category'
                                className='rounded-lg border border-zinc-300 px-3 py-2.5 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100'
                            >
                                <option value="Salad">Salad</option>
                                <option value="Rolls">Rolls</option>
                                <option value="Deserts">Deserts</option>
                                <option value="Sandwich">Sandwich</option>
                                <option value="Cake">Cake</option>
                                <option value="Pure Veg">Pure Veg</option>
                                <option value="Pasta">Pasta</option>
                                <option value="Noodles">Noodles</option>
                            </select>
                        </div>

                        <div className='flex flex-col gap-2'>
                            <p className='text-sm font-semibold text-zinc-700'>Product Price</p>
                            <input
                                onChange={onChangeHandler}
                                value={data.price}
                                type='number'
                                name='price'
                                placeholder='$20'
                                min='0'
                                step='0.01'
                                required
                                className='rounded-lg border border-zinc-300 px-3 py-2.5 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100'
                            />
                        </div>
                    </div>

                    <button
                        type='submit'
                        className='mt-1 w-full rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800 sm:w-44'
                    >
                        Add Item
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Add