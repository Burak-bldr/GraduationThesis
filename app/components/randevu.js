



import { useState } from "react";

import { saveReservationRequest } from "../FirebasePage/Reservation";  

import { useAuth } from "../hookum/useauth"; 
import "./randevu.css"

function ReservationModal  ({ station, onClose }) {
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");

    const currentUser = useAuth(); 
   
    const handleReservation = async () => {
        if (!date || !time) {
            alert("Lütfen tarih ve saat seçin!");
            return;
        }
       const stationId = station?.id || station?.key;
        
        if (!stationId) {
            console.error(" Hata: stationId eksik veya geçersiz!", station);
            window.alert(" Hata: İstasyon kimliği bulunamadı!");
            return;
        }
        if (!currentUser || !currentUser.email) {
            console.error("Hata: Kullanıcı bilgisi eksik!");
            window.alert("Hata: Giriş yapmadan rezervasyon yapamazsınız!");
            return;
        }
    
        try {
            console.log("Rezervasyon gönderiliyor, stationId:", stationId);
            console.log("İstasyon Sahibi (ownerEmail):", station.addedBy);
            console.log("Rezervasyon Yapan (requestedBy):", currentUser.email);
    
            
            const reservationData = {
                stationId: stationId,  
                date,
                time,
                requestedBy: currentUser.email, 
                ownerEmail: station.addedBy, 
                status: "pending",
            };
    
            await saveReservationRequest(reservationData);
            alert(" Rezervasyon talebiniz iletildi!");
            onClose();
        } catch (error) {
            console.error(" Rezervasyon sırasında hata oluştu:", error);
            alert(" Rezervasyon başarısız oldu!");
        }
    };
    if (!currentUser) return null;



return (
    <div className="reservation-modal">
      <h2 className="reservation-title">{station.name} Rezervasyon</h2>
  
      <div className="reservation-inputs">
        <label>Tarih:</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
  
        <label>Saat:</label>
        <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
      </div>
  
      <div className="reservation-buttons">
        <button className="reservation-submit" onClick={handleReservation}>Rezervasyon Gönder</button>
        <button className="reservation-cancel" onClick={onClose}>İptal</button>
      </div>
    </div>
  );}
  

export default ReservationModal;

