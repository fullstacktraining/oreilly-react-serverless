'use strict';
const cloudinary = require('cloudinary').v2;
const config = {
  cloud_name: '',
  api_key: '',
  api_secret: '',
};
module.exports.hello = async (event) => {
  try {
    cloudinary.config(config);
    const imageData = JSON.parse(event.body).data;
    const upload = await cloudinary.uploader.upload(imageData);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        upload,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        error,
      }),
    };
  }
};
