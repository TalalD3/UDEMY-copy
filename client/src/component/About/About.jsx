import React from 'react'
import learn from "../../assets/images/learn.png"
import grad from "../../assets/images/grad.png"
import work from "../../assets/images/work.png"

import "./about.css"
function About() {
  return (
    <div className='about'>

    <div className='question' >
     <h1 >Why &nbsp;<span>learn</span>&nbsp; with our courses?</h1>
     <p>Unlock your potential with our transformative courses...</p> 
     <div className='aboutimg'>
     <img  src={learn} />
     <img  src={grad} />
     <img  src={work} />
     </div>
     
     
    
    </div>



    </div>
  )
}

export default About