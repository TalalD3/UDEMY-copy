import React from 'react'
import "./catg.css"
function Categories(props) {
  return (
<div className='category-item'>

      <img src={props.img} className='category-image' />
      <h3 className='cattitel'>{props.title}</h3>
      <h5 className='number'>{props.courses}</h5>
    
    
</div>
  )
}

export default Categories