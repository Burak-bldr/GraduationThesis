"use client"
import React, { useState } from 'react'
import { FcGoogle } from "react-icons/fc";
import "./fbauth.css"


//! nexttte route işlemleri için userouter 

import { useRouter } from "next/navigation"; 

//! Email ve şifre ile kullanıcı oluşturmak kayıt olmak  için firebase auth servisten createUserWithEmailAndPassword import ediyoruz 
import {  createUserWithEmailAndPassword ,signInWithEmailAndPassword,onAuthStateChanged,updateProfile } from "firebase/auth";
import { toast } from 'react-toastify';
//! auth yani firebase authentication yani oturuö açma ve kimlik doğrulama yerini açtık 

import { auth } from '../FirebasePage/firebase';

//! google ile giriş 
import { GoogleAuthProvider , signInWithPopup } from 'firebase/auth';

const provider=new GoogleAuthProvider()
function FBauth() {

    //! return içerisinde email ve passwordu aldığımız değerleri statimize atıyoruz 

    const[mail, setEmail]=useState("")
    const[password, setpassword]=useState(" ")

    const[uname,setname]=useState("")
    const[ulname,setlname]=useState("")

    //? kullanıcı giriş yaptığında map sayfasına yönlendirmek için userRouter

    const router=useRouter()

let Googlelogin= async()=>{

try{

let promisecevap=await signInWithPopup(auth,provider)
const credential=GoogleAuthProvider.credentialFromResult(promisecevap)

let token= credential.accessToken

const kullanıcı=promisecevap.user
setTimeout(()=>
        
    router.push("/Map")
,1000 )  
}
catch(error){
toast.error(error.message)
}



}



 

//! kayıtol butonuna tıkladığımzıda  register fonkiyoun çalışacak ve bu fonksiyonla auth ile oturum açmaya çalışacağız bir Promise döndüğü için async 
    const register =async ()=>{

       auth  //! authentication servisini başlattık 
try {        
    const response= await  createUserWithEmailAndPassword(auth,mail,password,uname,ulname) //! createuserWithWEmailanpassword bizden auth , mail şifre isityor inputtan alıp sate atadıklarımızı veririz ve bize promise döner 

    setTimeout(()=>
        
        router.push("/Map")
   ,1000 )  
       

    const user=response.user //! promiste kayır edilen kullanıcı user ile kayıtedilir 

    if(user){  //! promisden bir user döndüyse toast ile başarılı 
        await updateProfile(user, {
            displayName: `${uname} ${ulname}`, 
        });
        
       toast.success("Account created welcome : " + user.displayName)
       setEmail(" ")
       setpassword("")
       setlname("")
       setname("")
 
    }
    
} catch (error) {
    toast.error(error.message)
    
}


    }


    const login =async ()=>{

        auth  
 try {        
     const response= await  signInWithEmailAndPassword(auth,mail,password) 
 
     const user=response.user 
 
     if(user){  
        toast.success("Logged in succesfully")

       
        //? başarılı birşekidle oturum açıldıysa mape yönlendirelim
          setTimeout(()=>
        
            router.push("/Map")
       ,1000 )  

           

        setEmail(" ")
        setpassword(" ")
        setlname("")
        setname("")
     }
     
 } catch (error) {
     toast.error(" Login error : " + error.message)
     
 } }




 
     


    return (
        <div className='tümdiv'>

            <div>
                <input value={mail}  onChange={(e)=>setEmail(e.target.value)}  type='email' placeholder='E- mail' />
                <input onChange={(e)=>setpassword(e.target.value)} type='password' placeholder='paswword' />
                <p style={{margin:"10px", fontFamily:"fantasy", marginTop:"25px"} }> If you have account no need to fill name and surname</p>
                <input value={uname}  onChange={(e)=>setname(e.target.value)}  type='text' placeholder='name' />
                <input value={ulname}  onChange={(e)=>setlname(e.target.value)}  type='text' placeholder='surname' />
            </div>

            <div className='fbauthbtn'>
                <button onClick={login}> Login </button>
                <button onClick={register}> Register </button>
                <button onClick={Googlelogin}><FcGoogle fontSize={26} />  Login with Google</button>

            </div>


        </div>
    )

}
export default FBauth;
