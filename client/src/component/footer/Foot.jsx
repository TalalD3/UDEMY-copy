import React from 'react'
import { Link } from 'react-router-dom'
import phone from '../../assets/icons/phone.png'
import mail from '../../assets/icons/mail.png'
import gps from '../../assets/icons/gps.png'
import logo from '../../assets/images/white logo.png'
import Fb from '../../assets/icons/fb.png'
import insta from '../../assets/icons/insta.png'
import x from '../../assets/icons/x.png'
import './footer.css'

function Foot() {
  return (
    <div className='foot '>
      <div className="container">
        <div className='footersection'>
          <div className='icon'>
            <img src={logo} />
            <p>Veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea <br />
              commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum <br />
              dolore eu fugiat nulla pariatur. </p>
          </div>

          <div className='links'>
            <h3>Quick links</h3>
            <div className='path'>
              <Link to='/about' ><p>About</p></Link>
              <Link to='/courses'><p>Course</p></Link>
              <Link><p>Contact</p></Link>
            </div>
          </div>


          <div className='contacts'>
            <h3>Contacts us</h3>
            <div className='phone'>
              <img src={phone} />
              <p>054900000</p>
            </div>

            <div className='email'>
              <img src={mail} />
              <p>talalmoh@gmail.com</p>
            </div>

            <div className='location'>
              <img src={gps} />
              <p>el eulma</p>
            </div>

          </div>

        </div>
        <div className='accounts'>

          <div className='hr'><hr></hr></div>

          <div className='copyright'>

            <p>Copyright 2024 | All Rights Reserved</p>

            <div className='social'>
              <Link><img src={Fb} /></Link>
              <Link><img src={insta} /></Link>
              <Link><img src={x} /></Link>
            </div>
          </div>


        </div>
      </div>
    </div>
  )
}

export default Foot