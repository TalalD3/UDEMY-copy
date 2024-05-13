import React from 'react'
import star from "../../assets/icons/star.svg"
import "./review.css"
import { Rating } from '@mui/material'
import Stars from '../item/Stars'


function Review(props) {

  return (
    <div className='review-container'>
      <div className="Profile">
        <img src={props.img} />
        <h3>{props.name}</h3>
      </div>

      <div className="comment">
        <p>{props.comment}</p>
      </div>

      <div className='home-reviews-stars'>
        <Stars rating={props.rating} /> {props.rating}
      </div>

    </div>
  )
}

export default Review