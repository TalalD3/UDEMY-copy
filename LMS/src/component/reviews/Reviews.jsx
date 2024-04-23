import React from 'react'
import Review from './Review'
import wade from '../../assets/images/wade.png'
import ronald from '../../assets/images/ronald.png'
import jacob from '../../assets/images/jacob.png'
import "./review.css"

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
  return (
    <div className='reviewsection'>
      <div>
        <h3 className='titre'>Reviews</h3>
        <p className='these'>What our student say about us</p>
      </div>
      <div className='container reviews'>
        {rview.map(props => (

          <Review
            key={props.id}
            img={props.img}
            name={props.name}
            comment={props.comment}
          />

        ))}
      </div>
    </div>
  )
}

export default Reviews