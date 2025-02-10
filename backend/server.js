const express = require("express");
const axios = require("axios");
const app = express();
const cors = require("cors");


app.use(cors());
 const apiKey = 'AIzaSyCJgHH-Kj5xK54yygT6VFA32A5z_MHFDGk'
app.get("/api/nearby-charging-stations", async (req, res) => {
   
  const { lat, lng, radius, type, } = req.query;

  const googleApiUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${type}&key=${apiKey}`;
  try {
    const response = await axios.get(googleApiUrl);
    res.json(response.data); 
  } catch (error) {
    res.status(500).send("Error fetching data from Google Maps API");
  }
});


app.listen(5000, () => {
  console.log("Backend server is running on http://localhost:5000");
});
