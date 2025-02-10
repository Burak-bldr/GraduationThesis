
"use client"
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { auth } from "../FirebasePage/firebase";
import { signOut } from 'firebase/auth';
import { toast } from 'react-toastify';
import "./fbauth.css";
import { useAuth } from '../hookum/useauth';
import { ref, onChildAdded } from "firebase/database";
import { database } from "../FirebasePage/firebase";


import Notifications from './bildirim';


function Header() {
    const [notificationCount, setNotificationCount] = useState(0);
    const currentUser = useAuth();

 

    const [userLocation, setUserLocation] = useState({ lat: 0, lng: 0 });

    useEffect(() => {
        const getUserLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        setUserLocation({
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                        });
                    },
                    (error) => {
                        console.log("Geolocation error:", error.message);
                    }
                );
            } else {
                console.error("Geolocation not supported by this browser.");
            }
        };

        getUserLocation();
    }, []);


    const resetNotificationCount = () => {
        setNotificationCount(0);
    };
    useEffect(() => {
        if (!currentUser) return;

        const notificationsRef = ref(database, "notifications");

      
        onChildAdded(notificationsRef, (snapshot) => {
            const newNotification = snapshot.val();
            if (newNotification.recipientEmail === currentUser.email && !newNotification.seen) {
                setNotificationCount((prev) => prev + 1);
            }
        });

    }, [currentUser]);

    const logoutişlelim = async () => {
        try {
            await signOut(auth);
            setUser(null);
            toast.success("Logged out succesfully");
        } catch (error) {
            toast.error("Error while logging out: " + error.message);
        }
    };

    return (
        <nav className="flex justify-around items-center bg-black h-16 text-white">
            <h1 className='headerh1'>EV WAY</h1>

            <Link className='links' href={"/"}> Home </Link>
            <Link className='links' href={"/Map"}> Map </Link>
          
         



           {currentUser && (
    <div style={{ display: "flex", flexDirection: "row", position: "relative" }} className="notification-icon">
        
        <Notifications location = {userLocation} resetNotificationCount={resetNotificationCount} />
        {notificationCount > 0 && (
            <span 
                style={{
                    position: "absolute",
                    top: "-5px",
                    right: "-5px",
                    backgroundColor: "red",
                    color: "white",
                    borderRadius: "50%",
                    width: "20px",
                    height: "20px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "12px"
                }}
            >
                {notificationCount}
            </span>
        )}
    </div>
)}





            {currentUser ? (
                <div className='account' style={{ display: "flex", alignItems: "center" }}>
                    <span style={{ marginRight: "1rem" }}>{currentUser.displayName}</span>
                    <button  onClick={logoutişlelim}>Log out</button>
                </div>
            ) : (
                <Link href={"/Login"}>Log in / Register</Link>
            )}
        </nav>
    );
}

export default Header;

