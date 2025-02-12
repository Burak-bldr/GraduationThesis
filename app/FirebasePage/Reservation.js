


import {  ref, push, set } from "firebase/database";
import { database } from "../FirebasePage/firebase"; 

export const saveReservationRequest = async (reservationData) => {
    try {
        const reservationRef = push(ref(database, "reservations")); 

        await set(reservationRef, reservationData);

      
    } catch (error) {
        
    }
};
