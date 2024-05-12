import React, { useContext, useEffect, useState } from 'react'
import './item.css'

import { ArrowRightOutlined } from '@ant-design/icons';


import { Link } from 'react-router-dom'
import { ShopContext } from '../../Context/ShopContext'
import Stars from './Stars'
import axios from 'axios';
import LinearProgressWithLabel from '../LinearWithValueLabel';


const Item = (props) => {

    const { userEnrollCourse, getCreator } = useContext(ShopContext);
    const [isUserEnroll, setIsUserEnroll] = useState(false);
    const [username, setUsername] = useState('');
    const [userId, setUserId] = useState('');
    const [progress, setProgress] = useState({});



    // console.log(props.course);



    useEffect(() => {
        const fetchUserData = async () => {
            if (!props.course.creator.username) {
                const user = await getCreator(props.course.creator);
                setUsername(user?.username);
            }
            if (localStorage.getItem('auth-token')) {
                try {
                    const data = await userEnrollCourse(props.course._id);
                    setIsUserEnroll(data.success);
                    setUserId(data.user?._id);
                    // console.log(data.success);
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            }
        };
    
        fetchUserData();
    
        const fetchProgress = async () => {
            if(userId){
                try {
                    const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/getprogress/user/${userId}/course/${props.course._id}`);
                    setProgress(response.data.progress);
    
                } catch (error) {
                    console.error('Error updating progress:', error);
                    return null;
                }
            }
        };
    
        fetchProgress();

    },[username, isUserEnroll, progress?.length])

    return (
        <Link to={'/course/' + props.course._id}>
            <div className='course' onClick={() => window.scrollTo(0, 0)}>
                <div className="top">
                    <img className='course-image' src={props.course.image} />
                </div>
                <div className="down">
                    <h3 className='coursecard-title'>{props.course.title}</h3>
                    <h4 className='course-description'>{props.course.small_description}</h4>

                    <div className='bottom'>
                        <h5 className='course-creator'>Dr. {props.course.creator.username ? props.course.creator.username : username}</h5>
                        <div className="line" />
                        {
                            isUserEnroll ?
                                <div>
                                    <div className='watch-progress'>
                                        <LinearProgressWithLabel progress={progress?.progress ? progress?.progress : 0} />
                                    </div>
                                    <div className="info">
                                        <div className="rating">
                                            <Stars rating={props.course.rating} />
                                            <p>{props.course.rating}</p>
                                        </div>
                                        <Link to={`/watchCourse/${props.course._id}`}>
                                            <button className='course-description'>Watch the course </button>
                                        </Link>
                                    </div>
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
            </div>
        </Link>
    )
}

export default Item