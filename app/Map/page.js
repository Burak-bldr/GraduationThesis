

"use client"
import React, { useState, useEffect } from 'react'
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api'
import ClipLoader from "react-spinners/ClipLoader";
import { useAuth } from "../hookum/useauth"
import { getStationData } from "../FBİstasyonkayıt/fireBase"; 
import Randevu from "../components/randevu"
import { fetchLocationsFromRealtimeDB } from "../DBİSTASYONLARIALMA/dbistasyongetir";
import Istasyonekle from "../components/istasyonekleme"
import StationDetails from "../components/istasyononay";

const containerStyle = {
  width: '100%',
  height: '90VH',
}

const center = {
  lat: -3.745,
  lng: -38.523,
}



function page() {
const [showReservationModal, setShowReservationModal] = useState(false);
const [userStations, Setuserstation] = useState([])
const [chargingStations, setChargingStations] = useState([]);

let currentUser = useAuth();

const mapoptions = { mapID: process.env.NEXT_PUBLIC_GOOGLE_MAPS_ID }

const { isLoaded } = useJsApiLoader({
  id: process.env.NEXT_PUBLIC_GOOGLE_MAPS_ID,
  googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
})

 const handleUserStationClick = (station) => {
    const { latitude, longitude } = station;
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${latitude},${longitude}&travelmode=driving`;


    window.open(googleMapsUrl, "_blank");
  };




  const [selectedStation, setSelectedStation] = useState(null);
  useEffect(() => {
    if (!selectedStation || !selectedStation.usersUsing) return;

    const interval = setInterval(() => {
      const now = new Date();

      selectedStation.usersUsing.forEach((user) => {
        if (new Date(user.usageEnd) <= now) {

          setAcInUse((prev) => Math.max(prev - 1, 0));
        }
      });
    }, 60000);

    return () => clearInterval(interval);
  }, [selectedStation]);






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
            console.log('Geolocation error:', error.message);

          }
        );
      } else {
        console.error('Geolocation not supported by this browser.');
      }
    };

    getUserLocation();
  }, []);








  useEffect(() => {
    const fetchChargingStations = async () => {
      const lat = userLocation.lat;
      const lng = userLocation.lng;
      const radius = 50000;
      const type = 'electric_vehicle_charging_station';
      const apikey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
try {
        const response = await fetch(`http://localhost:5000/api/nearby-charging-stations?lat=${lat}&lng=${lng}&radius=${radius}&type=${type}&apiKey=${apikey}`);
        const data = await response.json();


        if (data.results) {
          const stations = data.results.map((station) => ({
            key: station.place_id,
            location: {
              lat: station.geometry.location.lat,
              lng: station.geometry.location.lng,
            },
          }));
          
          setChargingStations(stations);
        }
      } catch (error) {
        console.error('Error fetching charging stations:', error);
      }
    };

    fetchChargingStations();
  }, [userLocation]);









  useEffect(() => {
    const getStations = async () => {
      try {
        const stations = await fetchLocationsFromRealtimeDB();
        Setuserstation(stations);
        console.log("Firebase Stations:", stations);
      } catch (error) {
        console.error("Error fetching stations:", error);
      }
    };

    getStations();
  }, []);




  const handleMarkerClick = (station) => {
    const { lat, lng } = station.location;
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${lat},${lng}&travelmode=driving`;

    window.open(googleMapsUrl, "_blank");
  };




  const handleRightClick = async (station) => {
    const stationId = station.id || station.key;

    if (!stationId) {
      console.error(" Hata: Sağ tıklanan istasyonun 'id' veya 'key' bilgisi yok!", station);
      return;
    }

    try {
      console.log(" Sağ tıklanan istasyon. ID/Key:", stationId);
      const stationData = await getStationData(stationId);

      if (stationData) {
        console.log(" Firebase'den çekilen istasyon verisi:", stationData);
      } else {
        console.warn(" Firebase'de istasyon verisi bulunamadı.");
      }


      if (!stationData?.addedBy) {
        console.log(" API'den gelen istasyon, StationDetails açılacak...");
        setShowReservationModal(false);
        setSelectedStation({ ...station, ...stationData });
        return;
      }


      console.log(" Kullanıcı istasyonu, Randevu açılıyor...");
      setSelectedStation({ ...station, ...stationData });
      setShowReservationModal(true);

    } catch (error) {
      console.error(" Firebase verisi alınırken hata oluştu:", error);
    }
  };




  useEffect(() => {
    console.log(" showReservationModal değişti:", showReservationModal);
  }, [showReservationModal]);




  useEffect(() => {
    const disableContextMenu = (event) => event.preventDefault();
    window.addEventListener("contextmenu", disableContextMenu);

    return () => {
      window.removeEventListener("contextmenu", disableContextMenu);
    };
  }, []);



  useEffect(() => {
    console.log(" showReservationModal değişti:", showReservationModal);
  }, [showReservationModal]);






  return isLoaded ? (
    <GoogleMap
      options={mapoptions}
      mapContainerStyle={containerStyle}
      center={userLocation}
      zoom={10}
      onRightClick={(event) => {
        console.log("Haritada sağ tıklama:", event.latLng.toJSON());
      }}
    >




      {userLocation.lat && userLocation.lng && (
        <Marker position={userLocation} title='You are here' />
      )}



  {chargingStations.map((station) => (
        <Marker
          key={station.key}
          position={station.location}
          title={station.name}
          onClick={() => handleMarkerClick(station)}
          onRightClick={() => {
            console.log(" API İstasyonuna Sağ Tıklandı:", station);
            handleRightClick(station);
          }}
          icon={{
            url: station === selectedStation ?
              "http://maps.google.com/mapfiles/ms/icons/green-dot.png" :
              "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
          }}
        />
      ))}
      {userStations.map((station) => (
        <Marker
          key={station.id}
          position={{
            lat: Number(station.latitude),
            lng: Number(station.longitude)
          }}
          title={`şarj tipi: ${station.type || "Bilinmiyor"}, istasyon Adı: ${station.name || "Kullanıcı istasyonu"},Randevu almak için giriş yapın yada kayıt olun`}

          onClick={() => handleUserStationClick(station)}
          onRightClick={() => {
            console.log(" Kullanıcı istasyonuna sağ tıklandı:", station);
            handleRightClick(station);
          }}
          icon={{
            url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
          }}
        />
      ))}
      {showReservationModal && selectedStation && selectedStation.addedBy && (
        <Randevu
          station={selectedStation}
          onClose={() => {
            console.log(" Randevu penceresi kapatıldı, selectedStation sıfırlandı.");
            setShowReservationModal(false);
            setSelectedStation(null);
          }}
        />
      )}


      {!showReservationModal && selectedStation && !selectedStation.addedBy && (
        <StationDetails
          station={selectedStation}
          onClose={() => {
            console.log(" StationDetails kapatıldı");
            setSelectedStation(null);
          }}
        />
      )}
      {currentUser ? (<div style={{ position: "absolute", top: "10px", left: "1000px" }} >

        <Istasyonekle konum={userLocation} />


      </div>) : (<h1> İstasyon eklemek için kayıt olmanız yada giriş yapmanız gerekmektedir</h1>)}
 </GoogleMap>


  ) : (
    <div className='loading'>    <ClipLoader
      color="gray"
      size={150}
      aria-label="Loading Spinner"
      data-testid="loader"
    /></div>

  )
}
export default page
