import React from 'react'
import photo from "../../assets/images/AD.png"
import "./ad.css"

function Ad() {
  return (
    
     <div className='ad'>
     <div className='ad-container'>
        <img src={photo} />
        <div className='text_container'>
            <h2>Education Empowerment<br/><span>Unlock Your Potential</span></h2>
            <p>Step into a world of boundless opportunities with Education Empowerment, your catalyst for personal and professional growth. We believe in the power of education to transform lives and unlock untapped potential. Through innovative programs, personalized guidance, and a supportive community, we empower learners to discover their strengths, overcome challenges, and achieve their aspirations. Join us on a journey of self-discovery and empowerment, where every step forward brings you closer to realizing your dreams.</p>
            
        </div>
     </div>
     </div>
    
  )
}

export default Ad