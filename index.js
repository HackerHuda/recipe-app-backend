import cloudinary from 'cloudinary';
import app from "./app.js";
import connectionToDB from "./Connect/db.js";
const PORT = process.env.PORT || 7001;

import {config} from 'dotenv';
config();

cloudinary.v2.config({
    cloud_name: process.env.Cloud_Name, 
    api_key: process.env.Cloud_Key, 
    api_secret:process.env.Cloud_Secret 
  });
app.listen(PORT, async () => {
  
    try {
      await connectionToDB();
      console.log(`App is running at http://localhost:${PORT}`);
    } catch (error) {
      console.error('Error connecting to the database:', error);
    }
  });
  