import React, { useContext, useState } from 'react'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'
import { GoogleLogin } from '@react-oauth/google'

const LoginPopup = ({ setShowLogin, isOpen, onClose }) => {
  const { url, setToken, setUser } = useContext(StoreContext)
  const hasGoogleClientId = Boolean((import.meta.env.VITE_GOOGLE_CLIENT_ID || '').trim())
  const [currState, SetCurrState] = useState('Sign Up')
  const [signupType, setSignupType] = useState(null)
  const [data, setData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    role: 'customer',
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

      const showAccountChoice = !signupType
      const isPrivilegedLogin = currState === 'Login' && (signupType === 'admin' || signupType === 'staff')
      const isCustomerLogin = currState === 'Login' && signupType === 'customer'
      const selectedRole = signupType || data.role
      const submitButtonClasses = 'bg-linear-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 hover:shadow-[0_12px_24px_rgba(234,88,12,0.35)]'

      const applyAuthSuccess = (responseUser, token) => {
        const normalizedUser = {
          ...responseUser,
          role: responseUser.role || 'customer',
        }

        setToken(token)
        localStorage.setItem('token', token)
        setUser(normalizedUser)
        localStorage.setItem('user', JSON.stringify(normalizedUser))

        if (normalizedUser.role === 'admin') {
          window.location.href = '/admin'
        } else if (normalizedUser.role === 'staff') {
          window.location.href = '/staff'
        } else {
          window.location.href = '/'
        }

        closePopup()
      }

      const onGoogleLoginSuccess = async (credentialResponse) => {
        try {
          if (!credentialResponse?.credential) {
            alert('Google sign-in did not return a credential.')
            return
          }

          const response = await axios.post(`${url}/api/user/google-login`, {
            credential: credentialResponse.credential,
          })

          if (!response.data.success) {
            alert(response.data.message || 'Google login failed.')
            return
          }

          if (!response.data.user || !response.data.token) {
            alert('Invalid response from server.')
            return
          }

          applyAuthSuccess(response.data.user, response.data.token)
        } catch (error) {
          console.error('Google login error:', error)
          alert('An error occurred during Google login. Please try again.')
        }
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
              role: data.role,
            };

        try {
          const response = await axios.post(newUrl, payload);
          
          if (response.data.success) {
            if (!response.data.user) {
              alert("User data missing in response.");
              return;
            }

            const normalizedUser = {
              ...response.data.user,
              role: response.data.user.role || 'customer',
            };

            if (currState === "Login" && signupType === "admin" && normalizedUser.role !== "admin") {
              alert("This account is not an admin account.");
              return;
            }

            if (currState === "Login" && signupType === "staff" && normalizedUser.role !== "staff") {
              alert("This account is not a staff account.");
              return;
            }

            applyAuthSuccess(normalizedUser, response.data.token)
          } else {
            alert(response.data.message);
          }
        } catch (error) {
          console.error("Login/Register error:", error);
          alert("An error occurred. Please try again.");
        }
      }
     

  return (
    <div className='fixed inset-0 z-50 grid place-items-center bg-black/65 p-4 backdrop-blur-[2px]'>
      <form onSubmit={onLogin} className='relative w-full max-w-5xl overflow-hidden rounded-[30px] border border-white/40 bg-white shadow-[0_25px_70px_rgba(0,0,0,0.35)]'>
        <img onClick={closePopup} src={assets.cross_icon} alt='Close popup' className='absolute right-5 top-5 z-20 h-5 w-5 cursor-pointer opacity-70 transition hover:rotate-90 hover:opacity-100'/>

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

  <div className='absolute -left-14 -top-10 h-52 w-52 rounded-full bg-orange-300/20 blur-3xl' />
  <div className='absolute -bottom-14 -right-10 h-56 w-56 rounded-full bg-amber-200/15 blur-3xl' />

  {/* CONTENT */}
  <div className='relative z-10'>
    <h2 className='text-[2.55rem] font-extrabold leading-[1.06] tracking-tight'>
      Welcome to{' '}
      <span className='bg-linear-to-r from-orange-300 to-orange-500 bg-clip-text text-transparent'>Urban Foods</span>
    </h2>
              <ul className='mt-7 space-y-3 text-[1.00rem] font-semibold tracking-tight text-white/95'>
                <li>Fresh and organic foods</li>
                <li>Fast and reliable delivery</li>
                <li>32+ delicious items</li>
              </ul>

            </div>
          </div>

          <div className='flex flex-col justify-center bg-linear-to-b from-[#fffaf5] to-white p-8 text-zinc-600 sm:p-12'>
            <h3 className='text-[2.35rem] font-extrabold leading-[1.06] tracking-tight text-[#111827]'>
              {currState === 'Login' && showAccountChoice ? (
                <>
                  Choose your{' '}
                  <span className='bg-linear-to-r from-[#EA580C] to-[#FB923C] bg-clip-text text-transparent'>account </span>
                </>
              ) : currState === 'Login' ? (
                <>
                  Sign in to your{' '}
                  <span className='bg-linear-to-r from-[#EA580C] to-[#FB923C] bg-clip-text text-transparent'>account</span>
                </>
              ) : showAccountChoice ? (
                <>
                  Create a new{' '}
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
                showAccountChoice ? (
                  <>Choose account type and continue to login.</>
                ) : isPrivilegedLogin ? (
                  <>
                    {signupType === 'admin' ? 'Admin sign in only.' : 'Staff sign in only.'}{' '}
                    <span
                      onClick={()=>setSignupType(null)}
                      className='cursor-pointer font-medium text-orange-500 hover:text-orange-600'
                    >
                      Switch account type
                    </span>
                  </>
                ) : (
                  <>
                    New customer?{' '}
                    <span
                      onClick={()=>{
                        SetCurrState('Sign Up')
                        setSignupType(null)
                        setData((prev) => ({ ...prev, role: 'customer' }))
                      }}
                      className='cursor-pointer font-medium text-orange-500 hover:text-orange-600'
                    >
                      Create account
                    </span>
                  </>
                )
              ) : (
                <>
                  Already have an account?{' '}
                  <span
                    onClick={()=>{
                      SetCurrState('Login')
                      setSignupType(null)
                    }}
                    className='cursor-pointer font-medium text-orange-500 hover:text-orange-600'
                  >
                    Sign in
                  </span>
                </>
              )}
            </p>

            {showAccountChoice ? (
              <div className='mt-8 space-y-4'>

                <button
                  type='button'
                  onClick={() => {
                    setSignupType('customer')
                    setData((prev) => ({ ...prev, role: 'customer' }))
                  }}
                  className='group w-full rounded-2xl border border-zinc-300 bg-white px-5 py-4 text-left transition hover:-translate-y-0.5 hover:border-zinc-400 hover:shadow-[0_12px_26px_rgba(0,0,0,0.08)]'
                >
                  <span className='block text-xl font-bold text-zinc-800'>
                    {currState === 'Login' ? 'Login as Customer' : 'Continue with Customer'}
                  </span>
                </button>

                <button
                  type='button'
                  onClick={() => {
                    setSignupType('admin')
                    setData((prev) => ({ ...prev, role: 'admin' }))
                    SetCurrState('Login')
                  }}
                  className='group w-full rounded-2xl border border-orange-200 bg-linear-to-r from-orange-50 to-white px-5 py-4 text-left transition hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-[0_12px_26px_rgba(234,88,12,0.14)]'
                >
                  <span className='block text-xl font-bold text-orange-700'>Login as Admin</span>
                </button>

                <button
                  type='button'
                  onClick={() => {
                    setSignupType('staff')
                    setData((prev) => ({ ...prev, role: 'staff' }))
                    SetCurrState('Login')
                  }}
                  className='group w-full rounded-2xl border border-orange-200 bg-linear-to-r from-amber-50 to-white px-5 py-4 text-left transition hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-[0_12px_26px_rgba(234,88,12,0.14)]'
                >
                  <span className='block text-xl font-bold text-orange-700'>Login as Staff</span>
                </button>
              </div>
            ) : (
              <>
                <div className='mt-8 flex flex-col gap-4'>
                  {currState === 'Login' ? null : (
                    <input
                      name='name'
                      onChange={onChangeHandler}
                      value={data.name}
                      type='text'
                      placeholder='Enter your name'
                      required
                      className='w-full rounded-xl border border-zinc-300 bg-white/90 px-5 py-3 text-base text-zinc-800 shadow-[0_6px_16px_rgba(0,0,0,0.04)] outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200'
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
                      className='w-full rounded-xl border border-zinc-300 bg-white/90 px-5 py-3 text-base text-zinc-800 shadow-[0_6px_16px_rgba(0,0,0,0.04)] outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200'
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
                        className='w-full rounded-xl border border-zinc-300 bg-white/90 px-5 py-3 text-base text-zinc-800 shadow-[0_6px_16px_rgba(0,0,0,0.04)] outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200'
                      />
                      <input
                        name='username'
                        onChange={onChangeHandler}
                        value={data.username}
                        type='text'
                        placeholder='Choose a username'
                        required
                        className='w-full rounded-xl border border-zinc-300 bg-white/90 px-5 py-3 text-base text-zinc-800 shadow-[0_6px_16px_rgba(0,0,0,0.04)] outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200'
                      />
                    </>
                  )}
                  <input
                    name='password'
                    onChange={onChangeHandler}
                    value={data.password}
                    type='password'
                    placeholder='Enter your password'
                    required
                    className='w-full rounded-xl border border-zinc-300 bg-white/90 px-5 py-3 text-base text-zinc-800 shadow-[0_6px_16px_rgba(0,0,0,0.04)] outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200'
                  />
                </div>

                {currState === 'Sign Up' && (
                  <button
                    type='button'
                    onClick={() => {
                      setSignupType(null)
                      setData((prev) => ({ ...prev, role: 'customer' }))
                    }}
                    className='mt-3 text-sm font-medium text-orange-600 transition hover:text-orange-700'
                  >
                    Change account type
                  </button>
                )}
              </>
            )}

            {!showAccountChoice && (
              <button type='submit' className={`mt-6 w-full rounded-2xl px-4 py-3 text-xl font-extrabold tracking-tight text-white transition active:scale-[0.98] ${submitButtonClasses}`}>
                {currState === 'Sign Up' ? 'Create Account' : 'Continue'}
              </button>
            )}

            {!showAccountChoice && isCustomerLogin && (
              <>
                <div className='mt-4 flex items-center gap-3'>
                  <span className='h-px flex-1 bg-zinc-200'></span>
                  <span className='text-xs font-semibold uppercase tracking-wide text-zinc-400'>or</span>
                  <span className='h-px flex-1 bg-zinc-200'></span>
                </div>
                {hasGoogleClientId ? (
                  <div className='mt-3 flex justify-center rounded-2xl border border-zinc-300 bg-white px-3 py-2'>
                    <GoogleLogin
                      theme='outline'
                      shape='pill'
                      text='continue_with'
                      width='320'
                      onSuccess={onGoogleLoginSuccess}
                      onError={() => alert('Google sign-in was cancelled or failed.')}
                    />
                  </div>
                ) : (
                  <p className='mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-center text-xs font-medium text-amber-700'>
                    Google login is not configured. Add VITE_GOOGLE_CLIENT_ID in frontend .env.
                  </p>
                )}
              </>
            )}

            {!showAccountChoice && (
              <div className='mt-4 flex items-start gap-2 rounded-xl bg-zinc-50/80 p-3'>
                <input type='checkbox' required className='mt-1 h-4 w-4 accent-orange-500'/>
                <p className='text-sm leading-5 text-zinc-500'>By continuing, I agree to the terms of use & privacy policy.</p>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}

export default LoginPopup