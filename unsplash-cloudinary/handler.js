'use strict';

function _getImage(term) {
  const url = `https://api.unsplash.com/photos/random?query=${term}&client_id=${process.env.UNSPLASH_API_KEY}`;
  return new Promise((resolve, reject) => {
    const https = require('https');
    const request = https.get(url, (response) => {
      if (response.statusCode < 200 || response.statusCode > 299) {
        reject(
          new Error('Failed to load page, status code: ' + response.statusCode)
        );
      }
      const body = [];
      response.on('data', (chunk) => body.push(chunk));
      response.on('end', () => resolve(body.join('')));
    });
    request.on('error', (err) => reject(err));
  });
}

module.exports.image = async (event) => {
  const cloudinary = require('cloudinary').v2;
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  if (event.queryStringParameters && event.queryStringParameters.term) {
    try {
      const term = event.queryStringParameters.term;
      const response = await _getImage(term);
      const data = JSON.parse(response);
      const uploadResult = await cloudinary.uploader.upload(data.urls.full);
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({
          message: `Access image at ${uploadResult.secure_url}`,
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
  }
};
