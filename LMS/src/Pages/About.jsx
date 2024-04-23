import React from 'react'
import './css/about.css'
import Foot from '../component/footer/Foot'
import man from '../assets/images/man-with-laptop.png'
import book from '../assets/icons/bibliotheque.png'
import prof from '../assets/icons/prof.png'
import student from '../assets/icons/ecole.png'
import phone from '../assets/icons/phone.png'
import mail from '../assets/icons/mail.png'


function About() {
  return (
    <div>
    <div className='big-contain'>
     
    <div className='container-about'>
    <div className='aboutus'>
    <div className='student'>
    <div className='wise'>
    <h3>About Us</h3>
    <p>Welcome to our e-learning platform! Here, we offer a wide range of courses designed to enhance your skills and knowledge in various fields. Whether you're looking to further your career, explore new interests, or simply expand your horizons, our platform provides you with the tools and resources you need to succeed.</p>
    <p>With expert instructors, interactive lessons, and flexible learning options, we strive to make education accessible to everyone, anytime, anywhere. Join our community of lifelong learners and embark on a journey of discovery and growth.</p>
    </div>
    <img src={man}/>
    </div>


    <div className='about-text'>
    <div className='contact'><h3>Contact Us</h3>
    
    <div className='phone-c'>
        <img src={phone}/>
        <p>054900000</p>
    </div>

    <div className='email-c'>
        <img src={mail}/>
        <p>talalmoh@gmail.com</p>
    </div>

    </div>

    <div className='owner'><div><h3>Admins</h3></div>
    <div  className='admin'>
    <p>Mohamed Abdesslam</p>
    </div>
    <div className='admin'>
    <p>Talal Douibi</p>
    </div>
    </div>

    </div>
    </div>
    <div className='stats'>
      <div className='counter'><div className='avatar'><img src={student} /><h2>Total Students</h2></div><p>1000</p></div>
      <div className='counter'><div className='avatar'><img src={prof} /><h2>Total Teachers</h2></div><p>1000</p></div>
      <div className='counter'><div className='avatar'><img src={book} /><h2>Total Courses</h2></div><p>1000</p></div>
    </div>   

        
    </div>
    
    
    </div>
    <Foot />
    </div>
  )
}

export default About