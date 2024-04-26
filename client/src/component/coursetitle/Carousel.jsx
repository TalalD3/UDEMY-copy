import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Review from '../coursetitle/Reviewcourse.jsx';
import wade from '../../assets/images/wade.png';
import ronald from '../../assets/images/ronald.png';
import jacob from '../../assets/images/jacob.png';
import './Carousel.css'; // Import CSS file for styling

const rview = [
  {
    id: 1,
    img: wade,
    name: 'Wade Warren',
    comment:
    'Cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Reprehenderit in voluptate velit esse ',
     rate : 4,

  },
  {
    id: 2,
    img: ronald,
    name: 'Ronald Richards',
    comment:
      'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.  ',
      rate : 4,
    },
  {
    id: 3,
    img: jacob,
    name: 'Jacob Jones',
    comment:
      'Esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Duis aute irure dolor in reprehenderit in voluptate velit ',
      rate : 4,
    },
];

function Carousel() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll:1,
    arrows: true, // Display navigation arrows
    
  };

  return (
    <div className="carousel-container"> {/* Add a wrapper for the slider */}
      <Slider {...settings}>
        {rview.map(review => (
          <div key={review.id} className="review-card">
            <Review img={review.img} name={review.name} comment={review.comment} rate={review.rate} />
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default Carousel;
