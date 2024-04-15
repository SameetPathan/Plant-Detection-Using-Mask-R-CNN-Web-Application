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
       
      </div>
    </div>
  )
}

export default BackgroundC