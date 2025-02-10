

import React from 'react'
import Fbauth from "../components/FBauth"

import { ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css" 
function page() {
  return (
    <div className='Loginpage'>
      <Fbauth/>
      <ToastContainer position='top-right' autoClose={3000}/>
    </div>
  )
}

export default page


