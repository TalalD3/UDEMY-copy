import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Coursecard from './Coursecarde'; 
import './courseslide.css';
import itemImg1 from '../../assets/images/itemImg1.png';
import asian from '../../assets/images/asian.png';
import african from '../../assets/images/african.png'

const CustomPrevArrow = (props) => {
    const { onClick } = props;
    return (
        <div className="custom-arrow custom-prev-arrow" onClick={onClick}>
            {/* You can use an SVG or an icon library like Font Awesome for the arrow */}
            <i className="fas fa-chevron-left"></i>
        </div>
    );
};

// Custom next arrow component
const CustomNextArrow = (props) => {
    const { onClick } = props;
    return (
        <div className="custom-arrow custom-next-arrow" onClick={onClick}>
            {/* You can use an SVG or an icon library like Font Awesome for the arrow */}
            <i className="fas fa-chevron-right"></i>
        </div>
    );
};

function CourseCarousel({courses}) {
    

    const settings = {
      dots: true,
      infinite : true,
      speed:500,
      slidesToShow: 3,
      slidesToScroll:1,
      arrows: true,
      className: 'custom-slider',
      prevArrow: <CustomPrevArrow />,
      nextArrow: <CustomNextArrow />,
      itemClass:"course-card-wrapper",
      
    };

    return (
       
            <Slider {...settings} >
                {courses.map(course => (
                    
                        <Coursecard
                            title={course.title}
                            littleDescription={course.littleDescription}
                            creator={course.creator}
                            new_props={course.new_props}
                            old_props={course.old_props}
                            image={course.image}
                            rating={course.rating}
                        />
                    
                ))}
            </Slider>
      
    );
}

export default CourseCarousel;
