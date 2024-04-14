import React, { useState,useEffect } from 'react';
import { Container, Row, Col, Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL,listAll  } from 'firebase/storage';
import { app } from '../firebaseConfig';

function Home(props) {
  const [fileUrl, setFileUrl] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);
  const [apiResponse, setapiResponse] = useState(null);
  useEffect(() => {
    const fetchImageUrls = async () => {
      const storage = getStorage(app);
      const storageRefPath = 'PlantDetectionMRCNN/output';
      const imagesRef = storageRef(storage, storageRefPath);

      try {
        const result = await listAll(imagesRef);
        const urls = await Promise.all(result.items.map(async (itemRef) => {
          return await getDownloadURL(itemRef);
        }));
        setImageUrls(urls);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImageUrls();
  }, []);

  const handleFileUpload = async (file) => {
    const storage = getStorage(app);
    const storageRefPath = `PlantDetectionMRCNN/inputPlantImage`;
    const fileRef = storageRef(storage, storageRefPath);

    try {
      await uploadBytes(fileRef, file);
      const downloadUrl = await getDownloadURL(fileRef);
      setFileUrl(downloadUrl);
      setUploadedImage(URL.createObjectURL(file)); 
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.includes('image/jpeg')) {
      handleFileUpload(file);
    } else {
      alert('Please select a valid JPEG file.');
    }
  };

  const calldetectionAPI= async () => {
    try {
      const response = await fetch('http://localhost:5000/your-flask-endpoint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });
      const data = await response.json();
      console.log(data);
      setapiResponse(data);
    } catch (error) {
      console.error('Error calling Flask API:', error);
      setapiResponse(null);
    }
  };

  return (
    <div style={{marginTop:"20px",marginBottom:"88px"}}>
    <Container className="shadow p-3 border" >
      <Row>
        <Col xs="12" md="6">
          <div className="input-group mb-3">
            <div className="input-group-prepend"></div>
            <div className="custom-file">
              <input type="file" accept=".jpg, .jpeg" className="custom-file-input" onChange={handleFileChange} id="inputGroupFile01" aria-describedby="inputGroupFileAddon01" />
              <label className="custom-file-label" htmlFor="inputGroupFile01">Choose file</label>
            </div>
          </div>
        </Col>
        <Col xs="12" md="6">
          {fileUrl && (
            <Button color="primary" onClick={calldetectionAPI}>
              <FontAwesomeIcon icon={faUpload} className="mr-2" />
              Run Detection
            </Button>
          )}
        </Col>
      </Row>
      {uploadedImage && (
        <Row className="mt-3">
          <Col>
          <div className="alert alert-primary" role="alert">
              Image Uploaded Successfully
            </div>
            <img src={uploadedImage} alt="Uploaded" style={{ maxWidth: '45%', height: 'auto' }} />
          </Col>
        </Row>
      )}

      {apiResponse && (
      <Row className="mt-5">
      <Col>
      <div className="alert alert-primary" role="alert">
     Plant Disease Detection Output using MR-CNN Modal
    </div>
        <div>
          {imageUrls.map((url, index) => (
            <img key={index} src={url} alt={`Image ${index}`} style={{ maxWidth: '45%', height: 'auto' }} />
          ))}
        </div>
      </Col>
    </Row>
  )}
      
      
    </Container>
    </div>
  );
}

export default Home;
