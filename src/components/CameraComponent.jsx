import React, { useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';

const CameraComponent = () => {
  const [image, setImage] = useState(null);
  const [response, setResponse] = useState(null);

  const webcamRef = React.useRef(null);

  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
  }, [webcamRef, setImage]);

  const postData = async () => {
    try {
      const formData = new FormData();
      formData.append('file', dataURItoBlob(image));
      const response = await axios.post(`https://${import.meta.env.VITE_IP_ADDRESS}:8000/img_object_detection_to_recipe`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setResponse(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const dataURItoBlob = (dataURI) => {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: mimeString });
    return blob;
  };

  return (
    <div>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={{ facingMode: 'environment' }}
      />
      <button onClick={capture}>Capture Image</button>
      {image && (
        <>
          <img src={image} alt="Captured" />
          <button onClick={postData}>Send Image</button>
        </>
      )}
      {response && (
        <div>
          <p>Response from API:</p>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default CameraComponent;
