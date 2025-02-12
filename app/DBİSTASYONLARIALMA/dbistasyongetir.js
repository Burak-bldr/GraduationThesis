import { getDatabase, ref, get } from "firebase/database";

export const fetchLocationsFromRealtimeDB = async () => {
  const db = getDatabase(); 
  const locationsRef = ref(db, "stations"); 
  const snapshot = await get(locationsRef);

  if (snapshot.exists()) {
    const data = snapshot.val(); 
    
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
