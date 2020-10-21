import React, { useState } from 'react';
import { Image, Transformation } from 'cloudinary-react';

export default function NumberPlate() {
  const [showData, setShowData] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [data, setData] = useState({});

  const onChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const submit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('image', selectedFile);
    try {
      const response = await fetch(
        'https://7kd083mwg6.execute-api.us-east-1.amazonaws.com/dev/upload',
        {
          method: 'POST',
          body: formData,
        }
      );
      const serverlessFunctionData = await response.json();
      setData(serverlessFunctionData);
      setShowData(true);
    } catch (error) {
      console.log('Error', error);
    }
  };
  return (
    <>
      <form onSubmit={submit}>
        <input type="file" onChange={(e) => onChange(e)} />
        <button type="submit">Magic!</button>
      </form>
      {showData ? (
        <>
          {console.log(data.publicId)}
          <Image
            cloudName="tamas-demo"
            publicId={data.publicId}
            width="600"
            dpr="auto"
            fetchFormat="auto"
            quality="auto"
          >
            <Transformation
              overlay={{
                fontFamily: 'Arial',
                fontSize: 120,
                fontWeight: 'bold',
                text: `This is a ${data.colour} ${data.make} ${data.model}.`,
              }}
              gravity="south"
              y="60"
            />
            <Transformation
              overlay={{
                fontFamily: 'Arial',
                fontSize: 120,
                fontWeight: 'bold',
                text: `It has a ${data.transmission} transmission and a max speed of ${data.performance.speed} mph.`,
              }}
              gravity="south"
              y="-100"
            ></Transformation>
          </Image>
        </>
      ) : (
        <></>
      )}
    </>
  );
}
