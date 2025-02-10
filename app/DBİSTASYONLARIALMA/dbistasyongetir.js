import { getDatabase, ref, get } from "firebase/database";

export const fetchLocationsFromRealtimeDB = async () => {
  const db = getDatabase(); // Realtime Database referansı
  const locationsRef = ref(db, "stations"); // "locations" yolunu referans al
  const snapshot = await get(locationsRef);

  if (snapshot.exists()) {
    const data = snapshot.val(); // Tüm veriyi alır
    // Verileri bir diziye dönüştür
    return Object.keys(data).map((key) => ({
      id: key,
      ...data[key],
    })
  );
  } else {
    console.log("No data available");
    return [];
  }
};
