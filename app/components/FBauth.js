"use client"
import React, { useState } from 'react'
import { FcGoogle } from "react-icons/fc";
import "./fbauth.css"
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword,  updateProfile } from "firebase/auth";
import { toast } from 'react-toastify';
import { auth } from '../FirebasePage/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const provider = new GoogleAuthProvider()
function FBauth() {
     const [mail, setEmail] = useState("")
    const [password, setpassword] = useState(" ")
    const [uname, setname] = useState("")
    const [ulname, setlname] = useState("")
    const router = useRouter()

    let Googlelogin = async () => {
         try {

            let promisecevap = await signInWithPopup(auth, provider)
            const credential = GoogleAuthProvider.credentialFromResult(promisecevap)

            let token = credential.accessToken

            const kullanıcı = promisecevap.user
            setTimeout(() =>

                router.push("/Map")
                , 1000)
        }
        catch (error) {
            toast.error(error.message)
        }
}





    
    const register = async () => {

        auth  
        try {
            const response = await createUserWithEmailAndPassword(auth, mail, password, uname, ulname) 
                setTimeout(() =>

                router.push("/Map")
                , 1000)
            const user = response.user 

            if (user) {  
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


    const login = async () => { auth
        try {
            const response = await signInWithEmailAndPassword(auth, mail, password)
            const user = response.user
            if (user) {
                toast.success("Logged in succesfully")
                setTimeout(() =>
                    router.push("/Map")
                    , 1000)
                setEmail(" ")
                setpassword(" ")
                setlname("")
                setname("")
            }

        } catch (error) {
            toast.error(" Login error : " + error.message)

        }
    }








    return (
        <div className='tümdiv'>

            <div>
                <input value={mail} onChange={(e) => setEmail(e.target.value)} type='email' placeholder='E- mail' />
                <input onChange={(e) => setpassword(e.target.value)} type='password' placeholder='password' />
                <p style={{ margin: "10px", fontFamily: "fantasy", marginTop: "25px", marginLeft: "25px" }}> If you have account no need to fill name and surname</p>
                <input value={uname} onChange={(e) => setname(e.target.value)} type='text' placeholder='name' />
                <input value={ulname} onChange={(e) => setlname(e.target.value)} type='text' placeholder='surname' />
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
