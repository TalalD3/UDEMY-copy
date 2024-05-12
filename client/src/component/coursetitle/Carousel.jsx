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


function Carousel({ courseId }) {
  const { getComments } = useContext(ShopContext);
  const [comments, setComments] = useState([]);

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    arrows: false,
    responsive: [
      {
        breakpoint: 1244,
        settings: {
          slidesToShow: 1,
          arrows: false,
        },
      },
    ],// Display navigation arrows

  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const fetchingcomments = await getComments(courseId);
        // console.log(fetchingcomments.comments);
        if (fetchingcomments.success) {
          const goodComment = fetchingcomments.comments.filter(comment => comment.comment.length > 0);
          // setComments(goodComment);
          // console.log(fetchingcomments.comments);
          setComments(goodComment);
        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchComments();
  }, [courseId])

  return (
    <div className="carousel-container"> {/* Add a wrapper for the slider */}
      <Slider {...settings}>
        {comments.length &&  comments.map(review => (
          <div key={review._id} className="review-card">
            <Review img={review.user.picture} name={review.user.username} comment={review.comment} rate={review.rating} />
          </div>
        )) 
        }
      </Slider>
    </div>
  );
}

export default Carousel;
