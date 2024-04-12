import React from 'react'
import star from "../../assets/icons/star.svg"
import "./review.css"


function Review(props) {
  return (
    <div className='review-container'>
    <div className="Profile">
        <img src={props.img}/>
        <h3>{props.name}</h3>
    </div>
    
    <div className="comment">
         <p>{props.comment}</p>
    </div>
    
    <div className='stars'>
    <img src={star}/><img src={star}/><img src={star}/><img src={star}/><img src={star}/>
    </div>
    
    </div>
  )
}

export default Review