import { getDatabase, ref, set,get } from "firebase/database";


//! deneme
const database = getDatabase();
 const saveStationData = async (stationId, stationData) => {
  try {
      
      const stationRef = ref(database, `stations/${stationId}`);

      const stationWithUser = {
          ...stationData,
         
      };

      await set(stationRef, stationWithUser);
      console.log("✅ Şarj istasyonu başarıyla kaydedildi:", stationWithUser);
  } catch (error) {
      console.error("❌ Şarj istasyonu kaydında hata:", error);
  }
};







const getStationData = async (stationId) => {
    try {
        console.log("🔍 Firebase'den veri alınıyor, Station ID:", stationId);
        
        if (!stationId) {
            console.error("⛔ Hata: stationId eksik veya geçersiz!");
            return null;
        }

        const database = getDatabase();
        const stationRef = ref(database, `stations/${stationId}`);
        const snapshot = await get(stationRef);

        if (snapshot.exists()) {
            console.log("✅ Firebase'den gelen veri:", snapshot.val());
            return snapshot.val();
        } else {
            console.warn("⚠️ Firebase'de bu istasyon için veri bulunamadı.");
            return null;
        }
    } catch (error) {
        console.error("❌ Firebase verisi alınırken hata oluştu:", error);
        return null;
    }
};


export { getStationData,saveStationData };

