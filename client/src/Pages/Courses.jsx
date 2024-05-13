import React, { useContext } from 'react'
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Courasel_courses from '../component/all courses/Couraselcourses';
import Foot from '../component/footer/Foot.jsx';
import guy from "../assets/images/guy.png";
import './css/courses.css';
import { ShopContext } from '../Context/ShopContext.jsx';


function Courses() {

  const { published_course } = useContext(ShopContext);

  const categories = [...new Set(published_course.map(course => course.category))];

  return (
    <div className='section1'>
      <div className='container'>
        <div className='banner'>
          <div className='together'>
            <div className='guy_img'><img src={guy} /> </div>
            <div className='courses_green' />
            <div className='purple' />
          </div>
          <div className='title2'>
            <h1>Explore Our All Courses Page</h1>
            <p>Where Learning Never Stops</p>
          </div>
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
    </div>
  );
}

export default Courses;