import { Link } from 'react-router-dom'
import React from 'react'
import srchimg from "../../assets/icons/Buttonsrch.svg"
import "./texte.css"
function text() {
  return (
    <div className='text'>

      <p className='title'>Successful coaches are visionaries</p>
      <p className='coaching'>Good <span class='highlight'>coaching</span> is <br /> good teaching & <br /> nothing else.</p>

      <Link className='getcourse' to='/courses'><h2 className='ggg'>View courses</h2></Link>

      {/* <div className='SRC' >
        <input placeholder='Search for courses' />
        <img className='imgsrch' src={srchimg} />
      </div> */}


    </div>

  )
}

export default text