import react,{ useEffect, useState } from 'react'
import { BrowserRouter,Route,Routes } from 'react-router-dom'
import Home from './pages/Home'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import About from './pages/About'
import Profile from './pages/Profile'
import Header from './components/Header'
import PrivateRoute from './components/PrivateRoute'
import CreateListing from './pages/CreateListing'
import UpdateListing from './pages/UpdateListing'
import Listing from './pages/Listing'
import Search from './pages/Search'

function App() {
  const [token,setToken]=useState("");
  useEffect(()=>{
    if(localStorage.getItem("access_token")){
      setToken(localStorage.getItem("access_token"))
    }
  },[token])

  return (
    <BrowserRouter>
      <Header/>
      <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/sign-in" element={<SignIn setToken={setToken}/>} />
      <Route path="/sign-up" element={<SignUp setToken={setToken}/>} />
      <Route path="/about" element={<About/>} />
      <Route path="/search" element={<Search/>} />
      <Route element={<PrivateRoute />}>
          <Route path='/profile' element={<Profile />} />
          <Route path='/create-listing' element={<CreateListing />} />
          <Route path='/update-listing/:listingId' element={<UpdateListing />} />
      </Route>
      <Route path='/listing/:listingId' element={<Listing />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
