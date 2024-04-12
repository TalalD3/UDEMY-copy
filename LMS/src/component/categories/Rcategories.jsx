import React from 'react'
import Category from "./Categories"
// import cats from "./cats"
import "./catg.css"
import art from "../../assets/icons/art.png"
import design from "../../assets/icons/design.png"
import Web from "../../assets/icons/web.png"
import software from "../../assets/icons/sofware.png"
import person from "../../assets/icons/person.png"
import digital from "../../assets/icons/digitalm.svg"

const cats = [
{
    id : 1,
    img : digital ,
    title: 'MATH',
    courses: '95 course'
},
{
    
    id : 2,
    img : design ,
    title: 'Graphic Design',
    courses: '95 course'
},
{
    
    id : 3,
    img : Web ,
    title: 'Web Development',
    courses: '95 course'
},
{
    
    id : 4,
    img : software ,
    title: 'Digtal Marketing',
    courses: '95 course'
},
{
    
    id : 5,
    img : person ,
    title: 'History',
    courses: '95 course'
},
{
    
    id : 6,
    img : digital ,
    title: 'Science',
    courses: '95 course'
}
]

function Rcategories() {
  return (
    <div className='cats'>
    <div className='text'>
    <h3 className='top'>Top<span>Categories</span></h3>
    <h5>12,000+ unique online course list designs</h5>
    </div>
    <section>

    
    <div className='categories-container'>
    {cats.map(props => (
        
        <Category
          key={props.id}
          img={props.img}
          title={props.title}
          courses={props.courses}
        />

    ))}
     </div>

     </section>
     </div>
  )
}

export default Rcategories