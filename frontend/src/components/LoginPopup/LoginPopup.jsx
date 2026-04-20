import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'
import { GoogleLogin, googleLogout } from '@react-oauth/google'

const LoginPopup = ({ setShowLogin, isOpen, onClose }) => {
  const navigate = useNavigate()
  const { url, setToken, setUser } = useContext(StoreContext)
  const hasGoogleClientId = Boolean((import.meta.env.VITE_GOOGLE_CLIENT_ID || '').trim())
  const [currState, SetCurrState] = useState('Sign Up')
   const [signupType, setSignupType] = useState(null)
  const [googleError, setGoogleError] = useState('')
  const [data, setData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
  })

    const closePopup = () => {
      if (typeof onClose === 'function') {
        onClose();
      } else if (typeof setShowLogin === 'function') {
        setShowLogin(false);
      }
    };

      useEffect(() => {
        if (!isOpen) {
          return
        }

        // Clear cached Google session so user can pick the correct account.
        googleLogout()

        SetCurrState('Login')
        setGoogleError('')

        const previousBodyOverflow = document.body.style.overflow
        const previousHtmlOverflow = document.documentElement.style.overflow

        document.body.style.overflow = 'hidden'
        document.documentElement.style.overflow = 'hidden'

        return () => {
          document.body.style.overflow = previousBodyOverflow
          document.documentElement.style.overflow = previousHtmlOverflow
        }
      }, [isOpen])

    if (isOpen === false) {
      return null;
    }

      const onChangeHandler = (event) =>{
        const name = event.target.name
        const value = event.target.value
        setData(data=>({...data,[name]:value}))
      }

      const isCustomerFlow = true
      const submitButtonClasses = 'bg-linear-to-r from-orange-500 via-orange-500 to-amber-500 hover:from-orange-600 hover:via-orange-500 hover:to-amber-600 hover:shadow-[0_14px_28px_rgba(234,88,12,0.38)]'
      const fieldInputClasses = 'w-full rounded-2xl border border-zinc-200 bg-white px-5 py-3.5 text-base text-zinc-800 shadow-[0_8px_24px_rgba(0,0,0,0.04)] outline-none transition placeholder:text-zinc-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-100'

      const applyAuthSuccess = async (responseUser, token) => {
        const fallbackUser = {
          ...responseUser,
          role: responseUser.role || 'customer',
        }

        setToken(token)
        localStorage.setItem('token', token)

        let finalUser = fallbackUser

        try {
          const profileResponse = await axios.get(`${url}/api/user/profile`, {
            headers: { token },
          })

          if (profileResponse.data?.success && profileResponse.data?.user) {
            finalUser = {
              ...profileResponse.data.user,
              role: profileResponse.data.user.role || 'customer',
              avatar: responseUser.avatar || profileResponse.data.user.avatar,
            }
          }
        } catch (error) {
          console.error('Profile sync after login failed:', error)
        }

        setUser(finalUser)
        localStorage.setItem('user', JSON.stringify(finalUser))

        if (finalUser.role === 'admin') {
          navigate('/admin')
        } else if (finalUser.role === 'staff') {
          navigate('/staff')
        } else {
          navigate('/')
        }

        closePopup()
      }

      const onGoogleLoginSuccess = async (credentialResponse) => {
        try {
          setGoogleError('')
          if (!credentialResponse?.credential) {
            setGoogleError('Google sign-in did not return a credential. Please try again.')
            return
          }

          const response = await axios.post(`${url}/api/user/google-login`, {
            credential: credentialResponse.credential,
          })

          if (!response.data.success) {
            const serverMessage = response.data.message || 'Google login failed.'
            if (serverMessage === 'Google login failed') {
              setGoogleError('Google login failed. Restart backend server to load latest Google error handling, then retry. If it still fails, check OAuth client and origin settings in Google Cloud Console.')
            } else {
              setGoogleError(serverMessage)
            }
            return
          }

          if (!response.data.user || !response.data.token) {
            setGoogleError('Invalid response from server.')
            return
          }

          await applyAuthSuccess(response.data.user, response.data.token)
        } catch (error) {
          console.error('Google login error:', error)
          setGoogleError('Google login failed. If Google shows "Error 401: deleted_client", replace VITE_GOOGLE_CLIENT_ID with a valid Google Web Client ID and restart the frontend.')
        }
      }

      const onGoogleLoginError = () => {
        setGoogleError('Google sign-in failed. If you see "Error 401: deleted_client", your OAuth client was deleted. Create a new Google Web Client ID, update VITE_GOOGLE_CLIENT_ID, and restart frontend.')
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
            if (!response.data.user) {
              alert("User data missing in response.");
              return;
            }

            const normalizedUser = {
              ...response.data.user,
              role: response.data.user.role || 'customer',
            };

            await applyAuthSuccess(normalizedUser, response.data.token)
          } else {
            alert(response.data.message);
          }
        } catch (error) {
          console.error("Login/Register error:", error);
          alert("An error occurred. Please try again.");
        }
      }
     

  return (
    <div className='fixed inset-x-0 bottom-0 top-16 z-50 grid place-items-start overflow-hidden bg-linear-to-b from-black/75 via-black/60 to-black/70 p-3 backdrop-blur-md sm:top-20 sm:p-4 md:place-items-center'>
      <form onSubmit={onLogin} className='relative my-auto w-full max-w-5xl overflow-hidden rounded-[34px] border border-white/45 bg-orange/95 shadow-[0_34px_100px_rgba(0,0,0,0.5)] ring-1 ring-black/5'>
        <div className='pointer-events-none absolute -left-12 -top-16 h-48 w-48 rounded-full bg-orange-200/40 blur-3xl' />
        <div className='pointer-events-none absolute -bottom-16 -right-14 h-56 w-56 rounded-full bg-amber-300/25 blur-3xl' />

        <img onClick={closePopup} src={assets.cross_icon} alt='Close popup' className='absolute right-5 top-5 z-20 h-5 w-5 cursor-pointer opacity-60 transition hover:rotate-90 hover:opacity-100'/>

        <div className='grid min-h-0 grid-cols-1 md:min-h-136 md:grid-cols-[1fr_1.05fr]'>
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

          <div className='relative flex flex-col justify-center border-l border-orange-100/70 bg-linear-to-b from-[#fff8f1] via-[#fffaf6] to-white p-7 text-zinc-600 sm:p-12'>
            <div className='pointer-events-none absolute -right-10 -top-8 h-36 w-36 rounded-full bg-orange-200/35 blur-3xl' />
            <div className='pointer-events-none absolute -left-8 bottom-6 h-28 w-28 rounded-full bg-amber-200/25 blur-2xl' />
            <div className='mb-4 inline-flex w-fit items-center rounded-full border border-orange-200 bg-orange-100 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-orange-700'>
              Customer Access
            </div>
            <h3 className='text-[2.25rem] font-black leading-[1.08] tracking-tight text-[#111827] sm:text-[2.45rem]'>
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

            <p className='mt-2 text-base text-[#845638] sm:text-lg'>
              {currState === 'Login' ? (
                <>
                  New customer?{' '}
                  <span
                    onClick={() => {
                      SetCurrState('Sign Up')
                    }}
                    className='cursor-pointer font-medium text-orange-500 hover:text-orange-600'
                  >
                    Create account
                  </span>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <span
                    onClick={() => {
                      SetCurrState('Login')
                    }}
                    className='cursor-pointer font-medium text-orange-500 hover:text-orange-600'
                  >
                    Sign in
                  </span>
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
                  className={fieldInputClasses}
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
                  className={fieldInputClasses}
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
                    className={fieldInputClasses}
                  />
                  <input
                    name='username'
                    onChange={onChangeHandler}
                    value={data.username}
                    type='text'
                    placeholder='Choose a username'
                    required
                    className={fieldInputClasses}
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
                className={fieldInputClasses}
              />
            </div>

            <div className='mt-4 flex items-start gap-2 rounded-2xl border border-zinc-200/80 bg-zinc-50/90 p-3.5'>
              <input type='checkbox' required className='mt-1 h-4 w-4 accent-orange-500'/>
              <p className='text-sm leading-5 text-zinc-500'>By continuing, I agree to the terms of use & privacy policy.</p>
            </div>

            <button type='submit' className={`mt-6 w-full rounded-2xl px-4 py-3.5 text-xl font-extrabold tracking-tight text-white transition active:scale-[0.98] ${submitButtonClasses}`}>
              {currState === 'Sign Up' ? 'Create Account' : 'Continue'}
            </button>

            {isCustomerFlow && (
              <>
                <div className='mt-4 flex items-center gap-3'>
                  <span className='h-px flex-1 bg-zinc-200'></span>
                  <span className='text-xs font-semibold uppercase tracking-wide text-zinc-400'>or</span>
                  <span className='h-px flex-1 bg-zinc-200'></span>
                </div>
                {hasGoogleClientId ? (
                  <div className='mt-3 flex justify-center'>
                    <GoogleLogin
                      theme='outline'
                      shape='pill'
                      text='continue_with'
                      width='320'
                      useOneTap={false}
                      auto_select={false}
                      onSuccess={onGoogleLoginSuccess}
                      onError={onGoogleLoginError}
                    />
                  </div>
                ) : (
                  <div className='mx-auto mt-3 w-full max-w-90 space-y-2'>
                    <button
                      type='button'
                      disabled
                      className='w-full rounded-full border border-zinc-300 bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-500 cursor-not-allowed'
                    >
                      Continue with Google
                    </button>
                    <p className='rounded-xl border bg-center border-amber-200 bg-amber-50 px-3 py-2 text-center text-xs font-medium text-amber-700'>
                      Google login is not configured. Add VITE_GOOGLE_CLIENT_ID in frontend .env.
                    </p>
                  </div>
                )}
                {hasGoogleClientId && googleError && (
                  <p className='mx-auto mt-2 w-full max-w-90 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-center text-xs font-medium text-red-700'>
                    {googleError}
                  </p>
                )}
              </>
            )}

          
          </div>
        </div>
      </form>
    </div>
  )
}

export default LoginPopup