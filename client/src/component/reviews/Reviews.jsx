import React, { useEffect, useState } from 'react'
import Review from './Review'
import wade from '../../assets/images/wade.png'
import ronald from '../../assets/images/ronald.png'
import jacob from '../../assets/images/jacob.png'
import "./review.css"
import { func } from 'prop-types'
import axios from 'axios'

const rview = [
  {
    id: 1,
    img: wade,
    name: 'Wade Warren',
    comment: 'Cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Reprehenderit in voluptate velit esse ',
  },
  {
    id: 2,
    img: ronald,
    name: 'Ronald Richards',
    comment: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.  ',
  },
  {
    id: 3,
    img: jacob,
    name: 'Jacob Jones',
    comment: 'Esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Duis aute irure dolor in reprehenderit in voluptate velit ',
  },
]



function Reviews() {
  const [allReviews, setReviews] = useState([]);

  useEffect(() => {

    const getReviews = async () => {
      try {
        const backendUrl = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL || '';
        const response = await axios.get(`${backendUrl}/api/getAllComments`);

        const sortedReviews = response.data.comments.sort((a, b) => b.rating - a.rating);
        const filteredReviews = sortedReviews.filter(review => review.comment.length > 15);
        // console.log(filteredReviews.splice(0,3));

        setReviews(filteredReviews.splice(0, 3));

      } catch (error) {
        console.log(error);
      }
    }

    getReviews();

  }, [allReviews.length])


  return (
    <div className='reviewsection'>
      <div className='text'>
        <h3 className='titre'>Reviews</h3>
        <p className='these'>What our student say about us</p>
      </div>
      <div className='container_reviews'>
        {allReviews.map(review => (
          <Review
            key={review._id}
            img={review.user.picture}
            name={review.user.username}
            comment={review.comment}
            rating={review.rating}
          />

        ))}
      </div>
    </div>
  )
}

export default Reviews