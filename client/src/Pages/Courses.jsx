import React, { useContext } from 'react'
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Courasel_courses from '../component/all courses/Couraselcourses';
import Foot from '../component/footer/Foot.jsx';
import banner from "../assets/images/Fullbanner.png";
import './css/courses.css';
import { ShopContext } from '../Context/ShopContext.jsx';


function Courses() {

  const {published_course} = useContext(ShopContext);
 
  const categories = [...new Set(published_course.map(course => course.category))];

  return (
    <div>
    <div className='container-c'>
    <div className='banner'>
      <img src={banner} />
    </div>

    <div className='courses-sec'>
      {categories.map(category => (
        <div key={category} className='category-slider'>
          <h2>{category} :</h2>
          <Courasel_courses courses={published_course.filter(course => course.category === category)} />
        </div>
      ))}
    </div>
    
    </div>
    <Foot />
    </div>
  );
}

export default Courses;
