import React, { useState } from 'react';

export default function Upload() {
  const [image, setImage] = useState('');

  const onChange = async (event) => {
    const file = event.target.files[0];
    const readData = (file) => {
      return new Promise((resolve, reject) => {
        console.log('reading file in promise', file);
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
      });
    };
    const fileData = await readData(file);
    try {
      const response = await fetch(
        'https://kcdb0e277f.execute-api.us-east-1.amazonaws.com/dev/hello',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ data: fileData }),
        }
      );
      const data = await response.json();
      console.log(data.upload.secure_url);
      setImage(data.upload.secure_url);
    } catch (error) {
      console.log('Error', error);
    }
  };

  return (
    <>
      <input type="file" onChange={(e) => onChange(e)} />
      {image ? <>{image}</> : <>Upload a photo!</>}
    </>
  );
}
