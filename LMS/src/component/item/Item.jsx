import React, { useContext, useState } from 'react'
import './item.css'

import star from './../../assets/icons/star.svg'
import halfstar from './../../assets/icons/halfStar.svg'
import blankstar from './../../assets/icons/blankStar.svg'
import { Link } from 'react-router-dom'
import { ShopContext } from '../../Context/ShopContext'

const Item = (props) => {
    // console.log(props.course);

    const { getCreator } = useContext(ShopContext);
    const [username, setUsername] = useState('')


    const fetchUserData = async () => {
        const user = await getCreator(props.course.creator);
        setUsername(user.username);
    };

    fetchUserData();

    return (
        <Link to={'/course/' + props.course._id}>
            <div className='course' onClick={() => window.scrollTo(0, 0)}>
                <div className="top">
                    <img className='course-image' src={props.course.image} />
                </div>
                <div className="down">
                    <h3 className='course-title'>{props.course.title}</h3>
                    <h4 className='course-description'>{props.course.small_description}</h4>
                    <h5 className='course-creator'>Dr. {username}</h5>
                    <div className="line" />
                    <div className="info">
                        <div className="price">
                            <p className="new-price">{props.course.price} Da</p>
                            {props.course.old_price &&
                                <p className="old-price">{props.course.old_price} Da</p>
                            }
                        </div>
                        <div className="rating">
                            <div className="stars">
                                {
                                    props.course.rating === 1 ? <><img src={star} /> <img src={blankstar} /> <img src={blankstar} /> <img src={blankstar} /> <img src={blankstar} /></> :
                                        props.course.rating === 1.5 ? <><img src={star} /> <img src={halfstar} /> <img src={blankstar} /> <img src={blankstar} /> <img src={blankstar} /></> :
                                            props.course.rating === 2 ? <><img src={star} /> <img src={star} /> <img src={blankstar} /> <img src={blankstar} /> <img src={blankstar} /></> :
                                                props.course.rating === 2.5 ? <><img src={star} /> <img src={star} /> <img src={halfstar} /> <img src={blankstar} /> <img src={blankstar} /></> :
                                                    props.course.rating === 3 ? <><img src={star} /> <img src={star} /> <img src={star} /> <img src={blankstar} /> <img src={blankstar} /></> :
                                                        props.course.rating === 3.5 ? <><img src={star} /> <img src={star} /> <img src={star} /> <img src={halfstar} /> <img src={blankstar} /></> :
                                                            props.course.rating === 4 ? <><img src={star} /> <img src={star} /> <img src={star} /> <img src={star} /> <img src={blankstar} /></> :
                                                                props.course.rating === 4.5 ? <><img src={star} /> <img src={star} /> <img src={star} /> <img src={star} /> <img src={halfstar} /></> :
                                                                    <><img src={star} /> <img src={star} /> <img src={star} /> <img src={star} /> <img src={star} /></>

                                }
                            </div>
                            <p>{props.course.rating}</p>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default Item