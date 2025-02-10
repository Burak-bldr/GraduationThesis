
import { useEffect, useState } from "react";

import "./istasyononay.css";
import {saveStationData} from "../FBİstasyonkayıt/fireBase";
import { useAuth } from "../hookum/useauth"

const StationDetails = ({ station, onClose}) => {

  console.log("StationDetails bileşenine gelen istasyon:", station);

  if (!station) {
    return <p>İstasyon bilgisi yükleniyor veya seçilmedi.</p>;
  }


  const [acStations, setAcStations] = useState(0);
  const [dcStations, setDcStations] = useState(0);
  const [acInUse, setAcInUse] = useState(0);
  const [dcInUse, setDcInUse] = useState(0);
  const [faultyAC, setFaultyAC] = useState(0);
  const [faultyDC, setFaultyDC] = useState(0);
  
  


  useEffect(() => {
    if (station) {
      setAcStations(station.acStations || 0);
      setDcStations(station.dcStations || 0);
      setAcInUse(station.inUseAC || 0);
      setDcInUse(station.inUseDC || 0);
      setFaultyAC(station.faultyAC || 0);
      setFaultyDC(station.faultyDC || 0);
      
    }
  }, [station]); 

  let currentUser = useAuth();

  const handleSave = () => {


    const updatedStation = {
      ...station,
      acStations,
      dcStations,
      inUseAC: acInUse,
      inUseDC: dcInUse,
      faultyAC: faultyAC,
      faultyDC: faultyDC,
     
    };

    console.log("Firebase'e kaydedilecek veri:", updatedStation);

    saveStationData(String(station.key), updatedStation)
      .then(() => console.log("Firebase'e başarıyla kaydedildi"))
      .catch((error) => console.error("Firebase kaydında hata:", error));

    onClose();
  };

  return (
    <div className="station-details-modal">
      <h2>{station.name}</h2>
      <p>Konum: {station.location.lat}, {station.location.lng}</p>

      <div className="inp">
        <label>Toplam AC İstasyon Sayısı: </label>
        <input
          type="number"
          value={acStations}
          onChange={(e) => setAcStations(Number(e.target.value))}
        />
      </div>
      <div className="inp">
        <label>Toplam DC İstasyon Sayısı: </label>
        <input
          type="number"
          value={dcStations}
          onChange={(e) => setDcStations(Number(e.target.value))}
        />
      </div>
      <div className="inp">
        <label>AC Kullanımda: </label>
        <input
          type="number"
          value={acInUse}
          onChange={(e) => setAcInUse(Number(e.target.value))}
          max={acStations}
        />
      </div>
      <div className="inp">
        <label>DC Kullanımda: </label>
        <input
          type="number"
          value={dcInUse}
          onChange={(e) => setDcInUse(Number(e.target.value))}
          max={dcStations}
        />
      </div>
      <div className="inp">
        <label>Bozuk AC İstasyon Sayısı: </label>
        <input
          type="number"
          value={faultyAC}
          onChange={(e) => setFaultyAC(Number(e.target.value))}
          max={acStations}
        />
      </div>
      <div className="inp">
        <label>Bozuk DC İstasyon Sayısı: </label>
        <input
          type="number"
          value={faultyDC}
          onChange={(e) => setFaultyDC(Number(e.target.value))}
          max={dcStations}
        />
      </div>
      



      {currentUser ? ( <div>   <button className="inb" onClick={handleSave}>Kaydet</button>
      <button className="inb" onClick={onClose}>Kapat</button></div>
   
    ) : (   <button className="inb" onClick={onClose}>Kapat</button>)}

     
   
    </div>
  );
};

export default StationDetails;




