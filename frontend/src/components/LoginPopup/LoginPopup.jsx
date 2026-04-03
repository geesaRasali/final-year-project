import React, { useContext, useState } from 'react'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'

const LoginPopup = ({ setShowLogin, isOpen, onClose }) => {
  const { url, setToken, setUser } = useContext(StoreContext)
  const [currState, SetCurrState] = useState('Sign Up')
  const [data, setData] = useState({
    name: '',
    email: '',
    username: '',
    password: ''
  })

    const closePopup = () => {
      if (typeof onClose === 'function') {
        onClose();
      } else if (typeof setShowLogin === 'function') {
        setShowLogin(false);
      }
    };

    if (isOpen === false) {
      return null;
    }

      const onChangeHandler = (event) =>{
        const name = event.target.name
        const value = event.target.value
        setData(data=>({...data,[name]:value}))
      }

      
      const onLogin = async (event) =>{
        event.preventDefault();
        
        let newUrl = url;
        if (currState === "Login") {
          newUrl += "/api/user/login"
        } else {
          newUrl += "/api/user/register"
        }
        
        const payload = currState === "Login"
          ? { username: data.username, password: data.password }
          : {
              name: data.name,
              email: data.email,
              username: data.username,
              password: data.password,
            };

        try {
          const response = await axios.post(newUrl, payload);
          
          if (response.data.success) {
            setToken(response.data.token);
            localStorage.setItem("token", response.data.token);

            if (response.data.user) {
              setUser(response.data.user);
              localStorage.setItem("user", JSON.stringify(response.data.user));
            }

            closePopup();
          } else {
            alert(response.data.message);
          }
        } catch (error) {
          console.error("Login/Register error:", error);
          alert("An error occurred. Please try again.");
        }
      }
     

  return (
    <div className='fixed inset-0 z-50 grid place-items-center bg-black/55 p-4'>
      <form onSubmit={onLogin} className='relative w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl'>
        <img onClick={closePopup} src={assets.cross_icon} alt='Close popup' className='absolute right-5 top-5 z-10 h-4 w-4 cursor-pointer opacity-80 transition hover:opacity-100'/>

        <div className='grid min-h-136 grid-cols-1 md:grid-cols-[1fr_1.05fr]'>
          <div className='relative hidden md:flex md:flex-col justify-between p-10 text-white overflow-hidden'>

  {/* BACKGROUND IMAGE */}
  <img
    src={assets.login_jpg}
    alt='Kitchen Dashboard'
    className='absolute inset-0 h-full w-full object-cover'
  />

  {/* DARK OVERLAY */}
  <div className='absolute inset-0 bg-linear-to-br from-black/70 via-orange-950/55 to-amber-900/60' />

  {/* CONTENT */}
  <div className='relative z-10'>
    <h2 className='text-[2.55rem] font-extrabold leading-[1.06] tracking-tight'>
      {currState === 'Login' ? (
        <>
          Welcome{' '}
          <span className='bg-linear-to-r from-orange-300 to-orange-500 bg-clip-text text-transparent'>Back</span>
        </>
      ) : (
        <>
          Welcome to{' '}
          <span className='bg-linear-to-r from-orange-300 to-orange-500 bg-clip-text text-transparent'>Urban Foods</span>
        </>
      )}
    </h2>
              <ul className='mt-7 space-y-3 text-[1.00rem] font-semibold tracking-tight text-white/95'>
                <li>Fresh and organic foods</li>
                <li>Fast and reliable delivery</li>
                <li>32+ delicious items</li>
              </ul>
            </div>
          </div>

          <div className='flex flex-col justify-center p-8 text-zinc-600 sm:p-12'>
            <h3 className='text-[2.35rem] font-extrabold leading-[1.06] tracking-tight text-[#111827]'>
              {currState === 'Login' ? (
                <>
                  Sign in to your{' '}
                  <span className='bg-linear-to-r from-[#EA580C] to-[#FB923C] bg-clip-text text-transparent'>account</span>
                </>
              ) : (
                <>
                  Create your{' '}
                  <span className='bg-linear-to-r from-[#EA580C] to-[#FB923C] bg-clip-text text-transparent'>account</span>
                </>
              )}
            </h3>

            <p className='mt-2 text-lg text-zinc-500'>
              {currState === 'Login' ? (
                <>
                  Don&apos;t have an account?{' '}
                  <span onClick={()=>SetCurrState('Sign Up')} className='cursor-pointer font-medium text-orange-500 hover:text-orange-600'>Join here</span>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <span onClick={()=>SetCurrState('Login')} className='cursor-pointer font-medium text-orange-500 hover:text-orange-600'>Sign in</span>
                </>
              )}
            </p>

            <div className='mt-8 flex flex-col gap-4'>
              {currState === 'Login' ? null : (
                <input
                  name='name'
                  onChange={onChangeHandler}
                  value={data.name}
                  type='text'
                  placeholder='Enter your name'
                  required
                  className='w-full rounded-xl border border-zinc-300 px-5 py-3 text-base text-zinc-800 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200'
                />
              )}
              {currState === 'Login' ? (
                <input
                  name='username'
                  onChange={onChangeHandler}
                  value={data.username}
                  type='text'
                  placeholder='Enter username or email'
                  required
                  className='w-full rounded-xl border border-zinc-300 px-5 py-3 text-base text-zinc-800 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200'
                />
              ) : (
                <>
                  <input
                    name='email'
                    onChange={onChangeHandler}
                    value={data.email}
                    type='email'
                    placeholder='Enter your email'
                    required
                    className='w-full rounded-xl border border-zinc-300 px-5 py-3 text-base text-zinc-800 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200'
                  />
                  <input
                    name='username'
                    onChange={onChangeHandler}
                    value={data.username}
                    type='text'
                    placeholder='Choose a username'
                    required
                    className='w-full rounded-xl border border-zinc-300 px-5 py-3 text-base text-zinc-800 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200'
                  />
                </>
              )}
              <input
                name='password'
                type='password'
                onChange={onChangeHandler}
                value={data.password}
                placeholder='Enter your password'
                required
                className='w-full rounded-xl border border-zinc-300 px-5 py-3 text-base text-zinc-800 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200'
              />
            </div>

            <button type='submit' className='mt-6 w-full rounded-xl bg-orange-500 px-4 py-3 text-xl font-extrabold tracking-tight text-white transition hover:bg-orange-600 active:scale-[0.98]'>
              {currState === 'Sign Up' ? 'Create Account' : 'Continue'}
            </button>

            <div className='mt-4 flex items-start gap-2'>
              <input type='checkbox' required className='mt-1 h-4 w-4 accent-orange-500'/>
              <p className='text-sm leading-5 text-zinc-500'>By continuing, I agree to the terms of use & privacy policy.</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default LoginPopup