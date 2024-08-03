import React from 'react'
import {GoogleAuthProvider, getAuth, signInWithPopup} from 'firebase/auth'
import { app } from '../firebase.js'
import { useDispatch } from 'react-redux'
import { signInSuccess } from '../redux/user/userSlice.js'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'


const OAuth = ({setToken}) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const handleGoogleClick = async()=>{
        try{
            const provider = new GoogleAuthProvider()
            const auth = getAuth(app)

            const result = await signInWithPopup(auth,provider)
            // console.log(result);
            const res = await axios.post("http://localhost:3000/api/auth/google",{name:result.user.displayName,email:result.user.email,photo:result.user.photoURL})

            if(res.data.success){
                setToken(res.data.message)
                localStorage.setItem("access_token",res.data.message)
                dispatch(signInSuccess(res.data))
                navigate("/")
                return
            }    
            else{
                console.log(res.data.message);
            }

        }catch(e){
            console.log(e.message);
        }
    }
  return (
    <button onClick={handleGoogleClick} type='button' className='bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>Continue with google</button>
  )
}

export default OAuth