
"use client";
import { useState, useEffect } from "react";
import { ref, set, push } from "firebase/database";
import { database } from "../FirebasePage/firebase";
import "./istasyonekleme.css";
import { useAuth } from "../hookum/useauth";

function IstasyonEkleme({ konum }) {
  const currentUser = useAuth();
  const [latitude, setLat] = useState(konum.lat || ""); 
  const [longitude, setLong] = useState(konum.lng || "");
  const [type, setType] = useState(""); 
  const [visible, setVisible] = useState(true);

  //! Konum prop'u güncellendiğinde state'i güncelle
  useEffect(() => {
    if (konum.lat !== null && konum.lng !== null) {
      setLat(konum.lat);
      setLong(konum.lng);
    }
  }, [konum]);

  const savetodb = async () => {
    if (!latitude || !longitude || !type) {
        alert("Lütfen tüm alanları doldurun!");
        return;
    }

    try {
        const newDocRef = push(ref(database, "stations")); //  Firebase'de otomatik key oluştur
        const newDocKey = newDocRef.key; // Firebase'in otomatik oluşturduğu key'i al

        await set(newDocRef, {
            id: newDocKey,  // Firebase'in oluşturduğu ID' iel istasyonumuz kaydoluyor  
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
            type: type,
            addedBy: currentUser.email
        });

        alert("İstasyon başarıyla kaydedildi!");
    } catch (error) {
        alert("Error: " + error.message);
    }
};

if (!visible) return null;
  return (
    <div id="istasyonekleme">
      
      <h3>Bulunduğunuz konumda size ait bir şarj istasyonu var mı?</h3>
      <input
        type="text"
        value={latitude}
        onChange={(e) => setLat(e.target.value)}
        placeholder="Latitude"
      />
      <br />
      <input
        style={{ marginTop: "5px" }}
        type="text"
        value={longitude}
        onChange={(e) => setLong(e.target.value)}
        placeholder="Longitude"
      />
      <br />
      <h4>Şarj İstasyonu Tipini Seçin:</h4>
      <button
        style={{
          marginRight: "10px",
          backgroundColor: type === "AC" ? "green" : "gray",
          color: "white",
        }}
        onClick={() => setType("AC")}
      >
        AC
      </button>
      <button
        style={{ marginTop:"5px",
          backgroundColor: type === "DC" ? "blue" : "gray",
          color: "white",
        }}
        onClick={() => setType("DC")}
      >
        DC
      </button>
      <br />

      <div style={{display:"flex", flexDirection:"row", justifyContent:"center" , marginTop:"-10px"}}> 
        <button
        style={{
          
          marginTop: "10px",
          backgroundColor: "gray",
          opacity: "0.9",
          alignContent: "center",
          alignItems: "center",
          width: "80px",
        }}
        onClick={savetodb}
      >
        
        <p style={{ marginLeft: "10px" }}>Kaydet</p>
        
      </button>



      <button
        style={{
          marginLeft: "30px",
          marginTop: "10px",
          backgroundColor: "gray",
          opacity: "0.9",
          alignContent: "center",
          alignItems: "center",
          width: "80px",
        }}
        onClick={()=>setVisible(false)}
      >
        
        <p style={{ marginLeft: "10px" }}>Kapat</p>
        
      </button></div>
     
    </div>
  );
}

export default IstasyonEkleme;
