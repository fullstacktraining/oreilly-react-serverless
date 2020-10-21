import React, { useState } from 'react';

export default function Unsplash() {
  const [searchTerm, setTermValue] = useState('');
  async function searchImage() {
    const response = await fetch(
      `https://epd6cjwmbk.execute-api.us-east-1.amazonaws.com/dev/image?term=${searchTerm}`
    );
    const data = await response.json();
    console.log(data);
  }
  return (
    <>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setTermValue(e.target.value)}
      />
      <button onClick={searchImage}>Search Image</button>
    </>
  );
}
