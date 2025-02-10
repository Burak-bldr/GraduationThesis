


import { getDatabase, ref, push, set } from "firebase/database";
import { database } from "../FirebasePage/firebase"; // Firebase bağlantısı

export const saveReservationRequest = async (reservationData) => {
    try {
        const reservationRef = push(ref(database, "reservations")); 

        await set(reservationRef, reservationData);

        console.log("✅ Rezervasyon başarıyla kaydedildi:", reservationData);
    } catch (error) {
        console.error("❌ Rezervasyon kaydedilirken hata oluştu:", error);
    }
};
