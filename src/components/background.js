import React from 'react'
import '../Background.css'

function BackgroundC() {
  return (
    <div className="background-container">
      <img
      style={{ 
          width: '100%', 
          height:"730px",
          objectFit: 'cover' 
        }} 
        src="bg.jpg"
        alt="Background Image"
        className="background-image"
      />
      <div className="text-overlay">
       
<h1 style={{fontWeight:"bold",fontSize:"50px",background:"radial-gradient(black, transparent)",color:"white"}}>Mask R-CNN (Region-based Convolutional Neural Network) is a powerful deep learning model commonly used for object detection and instance segmentation tasks.</h1>
      </div>
    </div>
  )
}

export default BackgroundC