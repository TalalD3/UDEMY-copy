import React from 'react'
import aboutimg from "../../assets/images/about.png"
import "./about.css"
function About() {
  return (
    <div className='about'>

    <div className='question' >
     <h1 >Why <span> learn </span>  with our courses?</h1>
     <p>Unlock your potential with our transformative courses...</p> 
     <img className='aboutimg' src={aboutimg} />
     
    
    </div>



    </div>
  )
}

export default About