import React from 'react'

import star from './../../assets/icons/star.svg'
import halfstar from './../../assets/icons/halfStar.svg'
import blankstar from './../../assets/icons/blankStar.svg'

const Stars = ({rating}) => {
    return (
        <div className="stars">
            {
                rating === 1 ? <><img src={star} /> <img src={blankstar} /> <img src={blankstar} /> <img src={blankstar} /> <img src={blankstar} /></> :
                    rating === 1.5 ? <><img src={star} /> <img src={halfstar} /> <img src={blankstar} /> <img src={blankstar} /> <img src={blankstar} /></> :
                        rating === 2 ? <><img src={star} /> <img src={star} /> <img src={blankstar} /> <img src={blankstar} /> <img src={blankstar} /></> :
                            rating === 2.5 ? <><img src={star} /> <img src={star} /> <img src={halfstar} /> <img src={blankstar} /> <img src={blankstar} /></> :
                                rating === 3 ? <><img src={star} /> <img src={star} /> <img src={star} /> <img src={blankstar} /> <img src={blankstar} /></> :
                                    rating === 3.5 ? <><img src={star} /> <img src={star} /> <img src={star} /> <img src={halfstar} /> <img src={blankstar} /></> :
                                        rating === 4 ? <><img src={star} /> <img src={star} /> <img src={star} /> <img src={star} /> <img src={blankstar} /></> :
                                            rating === 4.5 ? <><img src={star} /> <img src={star} /> <img src={star} /> <img src={star} /> <img src={halfstar} /></> :
                                                <><img src={star} /> <img src={star} /> <img src={star} /> <img src={star} /> <img src={star} /></>

            }
        </div>
    )
}

export default Stars