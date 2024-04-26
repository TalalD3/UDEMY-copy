import React from 'react';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import './allcourses.css'
import Item from '../item/Item';

function Couraselcourses({ courses }) {
  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 5
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1
    }
  };
 
  const CustomRightArrow = ({ onClick }) => {
    return <button onClick={onClick} className="custom-arrow right-arrow">{'>'}</button>;
  };

  

  return (
    <Carousel responsive={responsive} customRightArrow={<CustomRightArrow />}   itemClass="course-card-wrapper">
      {courses.map(course => (
        <div key={course._id}>   
        <Item course={course}/>
        </div>
      ))}
    </Carousel>
  );
}

export default Couraselcourses;
