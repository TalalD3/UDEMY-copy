import React, { useContext, useState } from 'react'
import './item.css'

import { ArrowRightOutlined } from '@ant-design/icons';


import { Link } from 'react-router-dom'
import { ShopContext } from '../../Context/ShopContext'
import Stars from './Stars'

const Item = (props) => {

    const { userEnrollCourse } = useContext(ShopContext);
    const [isUserEnroll, setIsUserEnroll] = useState({});


    // console.log(props.course);

    // const { getCreator } = useContext(ShopContext);
    // const [username, setUsername] = useState('')


    // const fetchUserData = async () => {
    //     const user = await getCreator(props.course.creator._id);
    //     setUsername(user?.username);
    // };

    // fetchUserData();

    const fetchUserData = async () => {
        if (localStorage.getItem('auth-token')) {
            try {
                const data = await userEnrollCourse(props.course._id);
                setIsUserEnroll(data.success);
                // console.log(data.success);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        }
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
                    <h5 className='course-creator'>Dr. {props.course.creator.username}</h5>
                    <div className="line" />
                    {
                        isUserEnroll ?
                            <div className="info">
                                <div className="rating">
                                    <Stars rating={props.course.rating} />
                                    <p>{props.course.rating}</p>
                                </div>
                                <Link to={`/watchCourse/${props.course._id}`}>
                                    <button className='course-description'>Watch the course <ArrowRightOutlined /></button>
                                </Link>
                            </div>
                            :
                            <div className="info">
                                <div className="price">
                                    <p className="new-price">{props.course.price} Da</p>
                                    {props.course.old_price &&
                                        <p className="old-price">{props.course.old_price} Da</p>
                                    }
                                </div>
                                <div className="rating">
                                    <Stars rating={props.course.rating} />
                                    <p>{props.course.rating}</p>
                                </div>
                            </div>
                    }
                </div>
            </div>
        </Link>
    )
}

export default Item