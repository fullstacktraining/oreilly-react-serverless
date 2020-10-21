const serverless = require('serverless-http');
const express = require('express');
const app = express();
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();
const cloudinary = require('cloudinary').v2;
const fetch = require('node-fetch');
const cors = require('cors');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(cors());

app.post('/upload', multipartMiddleware, async (req, res) => {
  const result = await cloudinary.uploader.upload(req.files.image.path, {
    ocr: 'adv_ocr',
  });
  const transformedURL = cloudinary.url(result.public_id, {
    secure: true,
    fetch_format: 'auto',
    quality: 'auto',
    width: 600,
    dpr: 'auto',
  });
  console.log('result', JSON.stringify(result));
  const plate = result.info.ocr.adv_ocr.data[0].textAnnotations[0].description.split(
    '\n'
  )[2];
  console.log('plate', plate);
  try {
    const request = await fetch(
      `https://uk1.ukvehicledata.co.uk/api/datapackage/VehicleData?v=2&api_nullitems=1&auth_apikey=${process.env.VEHICLE_API_KEY}&key_VRM=${plate}`
    );
    const data = await request.json();
    const vehicle = {
      make: data.Response.DataItems.SmmtDetails.Marque,
      model: data.Response.DataItems.SmmtDetails.Range,
      fuel: data.Response.DataItems.SmmtDetails.FuelType,
      transmission: data.Response.DataItems.SmmtDetails.Transmission,
      colour: data.Response.DataItems.VehicleRegistration.Colour,
      performance: {
        speed:
          data.Response.DataItems.TechnicalDetails.Performance.MaxSpeed.Kph,
      },
      publicId: result.public_id,
      url: transformedURL,
    };
    console.log('vehicle', vehicle);
    return res.send(vehicle);
  } catch (error) {
    return res.send(error);
  }
});

module.exports.handler = serverless(app, {
  binary: ['image/jpeg'],
});
