import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Image } from 'cloudinary-react';
import './assets/main.css';

function App() {
  const [data, setData] = useState({ results: [] });
  useEffect(() => {
    const fetchData = async () => {
      const result = await axios(
        'https://oreilly-serverless.vercel.app/api/photos'
      );
      setData(result.data);
    };
    fetchData();
  }, []);
  return (
    <div className="mx-auto p-8">
      <div className="flex flex-row flex-wrap -mx-2">
        {data.results.map((result, i) => (
          <div
            className="xl:w-1/3 lg:w-1/3 md:w-1/2 sm:w-1/2 xs:w-full sm:w-full w-full mb-4 sm:mb-0 px-2"
            key={i}
          >
            <Image
              className="object-contain shadow-xl border-solid border-1 border-gray-100 rounded p-3"
              cloudName="tamas-demo"
              publicId={result.public_id}
              secure="true"
              fetchFormat="auto"
              quality="auto"
              height="400"
              width="400"
              dpr="auto"
              crop="fill_pad"
              gravity="auto"
              background="auto"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
