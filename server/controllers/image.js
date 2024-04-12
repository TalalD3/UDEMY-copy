// import express from 'express';
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' }); // multer for handling file uploads

// const app = express();

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: 'YOUR_CLOUD_NAME',
  api_key: 'YOUR_API_KEY',
  api_secret: 'YOUR_API_SECRET'
});

// Route to handle file uploads
app.post('/upload.do', upload.single('file'), async (req, res) => {
  try {
    // Upload file to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);

    // Send Cloudinary response back to client
    res.json(result);
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    res.status(500).json({ error: 'Error uploading image to Cloudinary' });
  }
});

// Start the server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
