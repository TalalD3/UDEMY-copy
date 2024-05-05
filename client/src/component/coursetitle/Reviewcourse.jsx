import React from 'react'
import star from "../../assets/icons/star.svg"
import "./reviewcourse.css"
import Stars from '../item/Stars'


function Reviewcourse(props) {
  return (
    <div className='commentaire'>
      <div className='commentator' >
        <div className='hisname'><img src={props.img} />
          <h3>{props.name}</h3> </div>

        <div className='hisrating'>
          <Stars rating={props.rate} />
          <h4>{props.rate}</h4>
          <img className='one' src={star} />
        </div>
      </div>

      <div className='hiscomment' >
        <p>{props.comment}</p>
      </div>

    </div>
  )
}

export default Reviewcourse