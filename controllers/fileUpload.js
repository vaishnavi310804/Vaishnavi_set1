import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const cloudinaryFileUpload = async (file, folder) => {
  return await cloudinary.uploader.upload(file.tempFilePath, {
    folder: folder,
  });
};

const isFileType = (supportedType, fileType) => {
  return supportedType.includes(fileType);
};

const fileUpload = async (req, res) => {
  try {
    const { name, email } = req.body;
    const file = req.files.image;

    const supportedType = ['jpg', 'png'];
    const fileType = path.extname(file.name).slice(1);

    if (!isFileType(supportedType, fileType)) {
      return res.status(400).json({ message: 'file type not supported' });
    }

    const upload = await cloudinaryFileUpload(file, 'vaishnavi');
    console.log(upload);

    res.status(200).json({ message: 'file uploaded', url: upload.secure_url });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

export default fileUpload;