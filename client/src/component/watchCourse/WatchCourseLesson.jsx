import { Rating } from '@mui/material';
import { Button, Flex, message, Rate } from 'antd'
import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
// import { Flex, Rate } from 'antd';
const desc = ['terrible', 'bad', 'normal', 'good', 'wonderful'];

import ronald from './../../assets/images/ronald.png'
import axios from 'axios';
import { ShopContext } from '../../Context/ShopContext';

const WatchCourseLesson = ({ course, activeLesson, setActiveLesson, user, fullComment}) => {



    const [value, setValue] = useState(fullComment?.rating);
    const [comment, setComment] = useState(fullComment?.comment);
    // const [prevComment, setPrevComment] = useState({});
    const [disable, setDisable] = useState(false);

    useEffect(() => {
        const fetchComment = () => {
            if (fullComment) {
                setComment(fullComment.comment);
                setValue(fullComment.rating);
            }
        }
    
        fetchComment();
    },[fullComment])


    const submitComment = async() => {
        setDisable(true);
        const fullDataComment = {
            user: user._id,
            course: course._id,
            comment,
            rating: value
        }
        try {
            const response = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/addComment`,fullDataComment);
            // console.log(response.data);
            if (response.data.success) 
                message.success('comment added successfully');
        } catch {
            message.warning('Error wihle submitting comment');
        } finally{
            setDisable(false)
        }
    }


    const nextLesson = () => {
        if (activeLesson.lessonIndex < course.chapters[activeLesson.chapterIndex].lessons.length - 1) {
            setActiveLesson({ ...activeLesson, lessonIndex: activeLesson.lessonIndex + 1 })
        } else {
            if (activeLesson.chapterIndex < course.chapters.length - 1) {
                setActiveLesson({ ...activeLesson, chapterIndex: activeLesson.chapterIndex + 1, lessonIndex: 0 })
            } else {
                setActiveLesson({ chapterIndex: -1, lessonIndex: -1 })
                message.success('congratulations, you are completed all course chapters')
            }
        }
    }

    return (
        <div className='hoho'>
            {
                (activeLesson?.lessonIndex >= 0 && activeLesson?.chapterIndex >= 0) ? (
                    <div className='watch-lesson'>
                        <div className='watchCourse-info-btn'>
                            <div className='watchCourse-info'>
                                <p className='chapter-title'>{course.chapters[activeLesson?.chapterIndex].title} </p>
                                <p className='lesson-title'>{activeLesson?.lessonIndex} - {course.chapters[activeLesson?.chapterIndex].lessons[activeLesson?.lessonIndex].title}</p>
                            </div>
                            <button className='next-lesson-btn' onClick={nextLesson}>Next Lesson</button>
                        </div>
                        <video
                            className='lesson-video'
                            controls
                            // ref={videoRef}
                            src={course.chapters[activeLesson?.chapterIndex].lessons[activeLesson?.lessonIndex].videoUrl}
                            // width={'100%'}
                            // height={'400px'}
                        ></video>


                    </div>
                ) : (
                    (activeLesson?.lessonIndex < 0 && activeLesson?.chapterIndex < 0) ? (
                        <div className='watch-koko'>
                            <Link to={'/'}>
                                back to home
                            </Link>
                            <p>
                                congratulations, you completed all course chapters
                            </p>

                            <div className='comment-div'>
                                <div className='comment-Up'>
                                    <div className="userInfo">
                                        {/* <img src={course.user.avatar} alt='avatar' /> */}
                                        <img src={user.picture} alt="" className='comment-avatar' />
                                        <p>{user.username}</p>
                                    </div>
                                    <Rate tooltips={desc} onChange={setValue} value={value} />
                                    {/* <Flex gap="middle" vertical> */}
                                    {/* {value ? <span>{desc[value - 1]}</span> : null} */}
                                    {/* </Flex> */}
                                </div>
                                <div>
                                    <textarea name='comment' placeholder='write here ...' className='commnet-input' onChange={(e) => setComment(e.target.value)} value={comment} />
                                </div>
                                <div className='button-div'>
                                    <div></div>
                                    {/* <button disabled={false} onClick={submitComment} className='send-comment'>Submit</button> */}
                                    <Button onClick={submitComment} type='primary' disabled={disable} >Submit</Button>
                                </div>
                            </div>

                        </div>
                    ) : (
                        <div className='watch-koko'>
                            <p>
                                please select the first Lesson
                            </p>
                        </div>
                    )
                )
            }

        </div>
    )
}

export default WatchCourseLesson;