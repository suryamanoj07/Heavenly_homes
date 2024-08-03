import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import OAuth from '../components/OAuth'

const SignUp = ({setToken}) => {
  const navigate = useNavigate()
  const [formData,setFormData]=useState({})
  const [error,setError]=useState(null)
  const [loading,setLoading]=useState(false)

  const handleChange=(e)=>{
    setFormData(p=>({...p,[e.target.id]:e.target.value}))
  }
  const handleSubmit=async(e)=>{
    e.preventDefault()
    setLoading(true)
    const resp = await axios.post("http://localhost:3000/api/auth/signup",formData)
    if(!resp.data.success){
      setError(resp.data.message)
      setLoading(false)
      return;
    }
    setLoading(false)
    setError(false)
    navigate("/sign-in")
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <input type="text" placeholder='username' className='border p-3 rounded-lg' id="username" onChange={handleChange}/>
        <input type="email" placeholder='email' className='border p-3 rounded-lg' id="email"onChange={handleChange}/>
        <input type="password" placeholder='password' className='border p-3 rounded-lg' id="password"onChange={handleChange}/>
        <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>{loading?"Loading...":"Sign up"}</button>
        <OAuth setToken={setToken} />
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Have an account?</p><Link to="/sign-in"><span className='text-blue-700'>Sign in</span></Link>
      </div>
      {error && <p className='text-red-500 mt-5'>{error}</p> }
    </div>
  )
}

export default SignUp