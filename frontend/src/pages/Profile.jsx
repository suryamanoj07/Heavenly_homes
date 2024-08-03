import React, { useState,useEffect} from 'react'
import {useSelector} from 'react-redux'
import { useRef } from 'react'
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import {app} from './../firebase.js'
import {Link} from 'react-router-dom'
import { updateUserFailure,updateUserSuccess,updateUserStart,deleteUserFailure,deleteUserStart,deleteUserSuccess,signOutUserFailure,signOutUserStart,signOutUserSuccess } from '../redux/user/userSlice.js'
import { useDispatch } from 'react-redux'
import axios from 'axios'

const Profile = () => {
  
  const dispatch = useDispatch()

  const {currentUser,loading,error}=useSelector((state)=>state.user)
  const [file,setFile]=useState(undefined)
  const [uploadError,setUploadError]=useState(false)
  const [listingError,setListingError] = useState(false);
  const [formData,setFormData]=useState({})
  const [listings,setListings]=useState([])
  const [percent,setPercent]=useState(0)
  const fileRef=useRef(null)
  const [update,setUpadte]=useState(false)

  useEffect(()=>{
    if(file){
      handleFileUpload()
    }
  },[file])

  const handleFileUpload=()=>{
    const storage = getStorage(app)
    const fileName = new Date().getTime() + file.name
    const storageRef = ref(storage,fileName)
    const uploadTask = uploadBytesResumable(storageRef,file)
    uploadTask.on('state_changed',
      (snapshot)=>{
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes)*100
        setPercent(Math.round(progress));
        // console.log((Math.round(progress)))
      },
      (error)=>{
        setUploadError(true)
      },
      ()=>{
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl)=>{setFormData({...formData,avatar:downloadUrl})})
      })
  }

  const handleChange=(e)=>{
    setFormData({...formData,[e.target.id]:e.target.value})
  }
  
  const handleSubmit=async(e)=>{
    e.preventDefault()
    const access_token=currentUser.message
    dispatch(updateUserStart())
    const resp = await axios.post(`http://localhost:3000/api/user/update/${currentUser.userInfo._id}`,formData,{headers:{access_token}})
    if(!resp.data.success){
      dispatch(updateUserFailure(resp.data.message))
      return;
    }
    dispatch(updateUserSuccess(resp.data)) 
    setUpadte("Updated successfully!")
  }

  const handleDeleteUser=async()=>{
    const access_token=currentUser.message
    dispatch(deleteUserStart())
    const resp = await axios.post(`http://localhost:3000/api/user/delete/${currentUser.userInfo._id}`,formData,{headers:{access_token}})

    if(!resp.data.success){
      dispatch(deleteUserFailure(resp.data.message))
    }
    localStorage.removeItem("access_token");
    dispatch(deleteUserSuccess())
  }
  const handleSignOut=()=>{
    try{
      dispatch(signOutUserStart())
      localStorage.removeItem("access_token")
      dispatch(deleteUserSuccess())
    }
    catch(err){
      dispatch(deleteUserFailure(err.message))
    }

  }
  
  const handleListings=async()=>{
    setFormData(false)
    const access_token = currentUser.message
    const resp = await axios.get(`http://localhost:3000/api/user/listings/${currentUser.userInfo._id}`,{headers:{access_token}})
    if(resp.data.success){
      setListings(resp.data.message)
      return
    }
  }

  const handleListingDelete= async(id)=>{
    const access_token = currentUser.message
    const resp = await axios.post(`http://localhost:3000/api/listing/delete/${id}`,{},{headers:{access_token}})
    if(resp.data.success){
      setListings((prev)=>prev.filter((listing)=>listing._id!==id))
      console.log(resp.data.message)
      return
    }
    console.log(resp.data.message);
  }
  

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-center text-3xl font-semibold my-7'>Profile</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <input onChange={(e)=>setFile(e.target.files[0])} type="file" ref={fileRef} hidden accept='image/*'/>
        <img onClick={()=> fileRef.current.click()}  src={formData.avatar ||currentUser.userInfo.avatar} alt="" className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2' />
        <p className='text-sm self-center'>{uploadError ? <span className='text-red-700'>Error image upload</span> : 
          percent >0 && percent <100 ? <span className='text-slate-700'>{`Uploading ${percent}%`}</span> :
          percent===100 ? <span className='text-green-700'>Successfully uploaded!</span>:""}</p>
        <input type="text" placeholder='username' className='border p-3 rounded-lg' id='username' defaultValue={currentUser.userInfo.username} onChange={handleChange}/>

        <input type="email" placeholder='email' className='border p-3 rounded-lg' id='email' defaultValue={currentUser.userInfo.email} onChange={handleChange}/>

        <input type="password" placeholder='password' className='border p-3 rounded-lg' id='password' onChange={handleChange}/>

        <button disabled={loading} className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>{loading?"loading..":"update"}</button>

        <Link  className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95' to="/create-listing">Create Listing
        </Link>
      </form>
      <div className='flex justify-between mt-5'>
      <span onClick={handleDeleteUser} className='text-red-700 cursor-pointer'>
          Delete account
        </span>
        <span onClick={handleSignOut} className='text-red-700 cursor-pointer'>
          Sign out
        </span>
      </div>
      <p className='text-green-700 mt-5'>{update}</p>

      <button onClick={handleListings} className='text-green-700 w-full'>Show Listings</button>

      <p className='text-red-700 mt-5'>{listingError?"Cannot show your listings":""}</p>
        
      {listings && listings.length > 0 && (
        <div className='flex flex-col gap-4'>
          <h1 className='text-center mt-7 text-2xl font-semibold'>
            Your Listings
          </h1>
          {listings.map((listing) => (
            <div
              key={listing._id}
              className='border border-black rounded-lg p-3 flex justify-between items-center gap-4'
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt='listing cover'
                  className='h-16 w-16 object-contain'
                />
              </Link>
              <Link
                className='text-slate-700 font-semibold  hover:underline truncate flex-1'
                to={`/listing/${listing._id}`}
              >
                <p>{listing.name}</p>
              </Link>

              <div className='flex flex-col item-center'>
                <button
                  onClick={() => handleListingDelete(listing._id)}
                  className='text-red-700 uppercase'
                >
                  Delete
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className='text-green-700 uppercase'>Edit</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Profile
