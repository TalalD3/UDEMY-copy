import React from 'react'
import './title.css'
import graduate from '../../assets/images/graduate.png'
import user from '../../assets/icons/profile.png'
import star from '../../assets/icons/star.svg'
import Stars from '../item/Stars'



function Titre(props) {

  return (
    <div className='container-title'>
      <div className='shadow'>
<div className='section1'>
        <div className='container'>

          <div className='infos'>
            <div className='theme'>
              <h2>{props.title}</h2>
            </div>
            <div className='theme-description'>
              <p>{props.littleDescription}</p>
            </div>
            <div className='teach-rate'>
              <div className='tech-stud'><div className='teacher'><img src={user} /><h5>{props.creator}</h5></div>
                <div className='students'><img src={user} /><h5>{props.orederCourse}</h5></div></div>
              <div className='rate-stats'>
                <div className='rating'><h5>{props.rating}</h5><Stars rating={props.rating} /></div>
              </div>
            </div>
          </div>
        </div>
        </div>
        
        <div className='graduate'><img src={graduate} /></div>  

      </div>

    </div>
  )
}

export default Titre