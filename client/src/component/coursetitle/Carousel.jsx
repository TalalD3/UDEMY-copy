import React, { useContext, useEffect, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Review from '../coursetitle/Reviewcourse.jsx';
import wade from '../../assets/images/wade.png';
import ronald from '../../assets/images/ronald.png';
import jacob from '../../assets/images/jacob.png';
import './Carousel.css'; // Import CSS file for styling
import { ShopContext } from '../../Context/ShopContext.jsx';

const rview = [
  {
    id: 1,
    img: wade,
    name: 'Wade Warren',
    comment:
      'Cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Reprehenderit in voluptate velit esse ',
    rate: 4,

  },
  {
    id: 2,
    img: ronald,
    name: 'Ronald Richards',
    comment:
      'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.  ',
    rate: 4,
  },
  {
    id: 3,
    img: jacob,
    name: 'Jacob Jones',
    comment:
      'Esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Duis aute irure dolor in reprehenderit in voluptate velit ',
    rate: 4,
  },
];


function Carousel({courseId}) {
  const {getComments} = useContext(ShopContext);
  const [comments,setComments] = useState([]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    arrows: true, // Display navigation arrows
  };

  useEffect(()=>{
    const fetchComments = async () =>{
      try {
        const fetchingcomments = await getComments(courseId);
        console.log(fetchingcomments.comments);
        if(fetchingcomments.success) {
          fetchingcomments.comments.map(comment => {
            if(comment.comment.length > 0 && comment.rating > 3){
              setComments(prevComments => ([
                ...prevComments,
                comment
              ]));
          }})
        }
      } catch (error) {
        console.log(error);
      }
    }
  
    fetchComments();
  },[courseId])

  
  return (
    <div className="carousel-container"> {/* Add a wrapper for the slider */}
      <Slider {...settings}>
        {comments.length && comments.map(review => (
          <div key={review._id} className="review-card">
            <Review img={review.img} name={review.user.username} comment={review.comment} rate={review.rating} />
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default Carousel;
