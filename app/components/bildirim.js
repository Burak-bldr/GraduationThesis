


import { useState, useEffect } from "react";
import { ref, onChildAdded, onChildChanged, remove, update, push, get } from "firebase/database";
import { database } from "../FirebasePage/firebase";
import { useAuth } from "../hookum/useauth";
import "./bildirim.css";
import { IoNotificationsOutline } from "react-icons/io5";


const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [userResponses, setUserResponses] = useState([]); 
    const [isOpen, setIsOpen] = useState(false);
    const currentUser = useAuth();

    useEffect(() => {
        if (!currentUser) return;

        const reservationRef = ref(database, "reservations");
        onChildAdded(reservationRef, (snapshot) => {
            const newReservation = snapshot.val();
            if (newReservation.ownerEmail === currentUser.email) {
                setNotifications((prev) => [...prev, { id: snapshot.key, ...newReservation }]);
            }
            if (newReservation.requestedBy === currentUser.email) {
                setUserResponses((prev) => [...prev, { id: snapshot.key, ...newReservation }]);
            }
        });
        onChildChanged(reservationRef, (snapshot) => {
            const updatedReservation = snapshot.val();
            if (updatedReservation.ownerEmail === currentUser.email) {
                setNotifications((prev) =>
                    prev.map((notif) =>
                        notif.id === snapshot.key ? { ...notif, status: updatedReservation.status } : notif
                    )
                );
            }
            if (updatedReservation.requestedBy === currentUser.email) {
                setUserResponses((prev) =>
                    prev.map((notif) =>
                        notif.id === snapshot.key ? { ...notif, status: updatedReservation.status } : notif
                    )
                );
            }
        });
    }, [currentUser]);

    
    const fetchStationLocation = async (stationId, callback) => {
        const stationRef = ref(database, `stations/${stationId}`);
        try {
            const snapshot = await get(stationRef);
            if (snapshot.exists()) {
                const stationData = snapshot.val();
                callback(stationData.latitude, stationData.longitude);
            } else { console.error("İstasyon konumu bulunamadı.");
            }
        } catch (error) {console.error("İstasyon konumu alınamadı:", error);
        }
    };
     const startNavigation = (stationId) => {
        if (!stationId) {console.error("İstasyon ID bulunamadı.");
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userLat = position.coords.latitude;
                const userLng = position.coords.longitude;
                fetchStationLocation(stationId, (latitude, longitude) => {
                    if (latitude && longitude) {
                        const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${latitude},${longitude}`;
                        window.open(googleMapsUrl, "_blank");
                    }
                });
            },
            (error) => console.error("Konum alınamadı:", error)
        );
    };

    
    const handleResponse = (id, status, requestedByEmail) => {
        const reservationRef = ref(database, `reservations/${id}`);
        const safeEmail = requestedByEmail.replace(/\./g, "_");

        update(reservationRef, { status })
            .then(() => {
                const userNotificationRef = ref(database, `notifications/${safeEmail}`);

                push(userNotificationRef, {
                    message: `Rezervasyonunuz ${status === "accepted" ? "kabul edildi" : "reddedildi"}.`,
                    timestamp: Date.now(),
                });
            })
            .catch((error) => console.error("Rezervasyon güncellenemedi:", error));
    };

    
    const handleCancelReservation = (id) => {
        const reservationRef = ref(database, `reservations/${id}`);

        update(reservationRef, { status: "cancelled" })
            .then(() => {
                setUserResponses((prev) =>
                    prev.map((notif) =>
                        notif.id === id ? { ...notif, status: "cancelled" } : notif
                    )
                );
            })
            .catch((error) => console.error("Rezervasyon iptal edilemedi:", error));
    };

  
    const handleDeleteNotification = (id) => {
        const reservationRef = ref(database, `reservations/${id}`);

        remove(reservationRef)
            .then(() => {
                setNotifications((prev) => prev.filter((notif) => notif.id !== id));
                setUserResponses((prev) => prev.filter((notif) => notif.id !== id));
            })
            .catch((error) => console.error("Bildirim silinemedi:", error));
    };

    const unreadCount = notifications.length + userResponses.length;



return (
    <div className="notifications-container">
        <div className="notification-icon" onClick={() => setIsOpen(!isOpen)}>
            <IoNotificationsOutline fontSize={"25px"} />
            {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
        </div>

        {isOpen && (
            <div className="notifications">
                <h3 style={{ fontSize: "12px" }}>Bildirimler</h3>

               
                {notifications.length > 0 && (
                    <>
                        <h4>📩 Gelen Rezervasyon Talepleri</h4>
                        {notifications.map((notif) => (
                            <div key={notif.id} className="notification">
                                <p>
                                    {notif.requestedBy} kullanıcısı {notif.date} tarihi , {notif.time} saati için rezervasyon talebinde bulundu.
                                </p>
                                {notif.status === "pending" ? (
                                    <>
                                        <button className="accept-btn" onClick={() => handleResponse(notif.id, "accepted", notif.requestedBy)}>
                                            Onayla
                                        </button>
                                        <button className="reject-btn" onClick={() => handleResponse(notif.id, "rejected", notif.requestedBy)}>
                                            Reddet
                                        </button>
                                    </>
                                ) : notif.status === "accepted" ? (
                                    <>
                                        <p style={{ color: "green", fontWeight: "bold" }}>Rezervasyonu Onayladınız ✅</p>
                                        <button className="cancel-btn" onClick={() => handleCancelReservation(notif.id)}>
                                            Rezervasyonu İptal Et
                                        </button>
                                    </>
                                ) : notif.status === "cancelled" ? (
                                    <p style={{ color: "red", fontWeight: "bold" }}>Rezervasyon İptal Edildi ❌</p>
                                ) : null}
                                <button className="delete-btn" onClick={() => handleDeleteNotification(notif.id)}>Sil</button>
                            </div>
                        ))}
                    </>
                )}

                
                {userResponses.length > 0 && (
                    <>
                        <h4>📌 Yaptığınız Rezervasyonlar</h4>
                        {userResponses.map((notif) => (
                            <div key={notif.id} className="notification">
                                <p>
                                    {notif.date} tarihi, {notif.time} saati için  yaptığınız rezervasyon: 
                                    <strong>
                                        {notif.status === "accepted"
                                            ? "Onaylandı ✅"
                                            : notif.status === "rejected"
                                            ? "Reddedildi ❌"
                                            : notif.status === "cancelled"
                                            ? "İptal Edildi ❌"
                                            : "Bekliyor ⏳"}
                                    </strong>
                                </p>
                                {notif.status === "accepted" && (
                                    <>
                                        <button style={{width:"210px",border:"1px solid white"}} className="start-btn" onClick={() => startNavigation(notif.stationId)}>
                                            Yolculuğa Başla 🚗
                                        </button>
                                        <button className="cancel-btn" onClick={() => handleCancelReservation(notif.id)}>
                                            Rezervasyonu İptal Et
                                        </button>
                                    </>
                                )}
                                <button className="delete-btn" onClick={() => handleDeleteNotification(notif.id)}>Sil</button>
                            </div>
                        ))}
                    </>
                )}
            </div>
        )}
    </div>
);}


export default Notifications;




