import React from 'react'
import star from "../../assets/icons/star.svg"
import "./reviewcourse.css"


function Reviewcourse(props) {
  return (
    <div className='commentaire'>
    <div className='commentator' >
    <div className='hisname'><img src={props.img}/>
        <h3>{props.name}</h3> </div>
        
        <div className='hisrating'><img src={star}/><h4>{props.rate}</h4></div>
    </div>
    
    <div className='hiscomment' >
         <p>{props.comment}</p>
    </div>
    
    </div>
  )
}

export default Reviewcourse