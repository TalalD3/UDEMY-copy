import React, { useEffect, useState } from 'react'
import "./display.css"
import cross_icon from "../../assets/icons/cross_icon.png"

const DisplayFiles = () => {

  const [allCourses, setAllCourses] = useState([]);
  const fetchInfo = async () => {
    await fetch('http://localhost:5000/allcourses', {
      method: 'GET'
    })
      .then(res => res.json())
      .then(data => { setAllCourses(data) })

  }
  useEffect(() => {
    fetchInfo();
  }, [])

  const removeCourse= async(id)=>{
    await fetch('http://localhost:5000/removecourse',{
      method:'POST',
      headers:{
        Accept:'application/json',
        'Content-Type':'application/json'
      },
      body:JSON.stringify({id:id})
    })
    await fetchInfo();
  }


  return (
    <div className='listProduct'>
      <h1>All Courses List</h1>
      <div className="listproduct-format-main">
        <p>Courses</p>
        <p>Title</p>
        <p>price</p>
        <p>Category</p>
        <p>Remove</p>
      </div>
      <div className="listproduct-allCourses">
        <hr />
        {allCourses.map((course, index) => (
          <>
            <div key={index} className="listproduct-format-main listproduct-format">
              <img src={course.image} className='listproduct-product-image' alt="" />
              <p>{course.title}</p>
              <p>${course.price}</p>
              <p>{course.category}</p>
              <img onClick={()=>removeCourse(course.id)} src={cross_icon} className='listproduct-remove-icon' alt="" />
            </div>
            <hr />
          </>
        ))}
      </div>
    </div>
  )
}

export default DisplayFiles